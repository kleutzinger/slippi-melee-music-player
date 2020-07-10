const config = {
  slippi_rec_dir        : 'C:\\Users\\kevin\\Documents\\Slippi',
  // end game when no new frames for this many ms
  fileChangeTimeoutMs   : 500,
  // how often to poll for file change time delta
  fileChangeDeltaPollMs : 250,
  autoClose2ndWebpage   : false, // broken
  autoOpenWebpageOnRun  : false, // works
  discardRoyaltyFree    : false, // set to false for a lol
  stage_id_info         : {
    '2'  : {
      dir_name   : 'fountain',
      stage_name : 'FOUNTAIN_OF_DREAMS'
    },
    '8'  : {
      dir_name   : 'yoshis',
      stage_name : 'YOSHIS_STORY'
    },
    '31' : {
      dir_name   : 'battlefield',
      stage_name : 'BATTLEFIELD'
    },
    '32' : {
      dir_name   : 'final',
      stage_name : 'FINAL_DESTINATION'
    },
    '3'  : {
      dir_name   : 'stadium',
      stage_name : 'POKEMON_STADIUM'
    },
    '28' : {
      dir_name   : 'dreamland',
      stage_name : 'DREAM_LAND_N64'
    },
    '4'  : {
      stage_name : 'PRINCESS_PEACHS_CASTLE'
    },
    '5'  : {
      stage_name : 'KONGO_JUNGLE'
    },
    '6'  : {
      stage_name : 'BRINSTAR'
    },
    '7'  : {
      stage_name : 'CORNERIA'
    },
    '9'  : {
      stage_name : 'ONETT'
    },
    '10' : {
      stage_name : 'MUTE_CITY'
    },
    '11' : {
      stage_name : 'RAINBOW_CRUISE'
    },
    '12' : {
      stage_name : 'JUNGLE_JAPES'
    },
    '13' : {
      stage_name : 'GREAT_BAY'
    },
    '14' : {
      stage_name : 'HYRULE_TEMPLE'
    },
    '15' : {
      stage_name : 'BRINSTAR_DEPTHS'
    },
    '16' : {
      stage_name : 'YOSHIS_ISLAND'
    },
    '17' : {
      stage_name : 'GREEN_GREENS'
    },
    '18' : {
      stage_name : 'FOURSIDE'
    },
    '19' : {
      stage_name : 'MUSHROOM_KINGDOM_I'
    },
    '20' : {
      stage_name : 'MUSHROOM_KINGDOM_II'
    },
    '22' : {
      stage_name : 'VENOM'
    },
    '23' : {
      stage_name : 'POKE_FLOATS'
    },
    '24' : {
      stage_name : 'BIG_BLUE'
    },
    '25' : {
      stage_name : 'ICICLE_MOUNTAIN'
    },
    '26' : {
      stage_name : 'ICETOP'
    },
    '27' : {
      stage_name : 'FLAT_ZONE'
    },

    '29' : {
      stage_name : 'YOSHIS_ISLAND_N64'
    },
    '30' : {
      stage_name : 'KONGO_JUNGLE_N64'
    }
  }
};

module.exports = config;
