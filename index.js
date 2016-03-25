
var Cheerio = require('cheerio');
var request = require('request');
var http = require('http');
var Wallpaper = require('wallpaper');
var fs = require('fs');

var search = "nature";
var resolution = "1920x1080";

var imgurl = "http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-";

function setWallpaper(resolution, search) {

	var url = "http://alpha.wallhaven.cc/search?q="+search+
		"&categories=100&purity=100&resolutions="+resolution+
		"&sorting=random&order=desc";

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

var args = process.argv.slice(2);

if(args.length !== 2)
{
	console.log("Incorrect Parameters! Defaulting to "+resolution+
	" and searching "+search+"\n\nUsage:\n\tnode index.js <resolution> <search-query>");
	console.log("\tnpm start <resolution> <search-query>");
	console.log("\nExample:");
	console.log("\tnode index.js 1920x1080 space\n");
}
else {
	resolution = args[0];
	search = args[1];
}

setWallpaper(resolution, search);
