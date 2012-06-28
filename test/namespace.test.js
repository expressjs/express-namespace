
/**
 * Module dependencies.
 */

var express = require('express')
  , assert = require('assert')
  , request = require('supertest')
  , namespace = require('..')
  , pending = require('./support/pending');

describe('app.namespace(path, fn)', function(){
  it('should not prefix root-level paths', function(done){
    var app = express();
    done = pending(2, done);

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.get('/some/two', function(req, res){
      res.send('GET two');
    });

    request(app)
    .get('/one')
    .expect('GET one', done);

    request(app)
    .get('/some/two')
    .expect('GET two', done);
  })

  it('should prefix within .namespace()', function(done){
    var app = express();
    done = pending(4, done);

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.namespace('/foo', function(){
      app.get('/', function(req, res){
        res.send('foo');
      });

      app.namespace('/baz', function(){
        app.get('/', function(req, res){
          res.send('GET baz');
        });

        app.del('/all', function(req, res){
          res.send('DELETE all baz');
        });
      })

      app.get('/bar', function(req, res){
        res.send('bar');
      });
    })

    app.get('/some/two', function(req, res){
      res.send('GET two');
    });

    request(app)
    .get('/foo/baz')
    .expect('GET baz', done);

    request(app)
    .del('/foo/baz/all')
    .expect('DELETE all baz', done);

    request(app)
    .get('/one')
    .expect('GET one', done);

    request(app)
    .get('/some/two')
    .expect('GET two', done);

    request(app)
    .get('/foo')
    .expect('foo', done);

    request(app)
    .get('/foo/bar')
    .expect('bar', done);
  })

  it('should support middleware', function(done){
    var app = express();

    function load(req, res, next) {
      req.forum = { id: req.params.id };
      next();
    }

    app.namespace('/forum/:id', load, function(){
      app.get('/', function(req, res){
        res.send('' + req.forum.id);
      });
    });

    request(app)
    .get('/forum/23')
    .expect('23', done);
  })
})