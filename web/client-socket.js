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
    stopSong();
  });
}
