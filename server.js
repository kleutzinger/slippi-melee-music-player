var open = require('open');
const homedir = require('os').homedir();
console.log(`homedir ${homedir}`);
// opens the url in the default browser
// specify the app to open in
// opn('http://sindresorhus.com', {app: 'firefox'});

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5669;

app.use(express.static(__dirname + '/web'));
app.use('/sounds', express.static(__dirname + '/sounds'));

const server = app.listen(port, () => {
  console.log('Listening on port: ' + port);
});
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  console.log('connection');
  socket.emit('startSong', { song: 'testo' });
});

// io.emit('startSong', { song: 'testo' });
setInterval(() => {
  io.emit('stopSong', { song: 'testo' });
}, 5000);

// open(`http://localhost:${port}`);
