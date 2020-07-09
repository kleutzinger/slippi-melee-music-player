const config = {
  slippi_rec_dir        : 'C:\\Users\\kevin\\Documents\\Slippi',
  vlc_path              : 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
  // end game when no new frames for this many ms
  fileChangeTimeoutMs   : 500,
  // how often to poll for file change time delta
  fileChangeDeltaPollMs : 250,
  autoClose2ndWebpage   : false, // broken
  autoOpenWebpageOnRun  : false, // works
  stage_id_info         : {
    '2'  : {
      basedir    : 'fountain',
      song_paths : [
        'sounds/dreamland-royalty-free.ogg',
        {
          intro : 'sounds/fountain-intro.ogg',
          loop  : 'sounds/fountain.ogg'
        }
      ],
      stage_name : 'FOUNTAIN_OF_DREAMS'
    },
    '8'  : {
      basedir    : 'yoshis',
      song_paths : [
        'sounds/yoshis-story-royalty-free.ogg',
        'sounds/yoshis-story.ogg'
      ],
      stage_name : 'YOSHIS_STORY'
    },
    '31' : {
      basedir    : 'battlefield',
      song_paths : [
        'sounds/battlefield-royalty-free.ogg',
        'sounds/battlefield.ogg'
      ],
      stage_name : 'BATTLEFIELD'
    },
    '32' : {
      basedir    : 'final',
      song_paths : [
        'sounds/battlefield-royalty-free.ogg',
        'sounds/final-destination.ogg'
      ],
      stage_name : 'FINAL_DESTINATION'
    },
    '3'  : {
      song_paths : [ 'sounds/stadium-royalty-free.ogg', 'sounds/stadium.ogg' ],
      stage_name : 'POKEMON_STADIUM'
    },
    '28' : {
      basedir    : 'dreamland',
      song_paths : [
        'sounds/dreamland-royalty-free.ogg',
        'sounds/dreamland.ogg'
      ],
      stage_name : 'DREAM_LAND_N64'
    },
    '4'  : {
      song_paths : [],
      stage_name : 'PRINCESS_PEACHS_CASTLE'
    },
    '5'  : {
      song_paths : [],
      stage_name : 'KONGO_JUNGLE'
    },
    '6'  : {
      song_paths : [],
      stage_name : 'BRINSTAR'
    },
    '7'  : {
      song_paths : [],
      stage_name : 'CORNERIA'
    },

    '9'  : {
      song_paths : [],
      stage_name : 'ONETT'
    },
    '10' : {
      song_paths : [],
      stage_name : 'MUTE_CITY'
    },
    '11' : {
      song_paths : [],
      stage_name : 'RAINBOW_CRUISE'
    },
    '12' : {
      song_paths : [],
      stage_name : 'JUNGLE_JAPES'
    },
    '13' : {
      song_paths : [],
      stage_name : 'GREAT_BAY'
    },
    '14' : {
      song_paths : [],
      stage_name : 'HYRULE_TEMPLE'
    },
    '15' : {
      song_paths : [],
      stage_name : 'BRINSTAR_DEPTHS'
    },
    '16' : {
      song_paths : [],
      stage_name : 'YOSHIS_ISLAND'
    },
    '17' : {
      song_paths : [],
      stage_name : 'GREEN_GREENS'
    },
    '18' : {
      song_paths : [],
      stage_name : 'FOURSIDE'
    },
    '19' : {
      song_paths : [],
      stage_name : 'MUSHROOM_KINGDOM_I'
    },
    '20' : {
      song_paths : [],
      stage_name : 'MUSHROOM_KINGDOM_II'
    },
    '22' : {
      song_paths : [],
      stage_name : 'VENOM'
    },
    '23' : {
      song_paths : [],
      stage_name : 'POKE_FLOATS'
    },
    '24' : {
      song_paths : [],
      stage_name : 'BIG_BLUE'
    },
    '25' : {
      song_paths : [],
      stage_name : 'ICICLE_MOUNTAIN'
    },
    '26' : {
      song_paths : [],
      stage_name : 'ICETOP'
    },
    '27' : {
      song_paths : [],
      stage_name : 'FLAT_ZONE'
    },

    '29' : {
      song_paths : [],
      stage_name : 'YOSHIS_ISLAND_N64'
    },
    '30' : {
      song_paths : [],
      stage_name : 'KONGO_JUNGLE_N64'
    }
  }
};

module.exports = config;
