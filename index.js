try {
	var Config = require('./config.json');
} catch (e){
	Config.debug = false;
	Config.respondToInvalid = false;
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

try {
	var d20 = require('d20');
} catch (e){
	console.log("Please run npm install d20"+e.stack);
}

try {
	var Stats = require("./user_stats.json");
} catch (e){
	console.log("Unable to provide stats: Missing file");
	Stats.debug = true;
}

var bot = new Discord.Client();

var commands = {
	"dam": {
		usage: "",
		description: "returns image/gif",
		process: function(bot, msg) {
			var rand = Math.floor(Math.random() * 2) + 1;
			var result;
			if (rand == 1)
				result = 'https://i.imgur.com/7lZwLKc.jpg';
			else
				result = 'https://i.imgur.com/VQLGJOL.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"happy": {
		usage: "",
		description: "returns image/gif",
		process: function(bot, msg) {
			var rand = Math.floor(Math.random() * 2) + 1;
			var result;
			if (rand == 1)
			  result = 'https://i.imgur.com/gbXzYXp.gif';
			else
			  result = 'https://i.imgur.com/OxwIC0O.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"horse": {
		usage: "",
		description: "returns horse gif",
		process: function(bot, msg) {
			var result = 'https://i.giphy.com/S4mOmgmpBQAXm.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"img": {
		usage: "<search term>",
		description: "searches imgur based on keyword",
		process: function(bot, msg, suffix) {
			var key = AuthDetails;
			var Imgur = require('imgur-search');
			
			var term = suffix;
			if(!term) {
				bot.sendMessage(msg.channel, "No Search Term");
				return;
			}
			new Imgur(key.imgur_key).search(term).then(function(result) {
				if (result.length == 0 || result == undefined) {
					bot.sendMessage(msg.channel, "You suck at searching");
				} else {
					var img = result[Math.floor(Math.random() * result.length)];
					bot.sendMessage(msg.channel, img.link);
				}
			});
		}
	},
	"why": {
		usage: "",
		description: "returns gif",
		process: function(bot, msg) {
			var result = 'https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"roll": {
		usage: "[#d#]",
		description: "dice roller, with single command giving a d20, otherwise rolling specified combo",
		process: function(bot, msg, suffix) {
			if(!suffix) {
				bot.sendMessage(msg.channel, msg.author + " rolled: " + d20.roll(20));
			} else {
				var result;
				try {
					result = d20.roll(suffix);
				} catch (e){
					bot.sendMessage(msg.channel, msg.author + " Could not roll " + suffix);
					return;
				}
				if (!isNaN(result) && result != 'NaN')
					bot.sendMessage(msg.channel, msg.author + " rolled: " + d20.verboseRoll(suffix));
				else
					bot.sendMessage(msg.channel, msg.author + " Not a valid number");
			}
		}
	},
	"rolloff": {
		usage: "",
		description: "Roll off against the bot (D20)",
		process: function(bot, msg) {
			var roll_bot;
			var roll_usr;
			
			roll_bot = d20.roll(20);
			roll_usr = d20.roll(20);
			bot.sendMessage(msg.channel, "A CHALLENGER APPROACHES!");
			
			if (roll_bot > roll_usr)
				bot.sendMessage(msg.channel, "MUAHAHAHA. My " + roll_bot + " p4wned your " + roll_usr + ". Get rekt.");
			else if (roll_usr > roll_bot)
				bot.sendMessage(msg.channel, "Lucky roll... My " + roll_bot + " can't beat your " + roll_usr + ".");
			else
				bot.sendMessage(msg.channel, "Tie? TIE!? Let's call that a win for me...");
		}
	},
	"blown": {
		usage: "",
		description: "returns gif",
		process: function(bot, msg) {
			var result;
			var rand = Math.floor(Math.random() * 6);
			var gifs = [	'https://i.imgur.com/YGsTG5o.gif',
					'https://i.imgur.com/pBTk7MC.gif',
					'https://i.imgur.com/rfFWukr.gif',
					'https://media.giphy.com/media/OK27wINdQS5YQ/giphy.gif',
					'https://i.imgur.com/l4bJmRE.gif',
					'https://i.imgur.com/3WB3L.gif',
					'https://giphy.com/gifs/cheezburger-robots-screaming-NfEQd1ge1kP04']
					
			bot.sendMessage(msg.channel, gifs[rand]);
		}
	},
	"weekend": {
		usage: "",
		description: "returns days until weekend",
		process: function(bot, msg) {
			var date = new Date();
			var day = date.getDay();
			var result = [  "Last day, Enjoy it!", 
					"4 Days Left. Got a case of the Mondays?", 
					"3 Days Left", 
					"2 Days Left.  Hump Day!",
					"1 Day Left",
					"FRIDAY!",
					"Less than 48 hours left..."];
					
			bot.sendMessage(msg.channel, result[day]);
		}
	},
	"test": {
		usage: "Admin only",
		description: "",
		process: function(bot, msg) {
			var roles = msg.channel.server.roles;
			if (msg.author.hasRole(roles[1])) {
				bot.sendMessage(msg.channel, "Good afternoon, Mr. Admin.  JSON test below");
				var tmp = JSON.parse(Stats);
 +				bot.sendMessage(msg.channel, tmp);
			} else
				bot.sendMessage(msg.channel, "Frig off...")
		}
	}
};

bot.on("ready", function () {
	console.log("Ready to start. Channels: " + bot.channels.length);
});

bot.on('disconnected', function() {
	console.log('Disconnected.');
	process.exit(1);
});

bot.on("message", function (msg) {
	if(msg.author.id != bot.user.id && msg.content[0] === '!'){
		var cmdTxt = msg.content.split(" ")[0].substring(1);
        	var suffix = msg.content.substring(cmdTxt.length+2);
		var cmd = commands[cmdTxt];
		
        	if(cmdTxt === "help"){
			var info = "Available Commands: ";
			for(var cmd in commands) {
				info += "!" + cmd;
				var usage = commands[cmd].usage;
				if(usage){
					info += " " + usage + "; ";
				}
				else
					info += "; ";
			}
			bot.sendMessage(msg.author,info);
        	} else if(cmd) {
			try{
				cmd.process(bot,msg,suffix);
			} catch(e){
				if(Config.debug){
					bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
				}
			}
		} else {
			bot.sendMessage(msg.author, " Invalid command, Sucka!  Maybe you need some !help");
		}
	} else if (msg.author != bot.user && msg.isMentioned(bot.user)) {
		bot.sendMessage(msg.channel,msg.author + ", you called?");
    	}
});

exports.addCommand = function(commandName, commandObject){
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
}
exports.commandCount = function(){
    return Object.keys(commands).length;
}

bot.login(AuthDetails.email, AuthDetails.password);
