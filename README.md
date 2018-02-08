httpdispatcher - basic dispatcher for node.js
=======

httpdispatcher is a simple class allows developer to have a clear dispatcher for dynamic pages and static resources.
Classes http.ServerRequest and http.ServerResponse earns new params property containing a map of received HTTP parameters.
Using httpdispatcher is pretty simple:

```js
    var HttpDispatcher = require('../httpdispatcher');
    var http           = require('http');
    var dispatcher     = new HttpDispatcher();

    dispatcher.setStatic('/resources');
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
    
    
    /*
    GET  /page1  => 'Page One'
    POST /page2  => 'Page Two'
    GET  /page3  => 404
    GET  /resources/images-that-exists.png => Image resource
    GET  /resources/images-that-does-not-exists.png => 404
    */
``` 

request and response
---------

Every listeners is called with two parameters `request` and `response`.

Request object is an instance of [`http.ClientRequest`](https://nodejs.org/api/http.html#http_class_http_clientrequest) with some custom properties:

- bodyBuffer : [`Buffer`](https://nodejs.org/api/buffer.html#buffer_class_buffer) (available only on POST request)
- body : String (available only on POST request)
- params : Object

Response object is an instance of [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).