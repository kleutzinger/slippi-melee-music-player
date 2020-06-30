const { default: SlippiGame } = require('slp-parser-js');
const { exec } = require('child_process');
const chokidar = require('chokidar');
const _ = require('lodash');
var config = require('config');
var stage_id_info = config.get('stage_id_info');
// console.log(stage_id_info);
const listenPath = process.argv[2] || config.get('slippi_rec_dir');
console.log(`Listening at: ${listenPath}`);
const fs = require('fs');
const path = require('path');
var test_mp3 = path.join(__dirname, 'test.mp3');

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

    // You can uncomment the stats calculation below to get complex stats in real-time. The problem
    // is that these calculations have not been made to operate only on new data yet so as
    // the game gets longer, the calculation will take longer and longer
    // stats = game.getStats();

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
    playSongForStage2(stage_info);
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

  // Uncomment this if you uncomment the stats calculation above. See comment above for details
  // // Do some conversion detection logging
  // // console.log(stats);
  // _.forEach(stats.conversions, conversion => {
  //   const key = `${conversion.playerIndex}-${conversion.startFrame}`;
  //   const detected = _.get(gameState, ['detectedPunishes', key]);
  //   if (!detected) {
  //     console.log(`[Punish Start] Frame ${conversion.startFrame} by player ${conversion.playerIndex + 1}`);
  //     gameState.detectedPunishes[key] = conversion;
  //     return;
  //   }

  //   // If punish was detected previously, but just ended, let's output that
  //   if (!detected.endFrame && conversion.endFrame) {
  //     const dmg = conversion.endPercent - conversion.startPercent;
  //     const dur = conversion.endFrame - conversion.startFrame;
  //     console.log(
  //       `[Punish End] Player ${conversion.playerIndex + 1}'s punish did ${dmg} damage ` +
  //       `with ${conversion.moves.length} moves over ${dur} frames`
  //     );
  //   }

  //   gameState.detectedPunishes[key] = conversion;
  // });

  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    const endTypes = {
      1 : 'TIME!',
      2 : 'GAME!',
      7 : 'No Contest'
    };

    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown';

    const lrasText =
      gameEnd.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}`
        : '';
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }

  // console.log(`Read took: ${Date.now() - start} ms`);
});
function resolveRelativePath(rel_path) {
  rel_path = path.normalize(rel_path);
  let absolute_path = path.join(__dirname, rel_path);
  return absolute_path;
}

function playSongForStage(stage_info) {
  let absolute_path = resolveRelativePath(stage_info['mp3_paths'][0]);
  if (fs.existsSync(absolute_path)) {
    console.log(`file exists, playing ${absolute_path}`);
    exec(`"C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" -L "${absolute_path}"`);
  } else {
    console.log(`no such file ${absolute_path}`);
  }
}

function playSongForStage2(stage_info) {
  const song_path = resolveRelativePath(stage_info['mp3_paths'][0]);
  const player_path = path.join(__dirname, '1by1.exe');
  if (fs.existsSync(song_path)) {
    console.log(`file exists, playing ${song_path}`);
    var child = require('child_process').execFile(player_path, [ song_path ], {
      windowsHide : true,
      detached    : true
    });
  } else {
    console.log(`no such file ${song_path}`);
  }
}
