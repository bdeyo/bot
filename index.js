try {
	var env = require('./config.json');
} catch (e){
	env.debug = false;
	env.respondToInvalid = false;
}

try {
	var Tuttlebot = require('./tuttlebot/index.js');
} catch (e){
	console.log("Please create an index.js file in the bot folder"+e.stack);
	process.exit();
}

try {
	var AuthDetails = require('./auth.json');
} catch (e){
	console.log("Please create an auth.json file with account email and password"+e.stack);
	process.exit();
}

try {
	var Discord = require("discord.js");
} catch (e){
	console.log("Please run npm install discord.js"+e.stack);
	process.exit();
}

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
