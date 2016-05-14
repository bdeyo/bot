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

var commands = {
	"dam": {
		usage: "!dam",
		description: "return image/gif",
		process: function(bot, msg) {
			var rand = Math.floor((Math.random() * 2) + 1);
			var result;
			if (rand == 1)
				result = 'https://i.imgur.com/7lZwLKc.jpg';
			else
				result = 'https://i.imgur.com/VQLGJOL.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"happy": {
		usage: "!happy",
		description: "returns image/gif",
		process: function(bot, msg) {
			var rand = Math.floor((Math.random() * 2) + 1);
			var result;
			if (rand == 1)
			  result = 'https://i.imgur.com/gbXzYXp.gif';
			else
			  result = 'https://i.imgur.com/OxwIC0O.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"horse": {
		usage: "!horse",
		description: "returns horse gif",
		process: function(bot, msg) {
			var result = 'https://i.giphy.com/S4mOmgmpBQAXm.gif';
			bot.sendMessage(msg.channel, result);
		}
	},
	"img": {
		usage: "!img <search term>",
		description: "searches imgur based on keyword",
		process: function(bot, msg, suffix) {
			var key = AuthDetails;
			var Imgur = require('imgur-search');
			//var ImgurResult = new Imgur(key.imgur_key);
			
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
		usage: "<reaction>",
		description: "returns gif",
		process: function(bot, msg) {
			var result = 'https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif';
			bot.sendMessage(msg.channel, result);
		}
	}
};

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to start. Channels: " + bot.channels.length);
});

bot.on('disconnected', function() {
	console.log('Disconnected.');
	process.exit(1);
});

bot.on("message", function (msg) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)){
		var cmdTxt = msg.content.split(" ")[0].substring(1);
        	var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
		var cmd = commands[cmdTxt];
		
        	if(cmdTxt === "help"){
            	//help is special since it iterates over the other commands
			bot.sendMessage(msg.author,"Available Commands:", function(){
				for(var cmd in commands) {
					var info = "!" + cmd;
					var usage = commands[cmd].usage;
					if(usage){
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description){
						info += "\n\t" + description;
					}
					bot.sendMessage(msg.author,info);
				}
			});
        	} else if(cmd) {
			try{
				cmd.process(bot,msg,suffix);
			} catch(e){
				if(Config.debug){
					bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
				}
			}
		} else {
			if(Config.respondToInvalid){
				bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
			}
		}
	} else {
	//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
        }
        
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                bot.sendMessage(msg.channel,msg.author + ", you called?");
        }
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
