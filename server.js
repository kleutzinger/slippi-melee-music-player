var open = require('open');

// opens the url in the default browser
// specify the app to open in
// opn('http://sindresorhus.com', {app: 'firefox'});

var express = require('express'),
  app = express(),
  port = process.env.PORT || 5669;

app.use(express.static(__dirname + '/web'));
app.use('/sounds', express.static(__dirname + '/sounds'));

app.listen(port);

// open(`http://localhost:${port}`);
