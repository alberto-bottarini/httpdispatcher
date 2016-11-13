var HttpDispatcher = require('../httpdispatcher');
var http           = require('http');
var dispatcher     = new HttpDispatcher();

dispatcher.setStatic('/resources/static');
dispatcher.setStaticDirname('static');

dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
}); 

dispatcher.onPost("/page2", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page Two');
});

dispatcher.beforeFilter(/\//, function(req, res, chain) { //any url
    console.log("Before filter");
    chain.next(req, res, chain);
});

dispatcher.afterFilter(/\//, function(req, res, chain) { //any url
    console.log("After filter");
    chain.next(req, res, chain);
});

dispatcher.onError(function(req, res) {
    res.writeHead(404);
    res.end();
});

http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
}).listen(1337, '127.0.0.1');
