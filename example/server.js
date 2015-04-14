// HTTP module
var http = require('http'),
    request = require("request"),
    path = require("path"),
    url = require("url"),
    fs = require('fs');

var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript",
    '.json': "application/json",
    '.png':  "image/png",
    '.jpg':  "image/jpeg",
    '.gif':  "image/gif"
};

var argvConf = {
    '--no-api': false,
    '--no-proxy': false
};

for(var i=2; i<process.argv.length; i++) {
    if(typeof argvConf[process.argv[i]] != 'undefined') {
        argvConf[process.argv[i]] = true;
    }
}

// Creating new HTTP server.
http.createServer(function(req, res) {

    var uri = url.parse(req.url).pathname,
        api = req.url.match(/^\/api\/(.*)/),
	    filename = path.join(process.cwd() + '/pub', (uri == '/' ? uri + 'index.html' : uri));

    if(api && !argvConf['--no-api']) {
        var proxyRequest = request({
            proxy: argvConf['--no-proxy'] ? undefined : 'http://proxy.teligent.ru:1111',
            url: 'http://10.77.64.108/freephone/rest/api/' + api[1],
            method: req.method,
            headers: req.headers
        });

        // открываем исходящий pipe, только если есть тело, иначе есть грлюки, такое решение работает
        if(req.headers['content-length'] && req.headers['content-length']>0) {
            req.pipe(proxyRequest);
        }

        proxyRequest.pipe(res);
    }
    else {
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.write("404 Not found");
            }
            else {
                res.writeHead(200, {"Content-Type": contentTypesByExtension[path.extname(filename)] || 'text/plain'});
                res.write(file, "binary");
            }
            res.end();
        });
    }
}).listen(1300);
			    
// Log URL.
console.log("Server running at http://*:1300/");
