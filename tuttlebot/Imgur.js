var env = require('../config.json'),
	key = require('../auth.json'),
	Imgur = require("imgur-search");

var ImgurModule = function() {
	this.imgSearch = new Imgur(key.imgur_key);
};

ImgurModule.prototype.Message = function(keyword, message, callback) {
	var imgurIndex = message.content.indexOf(keyword);
	var term = message.content.substring(imgurIndex + keyword.length).trim().replace(/\s/g, "+");

	if (imgurIndex > -1) {
		this.imgSearch.search(term).then(function(results) {
			if (results.length == 0 || results == undefined) {
				return callback("You suck at searching, try again.");
			} else {
				var image = results[Math.floor(Math.random() * results.length)];
				return callback(image.link);
			}
		});
	}
}

module.exports = ImgurModule;
