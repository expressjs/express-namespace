
/**
 * Module dependencies.
 */

var express = require('express')
  , namespace = require('../');

module.exports = {
  'test app.namespace(str, fn)': function(assert){
    var app = express.createServer();

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    assert.equal(app.namespace('/user', function(){}), app);

    app.namespace('/user', function(){
      app.get('/:id', function(req, res){
        res.send('GET user ' + req.params.id);
      });
      
      app.del('/:id', function(req, res){
        res.send('DELETE user ' + req.params.id);
      });
    });
    
    app.get('/two', function(req, res){
      res.send('GET two');
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'GET user 12' });
  
    assert.response(app,
      { url: '/user/12', method: 'DELETE' },
      { body: 'DELETE user 12' });
    
    assert.response(app,
      { url: '/one' },
      { body: 'GET one' });
    
    assert.response(app,
      { url: '/two' },
      { body: 'GET two' });
  },
  
  'test app.namespace(str, fn) nesting': function(assert, done){
    var pending = 6
      , calls = 0
      , app = express.createServer();
    
    function finished() {
      --pending || function(){
        assert.equal(2, calls);
        done();
      }();
    }

    function middleware(req, res, next) {
      ++calls;
      next();
    }

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.namespace('/forum/:id', function(){
      app.get('/', function(req, res){
        res.send('GET forum ' + req.params.id);
      });
      
      app.get('/edit', function(req, res){
        res.send('GET forum ' + req.params.id + ' edit page');
      });

      app.namespace('/thread', function(){
        app.get('/:tid', middleware, middleware, function(req, res){
          res.send('GET forum ' + req.params.id + ' thread ' + req.params.tid);
        });
      });

      app.del('/', function(req, res){
        res.send('DELETE forum ' + req.params.id);
      });
    });
    
    app.get('/two', function(req, res){
      res.send('GET two');
    });

    assert.response(app,
      { url: '/forum/1' },
      { body: 'GET forum 1' }
      , finished);
    
    assert.response(app,
      { url: '/forum/1/edit' },
      { body: 'GET forum 1 edit page' }
      , finished);
    
    assert.response(app,
      { url: '/forum/1/thread/50' },
      { body: 'GET forum 1 thread 50' }
      , finished);
  
    assert.response(app,
      { url: '/forum/2', method: 'DELETE' },
      { body: 'DELETE forum 2' }
      , finished);
    
    assert.response(app,
      { url: '/one' },
      { body: 'GET one' }
      , finished);
    
    assert.response(app,
      { url: '/two' },
      { body: 'GET two' }
      , finished);
  },
  
  'test fn.route': function(assert){
    var app = express.createServer();

    app.namespace('/user/:id', function(){
      app.get('/', function handler(req, res){
        assert.equal('/user/:id', handler.namespace);
        res.send(200);
      });
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'OK' });
  }
};