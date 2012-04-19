/**
 * Module dependencies.
 */

var express = require('express')
  , assert = require('assert')
  , namespace = require('../');

module.exports = {
  'test app.namespace(str, fn)': function(){
    var app = express()
      , id;

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    assert.equal(app.namespace('/user', function(){}), app);

    app.namespace('/user', function(){
      app.all('/:id', function(req, res, next){
        id = req.params.id;
        next();
      });

      app.get('/:id', function(req, res){
        res.send('GET user ' + id);
      });
      
      app.del('/:id', function(req, res){
        res.send('DELETE user ' + id);
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
  
  'test app.namespace(str, fn) nesting': function(done){
    var pending = 6
      , calls = 0
      , app = express();
    
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
  
  'test fn.route': function(){
    var app = express();

    app.namespace('/user/:id', function(){
      app.get('/', function handler(req, res){
        assert.equal('/user/:id', handler.namespace);
        res.send(200);
      });
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'OK' });
  },
  'test app.namespace(str, middleware, fn)': function(done){
    var app = express(),
        calledA = 0,
        calledB = 0;
    
    function middlewareA(req,res,next){
      calledA++;
      next();
    }

    function middlewareB(req,res,next){
      calledB++;
      next();
    }

    app.namespace('/user/:id', middlewareA, function(){
      app.get('/', function(req,res){
        res.send('got Home');
      });

      app.get('/other', function(req,res){
        res.send('got Other');
      });

      app.namespace('/nest', middlewareB, function(req,res){
        app.get('/', function(req,res){
          res.send('got Nest');
        });
      });
    });

    var pending = 3;
    function finished() {
      --pending || function(){
        assert.equal(3, calledA);
        assert.equal(1, calledB);
        done();
      }();
    }

    assert.response(app,
      { url: '/user/12' },
      { body: 'got Home' }, 
      finished);
    assert.response(app,
      { url: '/user/12/other' },
      { body: 'got Other' },
      finished);
    assert.response(app,
      { url: '/user/12/nest' },
      { body: 'got Nest' },
      finished);
  }
};