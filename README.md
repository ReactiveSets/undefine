# Undefine

**Universal Module Loader, for node.js, browser scripts, bundles, and AMD define loaders**

< 1 kB minified gzip, does not reinvent the wheel, if you need a dynamic loader pick one, **undefine** cooperates.

1. Start module with ```( this.undefine || require( 'undefine' )( module, require ) )()```
2. Define module using named AMD signature ```( 'fibonacci', [], function() {} )```
3. Require anywhere

[![NPM version](https://badge.fury.io/js/undefine.png)](http://badge.fury.io/js/undefine)

Stability: Beta, used by [toubkal](https://github.com/ReactiveSets/toubkal), needs CI testing.

## Example

Fibonacci number calculator module

### Define [fibonacci.js](tree/master/test/fibonacci.js)

```javascript
  ( this.undefine || require( 'undefine' )( module, require ) )()
  ( 'fibonacci', [], function() {
    return fibonacci;
    
    // Naive recursive implementation of a Fibonacci number calculator
    function fibonacci( n ) {
      if ( n < 0 ) return;
      
      if ( n < 2 ) return n;
      
      return fibonacci( n - 2 ) + fibonacci( n - 1 );
    }
  } )
```

### Require fibonacci.js

#### In [node.js](tree/master/test/for_node.js)

```javascript
  var fibonacci = require( 'fibonacci' );

  var n = 10;

  console.log( 'fibonacci( ' + n + ' ) =', fibonacci( n ) );
```

#### In the [browser](tree/master/test/index.html)

```html
  <script src="undefine.js"></script>
  <script src="fibonacci.js"></script>
  <script>
    require( [ 'fibonacci' ], function( fibonacci ) {
      var n = 10;
      
      console.log( 'fibonacci( ' + n + ' ) =', fibonacci( n ) );
    }
  </script>
```

#### With [require.js](tree/master/require.html)

fibonacci.js loaded dynamically:

```html
  <script src="require.js"></script>
  <script src="undefine.js"></script>
  <script>
    require( [ './fibonacci' ], function( fibonacci ) {
      var n = 10;
      
      console.log( 'fibonacci( ' + n + ' ) =', fibonacci( n ) );
    } )
  </script>
```

Also works with [curl-amd](tree/master/test/curl.html).

## Licence

  The MIT License (MIT)

  Copyright (c) 2015, Reactive Sets

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
