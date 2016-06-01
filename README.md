# bot
[![Status](https://img.shields.io/badge/Status-Ready-green.svg?style=flat-square)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

Based on the bots created from these fine repositories:

>https://github.com/Cleanse/InsomBot
>https://github.com/chalda/DiscordBot

Used for a discord server, available commands: !help, !img, !why, !dam, !horse, !happy, !roll (more to come)

**Running:**

`auth.json` file with an email and password for a Discord account, as well as an Imgur key, saved as `"imgur_key": "<key>"`.  To run, `node index.js` will get it going.  [Forever](https://www.npmjs.com/package/forever) (`forever start -a index.js`) can be used to extend bot uptime .
