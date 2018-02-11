try {
	var AuthDetails = require('./auth.json');
} catch (e){
	console.log("Please create an auth.json file with account email and password"+e.stack);
	process.exit();
}

try {
	var Discord = require('discord.io');
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


var bot = new Discord.Client({
	token: AuthDetails.token,
	autorun: true
});
console.log("username: " + bot.username + " ID: " + bot.id);

var commands = {
	"dam": {
		usage: "",
		description: "returns image/gif",
		process: function(bot, channel) {
			var rand = Math.floor(Math.random() * 2) + 1;
			var result;
			if (rand == 1)
				result = 'https://i.imgur.com/7lZwLKc.jpg';
			else
				result = 'https://i.imgur.com/VQLGJOL.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	"happy": {
		usage: "",
		description: "returns image/gif",
		process: function(bot, channel) {
			var rand = Math.floor(Math.random() * 2) + 1;
			var result;
			if (rand == 1)
			  result = 'https://i.imgur.com/gbXzYXp.gif';
			else
			  result = 'https://i.imgur.com/OxwIC0O.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	"horse": {
		usage: "",
		description: "returns horse gif",
		process: function(bot, channel) {
			var result = 'https://i.giphy.com/S4mOmgmpBQAXm.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	//NEEDS UPDATE
	"zzzimg": {
		usage: "<search term>",
		description: "searches imgur based on keyword",
		process: function(bot, channel, suffix) {
			var key = AuthDetails;
			var Imgur = require('imgur-search');
			
			var term = suffix;
			if(!term) {
				bot.sendMessage({to: channel, message:"No Search Term"});
				return;
			}
			new Imgur(key.imgur_key).search(term).then(function(result) {
				if (result.length == 0 || result == undefined) {
					bot.sendMessage({to: channel, message:"You suck at searching"});
				} else {
					var img = result[Math.floor(Math.random() * result.length)];
					bot.sendMessage({to: channel, message: img.link});
				}
			});
		}
	},
	"why": {
		usage: "",
		description: "returns gif",
		process: function(bot, channel) {
			var result = 'https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	"roll": {
		usage: "[#d#]",
		description: "dice roller, with single command giving a d20, otherwise rolling specified combo",
		process: function(bot, channel, suffix) {
			if(!suffix) {
				bot.sendMessage({to: channel, message:"rolled: " + d20.roll(20)});
			} else {
				var result;
				try {
					result = d20.roll(suffix);
				} catch (e){
					bot.sendMessage({to: channel, message:"Could not roll " + suffix});
					return;
				}
				if (!isNaN(result) && result != 'NaN')
					bot.sendMessage({to: channel, message:"Rolled: " + d20.verboseRoll(suffix)});
				else
					bot.sendMessage({to: channel, message:"Not a valid number"});
			}
		}
	},
	"rolloff": {
		usage: "",
		description: "Roll off against the bot (D20)",
		process: function(bot, channel) {
			var roll_bot;
			var roll_usr;
			
			roll_bot = d20.roll(20);
			roll_usr = d20.roll(20);
			bot.sendMessage({to: channel, message:"A Challenger APPROACHES!"});
			
			if (roll_bot > roll_usr)
				bot.sendMessage({to: channel, message:"MUAHAHAHA. My " + roll_bot + " p4wned your " + roll_usr + ". Get rekt."});
			else if (roll_usr > roll_bot)
				bot.sendMessage({to: channel, message:"Lucky roll... My " + roll_bot + " can't beat your " + roll_usr + "."});
			else
				bot.sendMessage({to: channel, message:"Tie? TIE!? Let's call that a win for me..."});
		}
	},
	"blown": {
		usage: "",
		description: "returns gif",
		process: function(bot, channel) {
			var result;
			var rand = Math.floor(Math.random() * 6);
			var gifs = [	'https://i.imgur.com/YGsTG5o.gif',
					'https://i.imgur.com/pBTk7MC.gif',
					'https://i.imgur.com/rfFWukr.gif',
					'https://media.giphy.com/media/OK27wINdQS5YQ/giphy.gif',
					'https://i.imgur.com/l4bJmRE.gif',
					'https://i.imgur.com/3WB3L.gif',
					'https://giphy.com/gifs/cheezburger-robots-screaming-NfEQd1ge1kP04']
					
			bot.sendMessage({to: channel, message:gifs[rand]});
		}
	},
	"weekend": {
		usage: "",
		description: "returns days until weekend",
		process: function(bot, channel) {
			var date = new Date();
			var day = date.getDay();
			var result = [  "Last day, Enjoy it!", 
					"4 Days Left. Got a case of the Mondays?", 
					"3 Days Left", 
					"2 Days Left.  Hump Day!",
					"1 Day Left",
					"FRIDAY!",
					"Less than 48 hours left..."];
					
			bot.sendMessage({to: channel, message:result[day]});
		}
	},
	"test": {
		usage: "Admin only",
		description: "",
		process: function(bot, channel, suffix) {
			var roles = channel.server.roles;
			if (suffix == "read"){
				if (msg.author.hasRole(roles[1])) {
					bot.sendMessage({to: channel, message:"Good afternoon, Mr. Admin.  JSON test below"});
					bot.sendMessage({to: channel, message:Stats.members});
				} else
					bot.sendMessage({to: channel, message:"Frig off..."});
			}
			if (suffix.match(/^write/)) {
				if (channel.author.hasRole(roles[1]))
					bot.sendMessage({to: channel, message:"Still adding write"});
				else
					bot.sendMessage({to: channel, message:"Don't even try..."});
			}
		}
	}
};

bot.on('ready', function () {
	console.log("Ready to start. Channels: " + bot.channels.length);
});


bot.on('disconnected', function() {
	console.log('Disconnected.');
	process.exit(1);
});

bot.on('message', function (user, userID, channelID, message, evt) {
	if (message.substring(0,1) == '!'){
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		var suffix = args[1];
		var result = commands[cmd];
		
		if (cmd == 'help'){
			var info = "Help is being updated!";
			bot.sendMessage({to: userID, message: info});
		} else if (result){
			try {
				result.process(bot,channelID,suffix);
			} catch (e){
				console.log("Command failed: " + cmd + ". " + e.stack);
			}
		} else {
			bot.sendMessage({to: channelID, message: "Not a command, use !help"});
		}
	}
});