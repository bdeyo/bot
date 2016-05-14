var env = require('../config.json')

var DamModule = function () {};

DamModule.prototype.Message = function(keyword, message, callback) {
	var rand = Math.floor((Math.random() * 2) + 1);
	var result;
	if (rand == 1)
		result = 'https://i.imgur.com/7lZwLKc.jpg';
	else
		result = 'https://i.imgur.com/VQLGJOL.gif';
	return callback(result);
}

module.exports = DamModule;
