// # https://github.com/techpines/express.io/tree/master/examples#realtime-canvas
require('./lib/polyfill');
var app = app = require('express.io')();
//var fs = require('fs');

app.http().io();

app.io.configure(function() {
    app.io.enable('browser client minification');  // send minified client
    app.io.enable('browser client gzip');          // gzip the file
    app.io.set('log level', 1);                    // reduce logging
});

/* HTTP HANDLERS */

// Send the script files
app.get('/js/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path.replace('/js/', '/client/scripts/'))
});

// Send the style sheet files
app.get('/css/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path.replace('/css/', '/client/stylesheets/'))
});

// Send the images
app.get('/img/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path.replace('/img/', '/client/images/'))
});

// Send the images
app.get('/sprites/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path.replace('/sprites/', '/client/sprites/'))
});

// Send the partials html.
app.get('/partials/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path.replace('/partials/', '/client/views/') + '.html')
});

// Send the template html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/client/views/template.html')
});


/* SOCKET HANDLERS */

app.io.route('Client:addPlayer', function(req) {
    req.io.broadcast('Server:addPlayer', req.data)
});

app.io.route('Client:refreshPlayer', function(req) {
    req.io.broadcast('Server:refreshPlayer', req.data)
});

app.listen(7076);

/*function handler(req, res) {
	if (req.url.indexOf('.js') > -1 || req.url.indexOf('/img/') > -1) {
		fs.readFile(__dirname + req.url,
	  	function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}
	    	res.writeHead(200);
	    	res.end(data);
		});
	} else {
		fs.readFile(__dirname + '/page/index.html',
	  	function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}
	    	res.writeHead(200);
	    	res.end(data);
		});
	}
}*/