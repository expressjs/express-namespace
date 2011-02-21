
# Express Contrib
      
The _express-namespace_ module provides namespace capabilities to express.

## Installation

npm:

    $ npm install express-namespace

## Usage

 The example below may respond to any of the following requests:

    GET /forum/12
    GET /forum/12/view
    GET /forum/12/edit
    GET /forum/12/thread/5
    DELETE /forum/12

To utilize this module simply `require('express-namespace')` and `app.namespace()` will automatically be available to you.

Usage is as follows, simply pass a callback function and route to the method, after each callback invocation is complete, the namespace is restored to it's previous state.

    app.namespace('/forum/:id', function(){
      app.get('/(view)?', function(req, res){
        res.send('GET forum ' + req.params.id);
      });
      
      app.get('/edit', function(req, res){
        res.send('GET forum ' + req.params.id + ' edit page');
      });

      app.namespace('/thread', function(){
        app.get('/:tid', function(req, res){
          res.send('GET forum ' + req.params.id + ' thread ' + req.params.tid);
        });
      });

      app.del('/', function(req, res){
        res.send('DELETE forum ' + req.params.id);
      });
    });

You can also access the current namespace via `app.currentNamespace`;

## Running Tests

First make sure you have the submodules:

    $ git submodule update --init

Then run the tests:

    $ make test

## License 

(The MIT License)

Copyright (c) 2010 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
