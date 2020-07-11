function initSocket() {
  socket = io.connect();
  console.log('init socket');

  socket.on('ping', (data) => {
    console.log(data);
  });

  socket.on('startSong', (data) => {
    console.log('start song');
    console.log(data);
    // console.log('overwrite data:', fountain_song);
    // data = fountain_song;
    if (typeof data === 'string') {
      data = { loop: data };
    }
    startSong(data);
    $('#nowPlaying').text(data.loop);
  });

  socket.on('stopSong', (data) => {
    console.log('stop song');
    stopSong();
  });

  socket.on('closePage', (data) => {
    // socket.disconnect();
    window.close();
  });

  socket.on('askRoyalty', (data) => {
    sendRoyalty();
  });

  function sendRoyalty() {
    const new_val = $('#royalty').val();
    console.log('emit royalty ', new_val);
    socket.emit('royalty', { val: new_val });
  }
  $('#royalty').change(() => {
    sendRoyalty();
  });
}
