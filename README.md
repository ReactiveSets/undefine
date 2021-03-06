# Undefine

**Universal Module Loader, for node.js, browser scripts, bundles, and AMD define loaders**

< 1 kB minified gzip, does not reinvent the wheel, if you need a dynamic AMD script loader pick one, **undefine** cooperates.

1. Start module with ```( this.undefine || require( 'undefine' )( module, require ) )()```
2. Define module using named AMD signature ```( 'fibonacci', [], function() {} )```
3. Require anywhere

[![NPM version](https://badge.fury.io/js/undefine.png)](http://badge.fury.io/js/undefine)

Stability: Stable, used by [toubkal](https://github.com/ReactiveSets/toubkal).

## Features

- Allows dual dependencies definitions for the browser and node
- Shortest module biolerplate
- Comprehensive, trully works in all situations, unlike UMD which is broken
- Smallest footprint
- Compatible with AMD module loaders such as require.js and curl-amd
- Does not require a build process

## Example

Fibonacci number calculator module

### Define [fibonacci.js](test/fibonacci.js)

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

#### In [node.js](test/for_node.js)

```javascript
  var fibonacci = require( 'fibonacci' );

  var n = 10;

  console.log( 'fibonacci( ' + n + ' ) =', fibonacci( n ) );
```

#### In the [browser](test/index.html)

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

#### With [require.js](test/require.html)

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

Also works with [curl-amd](test/curl.html).

## How does it work?

In first line of module:

```javascript
  ( this.undefine || require( 'undefine' )( module, require ) )()
```

1. **this.undefine** returns the function **window.undefine( options )** in the browser,
undefined in Node
2. In Node **require( 'undefine' )( module, require )** returns a function
**undefine( options )** bound to Node **module** and **require**
3. In both Node and the browser **undefine( options )** is evaluated and
returns a **define()** function with the same signature as
[AMD define](https://github.com/amdjs/amdjs-api/wiki/AMD)

The module definition is then equivalent to:

```javascript
  define( 'fibonacci', [], function() {
    // fibonacci implementation here
  } )
```

Module ids must be set to the filename without the js extension, allowing to require
modules loaded using script tags. To override global module names registered in the
**window** Object, use the **global** option described bellow.

### undefine( options )

The optional Object parameter **options** can have the following attributes which
all default to **false** and are browser-only options at this time:

- **global**: register into the global **window** Object e.g. **window[ 'fibonacci' ]**.
If **global** is a string, register into window using this string.
- **no_conflict**: if **global** is truly, add **no_conflict()** to module.

Additional options when used in conjunction with an AMD loader:
- **annonymous**: register annonymously.
- **amd_id**: register under this id instead of filename.

Example usage to declare the fibonacci module as **window.fib** with no_conflict():

```javascript
  ( this.undefine || require( 'undefine' )( module, require ) )
  ( { global: 'fib', no_conflict: true } )
  ( 'fibonacci', [], function() {
    // fibonacci implementation here
  } )
```
### Dependencies specification

As an extension to AMD dependencies specification, a dependency may be specified with
an Array of two strings where the first string is the exported name in the browser and
the second string is a Nodejs module name.

Example: the following **loggable** module has two dependencies, the first is
**./extend.js**, while the second is **uuid** which is available either in the window
global **uuid** or as Node.js module **node-uuid**:

```javascript
  ( this.undefine || require( 'undefine' )( module, require ) )()
  ( 'loggable', [ './extend', [ 'uuid', 'node-uuid' ] ], function( extend, uuid ) {
    // loggable implementation here
  } )
```

Also, if a module is not available on the browser or in node, one can specify a non-string
value, typically falsy, where the module is not available.

Example: Node module **css-select** emulates CSS3 querySelector() method. To use this module
one can apply the following definition for dependencies:

```javascript
  ( this.undefine || require( 'undefine' )( module, require ) )()
  ( 'query_selector', [ [ 0, 'css-select' ] ], function( css_select ) {
    var selector = '#comments';
    
    return css_select
      ? css_select.selectOne( selector, [] /* should be an htmlparse2 document or element */ )
      : document.querySelector( selector )
    ;
  } )
```

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
