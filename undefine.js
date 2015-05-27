/*  undefine.js

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
*/
;!function( undefine_factory ) {
  'use strict';
  
  if ( ( typeof define == 'function' && define.amd ) || typeof exports != 'object' ) {
    // In the browser, w/ or w/out AMD loader
    undefine_factory( window );
  } else {
    // Node
    undefine_factory( module, require, exports );
  }
}
( function( module, require, exports ) {
  'use strict';
  
  var me      = 'undefine'
    , log     = get_logger()
    , modules = {}
  ;
  
  if ( exports ) {
    // Node
    log( 'loaded by node' );
    
    // Requires to first set node module and require, that of the module being defined, not this module object
    module.exports = set_module;
    
    return
  }
  
  // In browser, AMD or Globals
  // Module is set to the global window object
  var result = set_module( module );
  
  if ( has_define() ) {
    log( 'cooperating with AMD loader' );
    
    // AMD loader provides its own require function
  } else {
    log( 'standalone globally' );
    
    module.require = function( dependencies, factory ) {
      if ( ! factory ) {
        factory = dependencies;
        dependencies = null;
      }
      
      get_dependencies( require_global, dependencies, module, factory );
    };
  }
  
  return module[ me ] = result;
  
  function set_module( module, node_require, node_exports ) {
    
    return set_options;
    
    function set_options( options ) {
      options = options || {};
      
      return undefine;
      
      function undefine( name, dependencies, factory ) {
        // name and factory are required, only dependencies is an optional parameter w/ undefine()
        
        // name is required to allow bundling without code transforms.
        if ( ! factory ) {
          factory = dependencies;
          dependencies = null;
        }
        
        if ( has_define() ) {
          // AMD define
          log( 'AMD loading', name, options );
          
          var parameters = [ factory ];
          
          dependencies && parameters.unshift( dependencies );
          
          options.annonymous || parameters.unshift( options.amd_name || name );
          
          define.apply( module, parameters );
          
          /*
             If module is to be defined as a window global, require it immediately
             This guaranties that module is executed and allows to set window.
             https://github.com/umdjs/umd globals using a function wrapper does not work
             unless the module is later required, which is not guarantied if other modules
             assume global dependencies
          */
          options.global && require( [ name ], function( exports ) {
            set_private_module( name, exports, options );
          } );
        } if ( exports ) {
          // Node
          log( 'Node loading', name );
          
          call_factory( node_require, function( result ) {
            if ( result ) module.exports = result;
          } );
        } else {
          // Globals
          log( 'Global loading', name, options );
          
          call_factory( require_global, function( result ) {
            set_private_module( name, result, options );
          } );
        }
        
        function call_factory( require, then ) {
          if ( typeof factory != 'function' ) return factory;
          
          return get_dependencies( require, dependencies, module, factory, node_exports, then );
        } // call_factory()
      } // undefine()
    } // set_options()
  } // set_module()
  
  function get_logger() {
    if ( typeof console == 'object' && typeof console.log == 'function' ) {
      return console.log.bind( console, me + ':' );
    } else {
      return function() {};
    }
  } // get_logger()
  
  function has_define() {
    return typeof define == 'function' && !! define.amd;
  }
  
  function get_dependencies( require, dependencies, module, factory, node_exports, then ) {
    var specials_dependencies = {
      require: require,
      exports: node_exports || {},
      module : module
    };
    
    dependencies = ( dependencies || [ 'require', 'exports', 'module' ] ).map( _require );
    
    // ToDo: wait if not all dependencies are met
    
    var result = factory.apply( module, dependencies );
    
    then && then( result );
    
    function _require( dependency ) {
      return specials_dependencies[ dependency ] || require( dependency );
    } // _require()
  }
  
  function require_global( dependency ) {
    var name = dependency.split( '/' ).pop();
    
    log( 'require_global(), name:', name );
    
    // ToDo: call module factory function lazyly only upon first require, unless global
    var exports = modules[ name ] || window[ name ];
    
    if ( exports ) return exports;
    
    log( 'require_global(), module not yet available name:', name );
    
    // ToDo: wait until module is loaded
    
    return;
  } // require_global()
  
  function set_private_module( name, exports, options ) {
    log( 'set_private_module', name, exports, options );
    
    if ( modules[ name ] ) throw new Error( 'set_private_module(), allready loaded:', name );
    
    exports = exports || {};
    
    modules[ name ] = exports;
    
    if ( options.global ) {
      var previous = window[ name ];
      
      window[ name ] = exports;
      
      if ( options.no_conflict && ! exports.noConflict  ) {
        exports.noConflict = no_conflict;
      }
    }
    
    function no_conflict() {
      window[ name ] = previous;
      
      return exports;
    }
  } // set_private_module()
} ); // undefine.js
