var HttpDispatcher = function() {
	this.listener = { get: { }, post: { } };
	this.errorListener = function() { }
	this.staticFolderPrefix = '/static';
}
HttpDispatcher.prototype.onGet = function(url, cb) {
	this.listener.get[url] = cb;
}	
HttpDispatcher.prototype.onPost = function(url, cb) {
	this.listener.post[url] = cb;
}
HttpDispatcher.prototype.onError = function(cb) {
	this.errorListener = cb;
}
HttpDispatcher.prototype.setStaticFolderPrefix = function(folder) {
	this.staticFolderPrefix = folder;
}
HttpDispatcher.prototype.dispatch = function(req, res) {
	var parsedUrl = require('url').parse(req.url, true);
	if(parsedUrl.pathname.startsWith(this.staticFolderPrefix)) this.staticListener(parsedUrl, req, res);
	else {
		var method = req.method.toLowerCase();
		if(this.listener[method][parsedUrl.pathname]) this.listener[method][parsedUrl.pathname](req, res)
		else this.errorListener(req, res);
	}
}
HttpDispatcher.prototype.staticListener =  function(parsedUrl, req, res) {
	var filename = require('path').join(".", parsedUrl.pathname);
	require('fs').readFile(filename, function(err, file) {
		if(err) {
			res.writeHeader(404, {
				"Content-Type": "text/plain"
			});
			res.end();
			return;
		}
		res.writeHeader(200, {
			"Content-Type": require('mime').lookup(filename)
		});
		res.write(file, 'binary');
		res.end();
	});
}

module.exports = new HttpDispatcher();
