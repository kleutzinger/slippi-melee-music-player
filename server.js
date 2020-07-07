var open = require('open');

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
  socket.on('messageChange', function(data) {
    console.log(data);
    socket.emit('receive', data.message.split('').reverse().join(''));
  });
  socket.on('test', (d) => {
    console.log(d);
  });
});

setInterval(() => {
  io.emit('ping', { song: 'testo' });
}, 2000);

// open(`http://localhost:${port}`);
