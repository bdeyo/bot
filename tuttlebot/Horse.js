var env = require('../config.json')

var HorseModule = function () {};

HorseModule.prototype.Message = function(keyword, message, callback) {
	var gif = 'http://i.giphy.com/S4mOmgmpBQAXm.gif';
	return callback(gif);
}

module.exports = HorseModule;
