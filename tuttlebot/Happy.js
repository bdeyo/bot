var env = require('../config.json')

var HappyModule = function () {};

HappyModule.prototype.Message = function(keyword, message, callback) {
  var gif;
  var rand = Math.floor((Math.random() * 2) + 1);
	if (rand == 1)
	  gif = 'https://i.imgur.com/gbXzYXp.gif';
	else
	  gif = 'https://i.imgur.com/OxwIC0O.gif';
	return callback(gif);
}

module.exports = HappyModule;
