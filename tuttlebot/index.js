var env = require('../config.json'),
	Imgur = require('./Imgur.js'),
	Why = require('./Why.js'),
	Help = require('./Help.js');

var Tuttlebot = function () {
	this.keywords = env.keywords;
	this.Help = new Help;
	this.Imgur = new Imgur;
	this.Why = new Why;
};

Tuttlebot.prototype.loadKeywords = function () {
	var result = [];
	for (var i in this.keywords) {
		if (this.keywords.hasOwnProperty(i)) {
			result.push(this.keywords[i]);
		}
	}
	return result;
}

Tuttlebot.prototype.checkMessageForKeywords = function(message, triggers, callback) {
	for( var i = 0; i != triggers.length; i++) {
		var substring = triggers[i];
		if (message.indexOf(substring) == 0) {
			return callback(substring);
		}
	}
	return callback(0);
}

Tuttlebot.prototype.getKeyByValue = function(object, value) {
	for( var prop in object) {
		if( object.hasOwnProperty(prop)) {
			if(object[prop] == value)
				return prop;
		}
	}
}

Tuttlebot.prototype.runKeywordFunction = function(keywordFunction, keyword, message, callback) {
	this[keywordFunction].Message(keyword, message, callback);
}

module.exports = Tuttlebot;
