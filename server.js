var open = require('open');
const config = require('./config.js');
console.log(config);
const path = require('path');
const homedir = require('os').homedir();
console.log(`homedir ${homedir}`);

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5669;

app.use(express.static(path.join(__dirname, '/web')));
// app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/sounds', express.static(path.join(process.cwd(), 'sounds')));

const server = app.listen(port, () => {
  console.log('Listening on port: ' + port);
});
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  console.log('connection');
  // socket.emit('startSong', config.stage_id_info['8'].song_paths[0]);
});

// io.emit('startSong', { song: 'testo' });
// setInterval(() => {
//   io.emit('stopSong', { song: 'testo' });
// }, 5000);

function infoToSong(stage_info) {
  let zeroth_song = stage_info.song_paths[0];
  let outSong = {};
  outSong['stage_name'] = stage_info['stage_name'];
  if (typeof zeroth_song === 'string') {
    outSong['loop'] = zeroth_song;
  } else if (typeof zeroth_song === 'object') {
    outSong['loop'] = zeroth_song['loop'];
    outSong['intro'] = zeroth_song['intro'];
  }
  return outSong;
}

function playSongForStage(stage_info) {
  io.emit('startSong', infoToSong(stage_info));
}

// open(`http://localhost:${port}`);

// Slippi stuff below ******

const { default: SlippiGame } = require('slp-parser-js');
const chokidar = require('chokidar');
const _ = require('lodash');
var stage_id_info = config.stage_id_info;
// console.log(stage_id_info);
const listenPath = process.argv[2] || config['slippi_rec_dir'];
console.log(`Listening at: ${listenPath}`);
const fs = require('fs');

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

  let gameState, settings, stats, frames, latestFrame, gameEnd;
  try {
    let game = _.get(gameByPath, [ path, 'game' ]);
    if (!game) {
      console.log(`New file at: ${path}`);
      game = new SlippiGame(path);
      gameByPath[path] = {
        game  : game,
        state : {
          settings         : null,
          detectedPunishes : {}
        }
      };
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
    console.log(settings);
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
