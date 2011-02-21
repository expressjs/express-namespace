
/*!
 * Express - Contrib - namespace
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , Server = express.Server
  , join = require('path').join;

/**
 * Namespace using the given `path`, providing a callback `fn()`,
 * which will be invoked immediately, resetting the namespace to the previous.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.namespace = function(path, fn){
  (this._ns = this._ns || []).push(path);
  fn.call(this);
  this._ns.pop();
  return this;
};

/**
 * Return the current namespace.
 *
 * @return {String}
 * @api public
 */

Server.prototype.__defineGetter__('currentNamespace', function(){
  return join.apply(this, this._ns).replace(/\/$/, '') || '/';
});

/**
 * Proxy HTTP methods to provide namespacing support.
 */

express.router.methods.concat(['del', 'all']).forEach(function(method){
  var orig = Server.prototype[method];
  Server.prototype[method] = function(){
    var args = Array.prototype.slice.call(arguments)
      , path = args.shift()
      , fn = args.pop()
      , self = this;

    this.namespace(path, function(){
      var curr = this.currentNamespace;
      args.forEach(function(fn){
        fn.namespace = curr;
        orig.call(self, curr, fn);
      });

      fn.namespace = curr;
      orig.call(self, curr, fn);
    });

    return this;
  };
});
