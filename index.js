// Setting up required files the bot will need
//	* Some are required only for specific commands
try {
	var AuthDetails = require('./auth.json');
} catch (e){
	console.log("Please create an auth.json file with account email and password"+e.stack);
	process.exit();
}

try {
	var Discord = require('discord.io');
} catch (e){
	console.log("Please run npm install discord.io"+e.stack);
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
}

// Setting up Roles object for future reference
var roles = {};
roles.admin_id = 0;
roles.mod_id = 0;

// Setting up Games object for future reference
var games = {};
games.rolloff = false;

// Start client
var bot = new Discord.Client({
	token: AuthDetails.token,
	autorun: true
});

// Create commands
//	* usage - To be used by !help
//	* description - To be used by !help
//	* process - what gets run when command is called
var commands = {
	"dam": {
		usage: "",
		description: "returns image/gif",
		process: function(channel) {
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
		process: function(channel) {
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
		process: function(channel) {
			var result = 'https://i.giphy.com/S4mOmgmpBQAXm.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	"think": {
		usage: "",
		description: "spam chat",
		process: function(channel) {
			var result = "\n .\n      ⠰⡿⠿⠛⠛⠻⠿⣷\n⠀⠀⠀⠀⠀⠀⣀⣄⡀⠀⠀⠀⠀⢀⣀⣀⣤⣄⣀⡀\n⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠛⠛⣿⣿⣿⡛⠿⠷\n⠀⠀⠀⠀⠀⠘⠿⠿⠋⠀⠀⠀⠀⠀⠀⣿⣿⣿⠇\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁\
			\n\n⠀⠀⠀⠀⣿⣷⣄⠀⢶⣶⣷⣶⣶⣤⣀\n⠀⠀⠀⠀⣿⣿⣿⠀⠀⠀⠀⠀⠈⠙⠻⠗\n⠀⠀⠀⣰⣿⣿⣿⠀⠀⠀⠀⢀⣀⣠⣤⣴⣶⡄\n⠀⣠⣾⣿⣿⣿⣥⣶⣶⣿⣿⣿⣿⣿⠿⠿⠛⠃\n⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄\
			\n⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁\n⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁\n⠀⠀⠛⢿⣿⣿⣿⣿⣿⣿⡿⠟\n⠀⠀⠀⠀⠀⠉⠉⠉";
			bot.sendMessage({to: channel, message: result});
		}
	},
	"why": {
		usage: "",
		description: "returns gif",
		process: function(channel) {
			var result = 'https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif';
			bot.sendMessage({to: channel, message: result});
		}
	},
	"roll": {
		usage: "[#d#]",
		description: "dice roller, with single command giving a d20, otherwise rolling specified combo",
		process: function(channel, suffix) {
			if (games.rolloff){
				var roll_bot;
				var roll_usr;
			
				roll_bot = d20.roll(20);
				roll_usr = d20.roll(20);
				bot.sendMessage({to: channel, message:"rolled: " + roll_usr});
				setTimeout(function(){
					if (roll_bot > roll_usr)
						bot.sendMessage({to: channel, message:"MUAHAHAHA. My " + roll_bot + " p4wned your " + roll_usr + ". Get rekt."});
					else if (roll_usr > roll_bot)
						bot.sendMessage({to: channel, message:"Lucky roll... My " + roll_bot + " can't beat your " + roll_usr + "."});
					else
						bot.sendMessage({to: channel, message:"Tie? TIE!? Let's call that a win for me..."})
				;},500);
				
				games.rolloff = false;
			} else {
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
		}
	},
	"rolloff": {
		usage: "",
		description: "roll off against the bot (D20)",
		process: function(channel) {
			bot.sendMessage({to: channel, message:"A Challenger APPROACHES! Use !roll to compete against me!"});
			games.rolloff = true;
		}
	},
	"blown": {
		usage: "",
		description: "returns gif",
		process: function(channel) {
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
		process: function(channel) {
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
	}
};

// Load Roles object with needed roles
//	* the propVal checks may need to be updated on role name changes
function loadRoles(){
	for (var r in bot.servers[AuthDetails.server_id].roles){
		var role = bot.servers[AuthDetails.server_id].roles[r];
		var propVal;
		for (var prop in role){
			propVal = role[prop];
			if (prop == 'name' && propVal == 'Admin'){
				roles.admin_id = role['id'];
			}
			if (prop == 'name' && propVal == 'Moderator'){
				roles.mod_id = role['id'];
			}
		}
	}
}

// Compares user's roles and admin_id
function isAdmin(userID){
	var usrRoles = bot.servers[AuthDetails.server_id].members[userID].roles;
	for (var i = 0; i < usrRoles.length; i++){
		if (usrRoles[i] == roles.admin_id)
			return true;
	}
	return false;
}

// Ready trigger
bot.on('ready', function () {
	console.log("Ready to start.");
	try {
		loadRoles();
	} catch (e){
		console.log('Unable to load role IDs'+e.stack);
	}
});

// Disconnect trigger
bot.on('disconnected', function() {
	console.log('Disconnected.');
	process.exit(1);
});

// Message trigger
bot.on('message', function (user, userID, channelID, message, evt) {
	// if message starts with '!', a command has been entered
	if (message.substring(0,1) == '!' && userID != bot.id){
		var args = message.substring(1).toLowerCase().split(' ');
		var cmd = args[0];
		var suffix = args[1];
		var result = commands[cmd];
		
		if (cmd == 'help'){
			if (suffix){
				var com = commands[suffix];
				if (com){
					bot.sendMessage({to: userID, message: "!" + suffix + " " + com.usage + " -> " + com.description});
				} else {
					bot.sendMessage({to: userID, message: "No record for " + suffix});
				}
			} else {
				var info = "Available Commands: ";
				for (var cmd in commands){
					info += "!" + cmd;
					var usage = commands[cmd].usage;
					if (usage){
						info += " " + usage + "; ";
					} else {
						info += "; ";
					}
				}
				bot.sendMessage({to: userID, message: info});
			}
		} else if (result){
			try {
				result.process(channelID,suffix,userID);
			} catch (e){
				console.log("Command failed: " + cmd + ". " + e.stack);
			}
		} else {
			bot.sendMessage({to: channelID, message: "Not a command, use !help"});
		}
	}
});