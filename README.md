based on this  
https://github.com/project-slippi/slp-parser-js/blob/master/scripts/realtimeFileReads.js  
### How to modify songs  
songs are stored in the sounds/  
add your own audio files (mp3 or ogg) to your desired stage  
I've included royalty-free versions which can be toggled in the web interface  
You can add stages other than the legal stages by creating a new directory and modifiying the 'dir' field in config.js for that stage  

### RUNNING  
requirements: nodejs, npm  
put sound files (preferrably oggs for gapless playback) in sounds/ directory  
modify config.js to point to your slippi recordings folder [slippi_rec_dir]  
(probably ```My Documents/Slippi```)  
clone this repository, cd to directory then run
```
npm install
node server.js
```

open ```http://localhost:5669/``` in a browser.  
then start up slippi and it'll play songs when games start.  
slippi recordings must be ON.  
change Site Settings->Sound to Allow  
![](https://i.imgur.com/DwVBrY0.png)  
this allows the music to play automatically before you've interacted with the page  