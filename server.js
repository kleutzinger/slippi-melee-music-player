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
const sounds_dir = path.join(process.cwd(), 'sounds');
let static_directories = [];
console.log(`sounds dir ${sounds_dir}`);
console.log(`homedir ${homedir}`);

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

getDirectories(sounds_dir);

const setStaticDirs = (parent_dir) => {
  const dirs = getDirectories(parent_dir);
  dirs.map((dir) => {
    const joined = path.join(parent_dir, dir);
    app.use('/sounds', express.static(joined));
    // console.log(`setting static: sounds/${dir} (${joined})`);
  });
  console.log(`set ${dirs.length} stage dirs from ${parent_dir}`);
};
setStaticDirs(sounds_dir);

const server = app.listen(port, () => {
  console.log('Listening on port: ' + port);
  console.log(`open in browser: http://localhost:${port}/`);
});
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  let connectedCount = Object.keys(io.sockets.sockets).length;
  console.log(Object.keys(io.sockets.sockets));
  console.log(`connection number ${connectedCount}`);
  if (connectedCount > 1 && config.autoClose2ndWebpage) {
    socket.disconnect();
    // socket.emit('closePage');
    console.log('instance already running! closing');
  }
  // socket.emit('startSong', config.stage_id_info['8'].song_paths[0]);
});

// io.emit('startSong', { song: 'testo' });
// setInterval(() => {
//   io.emit('stopSong', { song: 'testo' });
// }, 5000);

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
console.log(infoToSong(config.stage_id_info['2']));

function playSongForStage(stage_info) {
  io.emit('startSong', infoToSong(stage_info));
}

if (config.autoOpenWebpageOnRun) {
  open(`http://localhost:${port}`);
}

// Slippi stuff below ******

var stage_id_info = config.stage_id_info;
// console.log(stage_id_info);
const listenPath = process.argv[2] || config['slippi_rec_dir'];
console.log(`Listening at: ${listenPath}`);
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
            `Game aborted (no new frames for at least ${config.fileChangeTimeoutMs}ms)`
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
    console.log('GAME ENDDDD');
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
