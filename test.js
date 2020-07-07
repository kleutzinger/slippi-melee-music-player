const { exec } = require('child_process');
const path = require('path');

const player_path = path.join(__dirname, '1by1.exe');
const song_path = path.join(__dirname, 'test.mp3');
console.log(player_path, song_path);
const cmd = `start /min "" "${player_path}" "${song_path}"`;
const nostart = `"${player_path}" "${song_path}"`;
// const cmd_arr = [ '/min', '', player_path, song_path ];
// var child = exec(nostart);
var child = require('child_process').execFile(player_path, [ song_path ], {
  windowsHide : false
});
console.log(child.pid);
// exec(cmd);
var spawn = require('child_process').spawn;
// setTimeout(() => {
//   console.log('killin');
//   child.kill();
// }, 3000);
// var child = spawn('start', cmd_arr, {
//   detached : false
// });

// process.kill(-child.pid);
setTimeout(() => {}, 100000000);
