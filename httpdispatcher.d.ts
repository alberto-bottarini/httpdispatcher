// Type definitions for httpdispatcher
// Project: https://github.com/alberto-bottarini/httpdispatcher
// Definitions by: Chris Barth <https://github.com/cjbarth>

import Http = require('http');

export = HttpDispatcher;

declare class HttpDispatcher {
	constructor();

	/**
	 * Generic function to set up request listener. Prefer onGet and onPost instead.
	 * @param method - The HTTP method to response to: "get" or "post"
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	on(method:string, url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.Callback):void;

	/**
	 * Generic function to set up request filters. Prefer beforeFilter and afterFilter instead.
	 * @param method - Should this filter be applied "before" or "after" the request is processed?
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	filter(method:string, url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.Callback):void;

	/**
	 * What to do when a GET reqeust matches _url_.
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	onGet(url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.Callback):void;

	/**
	 * What to do when a POST request matches _url_.
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	onPost(url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.Callback):void;

	/**
	 * What function should be called when there is an error.
	 * @param callback - The function that will be called on match.
	 */
	onError(callback:HttpDispatcher.Callback):void;

	/**
	 * Set the virtual folder for the static resources.
	 * @param folder - Relative path in URL to static resources.
	 */
	setStatic(folder:string):void;

	/**
	 * Set the physical/local folder for the static resources.
	 * @param dirname - Relative path in file system to static resources.
	 */
	setStaticDirname(dirname:string):void;

	/**
	 * Called before a route is handeled; can modify the request and response.
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	beforeFilter(url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.ChainCallback):void;

	/**
	 * Called after a route is handeled; can modify the request and response.
	 * @param url - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param callback - The function that will be called on match.
	 */
	afterFilter(url:string|RegExp|HttpDispatcher.UrlMatcher, callback:HttpDispatcher.ChainCallback):void;

	/**
	 * Main entry point for httpdispatcher. Http.CreateServer would call this.
	 * @param request - A ClientRequest object from NodeJS _Http_ module.
	 * @param response - A ClientResponse object from NodeJS _Http_ module.
	 */
	dispatch(request:Http.IncomingMessage, response:Http.ServerResponse):void;

	/**
	 * Listen to requests for static assests and serve them from the file system.
	 * @param request - A ClientRequest object from NodeJS _Http_ module.
	 * @param response - A ClientResponse object from NodeJS _Http_ module.
	 */
	staticListener(request:Http.IncomingMessage, response:Http.ServerResponse):void;

	/**
	 * Return the Callback that matches the URL and method requested.
	 * @param url - The URL requested.
	 * @param method - The method, "get" or "post", that the URL was requested with.
	 * @returns Callback
	 */
	getListener(url:string, method:string):HttpDispatcher.Callback;

	/**
	 * Return the Callback filter that matches the URL and method requested.
	 * @param url - The URL requested.
	 * @param type - The type of the filter, "before" or "after, for which the Callback should be returned.
	 * @returns Callback
	 */
	getFilters(url:string, type:string):HttpDispatcher.Callback;

	/**
	 * Will determine if there is a match for a _url_ given a _config_.
	 * @param config - String, RegExp, or Function that will match and/or return true with a provided URL string.
	 * @param url - The string that will be passed to config() or compared (==) with config or matched with config.test() to return a boolean.
	 */
	urlMatches(config:string|RegExp|HttpDispatcher.UrlMatcher, url:string):boolean;

}

declare namespace HttpDispatcher {

	export interface ClientRequest extends Http.IncomingMessage {
		params: object,
		/// available only on POST requests
		body?: string,
		/// available only on POST requests
		bodyBuffer?: Buffer,
	}

	export class HttpChain {
		constructor();
		add(callback: ChainCallback): void;
		addAll(callbacks: ChainCallback[]): void;
		next(req: ClientRequest, res: Http.ServerResponse): void;
	}

	export interface Callback {
		(request: ClientRequest, response: Http.ServerResponse): void;
	}

	export interface ChainCallback {
		(request: ClientRequest, response: Http.ServerResponse, chain: HttpChain): void;
	}

	export interface UrlMatcher {
		(url:string): boolean;
	}

}