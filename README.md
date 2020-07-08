based on this  
https://github.com/project-slippi/slp-parser-js/blob/master/scripts/realtimeFileReads.js  
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