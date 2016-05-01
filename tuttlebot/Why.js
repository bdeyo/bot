var env = require('../config.json')

var WhyModule = function () {};

WhyModule.prototype.Message = function(keyword, message, callback) {
	var gif = 'https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif';
	return callback(gif);
}

module.exports = WhyModule;
