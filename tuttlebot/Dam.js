var env = require('../config.json')

var DamModule = function () {};

DamModule.prototype.Message = function(keyword, message, callback) {
	var pic = 'https://i.imgur.com/7lZwLKc.jpg';
	return callback(pic);
}

module.exports = DamModule;
