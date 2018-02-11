# bot
[![Status](https://img.shields.io/badge/Status-Ready-green.svg?style=flat-square)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

Based on the bots created from these fine repositories:

> - https://github.com/Cleanse/InsomBot
> - https://github.com/chalda/DiscordBot

Used for a discord server, available commands: !help, !img, !why, !dam, !horse, !happy, !roll, !blown (more to come)

## Running:

`auth.json` file with a token for a Discord App, as well as an Imgur key, saved as `"imgur_key": "<key>"`.  To run, `node index.js` will get it going.  [Forever](https://www.npmjs.com/package/forever) (`forever start -a index.js`) can be used to extend bot uptime .

## Dependencies:

- [Python 2.7](https://www.python.org/downloads/)
- [Git (Windows)](https://gitforwindows.org/)
- `npm install node.js`
- `npm install discord.io`
- `npm install woor/discord.io#gateway_v6`

## Resources:

- [Initial Code Setup](https://medium.com/@renesansz/tutorial-creating-a-simple-discord-bot-9465a2764dc0)
- [Token/Application Setup](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)