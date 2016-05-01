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
			if (results === undefined || results.length === 0) {
				return callback(channel, "Couldnt' find imgurs for term: " + message.content.substring(imgurIndex + keyword.length).trim());
			}
			var image = results[Math.floor(Math.random() * results.length)];
			return callback(image.link);
		});
	}
}

module.exports = ImgurModule;
