
var Cheerio = require('cheerio');
var request = require('request');
var http = require('http');
var Wallpaper = require('wallpaper');
var fs = require('fs');

var search = "nature";
var resolution = "1920x1080";

var url = "http://alpha.wallhaven.cc/search?q="+search+
	"&categories=100&purity=100&resolutions="+resolution+
	"&sorting=random&order=desc";

var imgurl = "http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-";

function doIt() {

	request(url, function(error, response, html) {
		if(!error && response.statusCode == 200) {
			var $ = Cheerio.load(html);
			var wallpaperIds = [];
			$('figure.thumb').each(function(figure){
				figure = $(this);
				wallpaperIds.push(figure.attr('data-wallpaper-id'));
			});

			var id = wallpaperIds[Math.floor(Math.random() * wallpaperIds.length)];

			var file = fs.createWriteStream("wallhaven-"+id+".jpg");
			var req = http.get(imgurl + id + ".jpg", function(res) {
					res.pipe(file);
					file.on('finish', function() {
			      file.close();
						Wallpaper.set("wallhaven-"+id+".jpg").then(function() {
							console.log("Wallpaper Set - ID: " + id);
							setTimeout(function() {
								fs.unlink("wallhaven-"+id+".jpg");
							}, 2000);
						});
			    });
			}).on('error', function(err) {
			    throw new Error(err);
			  });
		}
	});
}

doIt();
