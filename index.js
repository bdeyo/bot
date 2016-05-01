var env = require('./config.json'),
	Tuttlebot = require('./tuttlebot/index.js'),
	AuthDetails = require('./auth.json'),
	Discord = require('discord.js');

var ins = new Tuttlebot;
var disjs = new Discord.Client();

disjs.on("ready", function () {
	console.log("Ready to start. Channels: " + disjs.channels.length);
});

disjs.on('message', function(msg) {
	if (typeof ins.loadKeywords() !== 'undefined' && ins.loadKeywords().length > 0) {
		ins.checkMessageForKeywords(msg.content, ins.loadKeywords(), function(keyword) {
			if (keyword != 0) {
				ins.runKeywordFunction(ins.getKeyByValue(ins.keywords, keyword), keyword, msg, function(reply) {
					disjs.reply(msg, reply);
				});
			}
		});
	}
});

disjs.on('disconnected', function() {
	console.log('Disconnected.');
	process.exit(1);
});

disjs.login(AuthDetails.email, AuthDetails.password);
