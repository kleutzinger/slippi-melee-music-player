var open = require('open');
const config = require('./config.js');
// console.log(config);
const path = require('path');
const fs = require('fs');
const { default: SlippiGame } = require('slp-parser-js');
const chokidar = require('chokidar');
const _ = require('lodash');
const { connect } = require('http2');

const homedir = require('os').homedir();
if (!config.slippi_rec_dir) {
  config.slippi_rec_dir = path.join(homedir, 'Documents', 'Slippi');
}
let foundSlippiFiles = false;
try {
  for (file of fs.readdirSync(config.slippi_rec_dir)) {
    if (file.endsWith('.slp')) {
      foundSlippiFiles = true;
      break;
    }
  }
} catch (err) {
  console.log(err);
}
if (!foundSlippiFiles) {
  console.log(`warning! no .slp files found in:
     ${config.slippi_rec_dir}
please modify your config.js -> slippi_rec_dir
  `);
}
const sounds_dir = path.join(process.cwd(), 'sounds');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5669;

app.use(express.static(path.join(__dirname, '/web')));
// app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/sounds', express.static(sounds_dir));

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFiles = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const setStaticDirs = (parent_dir) => {
  const dirs = getDirectories(parent_dir);
  dirs.map((dir) => {
    const joined = path.join(parent_dir, dir);
    app.use('/sounds', express.static(joined));
    // console.log(`setting static: sounds/${dir} (${joined})`);
  });
  // console.log(`set ${dirs.length} stage dirs from ${parent_dir}`);
};
setStaticDirs(sounds_dir);

const server = app.listen(port, () => {
  // console.log('Listening on port: ' + port);
});
const io = require('socket.io')(server);
io.sockets.on('connection', function(socket) {
  let connectedCount = Object.keys(io.sockets.sockets).length;
  if (config.socketDebug) {
    console.log(Object.keys(io.sockets.sockets));
    console.log(`connection number ${connectedCount}`);
  }
  if (connectedCount > 1 && config.autoClose2ndWebpage) {
    // socket.disconnect();
    // socket.emit('closePage');
    console.log('multiple instances running! closing');
  }
});

function infoToSong(stage_info) {
  try {
    stage_dir = path.join(sounds_dir, stage_info.dir_name);
    // console.log(getFiles(stage_dir));
    song_files = getFiles(stage_dir);
    song_files = song_files.filter(
      (f) => !f.includes('royalty-free') || !config.discardRoyaltyFree
    );
    rand_song_file = _.shuffle(song_files)[0];
    return { loop: `sounds/${rand_song_file}` };
  } catch (err) {
    console.log(`error getting songs ${stage_info} \n ${err}`);
  }
}

function playSongForStage(stage_info) {
  io.emit('startSong', infoToSong(stage_info));
}

if (config.autoOpenWebpageOnRun) {
  console.log('opening local webpage');
  open(`http://localhost:${port}`);
} else {
  console.log(`Please open in web browser:\n   http://localhost:${port}`);
}

// ************************   Slippi stuff below ****** ******

var stage_id_info = config.stage_id_info;
// console.log(stage_id_info);
const listenPath = process.argv[2] || config['slippi_rec_dir'];
// console.log(`Looking for Slippi files at: ${listenPath}`);
var timeOfLastFileChange = null;
var gameAborted = false;

const watcher = chokidar.watch(listenPath, {
  ignored       : '!*.slp', // TODO: This doesn't work. Use regex?
  depth         : 0,
  persistent    : true,
  usePolling    : true,
  ignoreInitial : true
});

const gameByPath = {};
watcher.on('change', (path) => {
  const start = Date.now();
  timeOfLastFileChange = start;
  let gameState, settings, stats, frames, latestFrame, gameEnd;
  try {
    let game = _.get(gameByPath, [ path, 'game' ]);
    if (!game) {
      console.log(`New file at: ${path}`);
      gameAborted = false;
      game = new SlippiGame(path);
      gameByPath[path] = {
        game  : game,
        state : {
          settings         : null,
          detectedPunishes : {}
        }
      };
      var slippiFileActiveCheck = setInterval(() => {
        let fileChangeTimeDelta = Date.now() - timeOfLastFileChange;
        if (fileChangeTimeDelta > config.fileChangeTimeoutMs) {
          gameAborted = true;
          clearInterval(slippiFileActiveCheck);
          io.emit('stopSong');
          console.log(
            `Game ended (no new frames for at least ${config.fileChangeTimeoutMs}ms)`
          );
        }
      }, config.fileChangeDeltaPollMs);
    }

    gameState = _.get(gameByPath, [ path, 'state' ]);

    settings = game.getSettings();

    frames = game.getFrames();
    latestFrame = game.getLatestFrame();
    gameEnd = game.getGameEnd();
  } catch (err) {
    console.log(err);
    return;
  }

  if (!gameState.settings && settings) {
    // new game startup
    console.log(`[Game Start] New game has started`);
    // console.log(settings);
    console.log(settings.stageId);
    let stage_id = settings.stageId;
    console.log(stage_id_info[stage_id]);
    let stage_info = stage_id_info[stage_id];
    playSongForStage(stage_info);
    gameState.settings = settings;
  }

  // console.log(`We have ${_.size(frames)} frames.`);
  _.forEach(settings.players, (player) => {
    const frameData = _.get(latestFrame, [ 'players', player.playerIndex ]);
    if (!frameData) {
      return;
    }

    // console.log(
    //   `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` +
    //     `${frameData.post.stocksRemaining} stocks`
    // );
  });
  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    const endTypes = {
      1 : 'TIME!',
      2 : 'GAME!',
      7 : 'No Contest'
    };
    console.log('Game over. Ending Song');
    io.emit('stopSong');
    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown';

    const lrasText =
      gameEnd.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}`
        : '';
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }
  // console.log(`Read took: ${Date.now() - start} ms`);
});
