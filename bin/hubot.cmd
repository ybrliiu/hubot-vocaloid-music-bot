@echo off

call npm install
call npm run compile
SETLOCAL
SET PATH=node_modules\.bin;node_modules\hubot\node_modules\.bin;%PATH%

node_modules\.bin\hubot.cmd --name "hubot-vocaloid-music-bot" %* 
