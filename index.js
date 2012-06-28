
/**
 * Module dependencies.
 */

var express = require('express')
  , methods = require('methods').concat('del')
  , apps = express.application
    ? [express.application]
    : [express.HTTPServer.prototype, express.HTTPSServer.prototype];

/**
 * Namespace using the given `path`, providing a callback `fn()`,
 * which will be invoked immediately, resetting the namespace to the previous.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

var namespace = exports.namespace = function(){
  var args = Array.prototype.slice.call(arguments)
    , path = args.shift()
    , fn = args.pop()
    , self = this;

  if (args.length) self.all(path, args);
  if (args.length) self.all(path + '/*', args);
  (this._ns = this._ns || []).push(path);
  fn.call(this);
  this._ns.pop();
  return this;
};

apps.forEach(function(app){
  app.namespace = namespace;
});

/**
 * Proxy HTTP methods to provide namespacing support.
 */

methods.forEach(function(method){
  apps.forEach(function(app){
    var orig = app[method];
    app[method] = function(val){
      var len = arguments.length;
      if ('get' == method && 1 == len) return orig.call(this, val);

      var args = Array.prototype.slice.call(arguments)
        , path = args.shift()
        , self = this;

      this.namespace(path, function(){
        path = this._ns.join('/').replace(/\/\//g, '/').replace(/\/$/, '') || '/';
        args.forEach(function(fn){
          orig.call(self, path, fn);
        });
      });

      return this;
    };
  });
});