var $audio = $('#myAudio');
$('input').on('change', function(e) {
  var target = e.currentTarget;
  var file = target.files[0];
  var reader = new FileReader();

  console.log($audio[0]);
  if (target.files && file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $audio.attr('src', e.target.result);
      $audio.trigger('play');
    };
    reader.readAsDataURL(file);
  }
});

let bf_song = { loop: '/sounds/battlefield.ogg' };
let fountain_song = {
  loop  : '/sounds/fountain.ogg',
  intro : '/sounds/fountain-intro.ogg'
};

let startSong = (songObj) => {
  if (songObj.intro) {
    $audio.on('ended', function() {
      $audio.unbind('end');
      $audio.attr('src', songObj.loop);
      $audio.trigger('play');
      $audio.attr('loop', true);
    });
    $audio.attr('src', songObj.intro);
    $audio.attr('loop', false);
    $audio.trigger('play');
  } else {
    $audio.unbind('end');

    $audio.attr('src', songObj.loop);
    $audio.trigger('play');
    $audio.attr('loop', true);
  }
};

let stopSong = () => {
  $audio.trigger('pause');
};

startSong(fountain_song);
let $h1 = $('<h1 onclick="$(this).remove()">click to init</h1>');

$(document).ready(function() {
  $('<p>Hello</p>').appendTo('body');
  $h1.appendTo('body');
});

$('body').one('click', function() {
  setSong(bf_song);
});
