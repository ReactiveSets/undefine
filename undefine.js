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
;!function undefine_factory( global ) {
  'use strict';
  
  var me      = 'undefine'
    , log     = typeof console == 'object' && console.log && console.log.bind( console, me + ':' ) || function() {} 
    , modules = {}
  ;
  
  if ( has_define() ) {
    log( 'Cooperating with AMD loader, define.amd:', has_define() );
    
    // AMD loader provides its own require function
  } else {
  
    // @Node.js_code
    if ( typeof exports == 'object' ) {
      log( 'Loaded by node' );
      
      // Requires to first set node module and require, that of the module being defined, not this global object
      return module.exports = set_module;
    }

    log( 'Standalone globally' );
    
    global.require = function _require( dependencies, factory ) {
      if ( ! factory ) {
        factory = dependencies;
        dependencies = null;
      }
      
      get_dependencies( require_global, dependencies, global, factory );
    }; // _require()
  }
  
  // In browser, AMD or Globals
  // global is set to the global window object
  global[ me ] = set_module( global );
  
  function set_module( module, node_require, node_exports ) {
    
    return _undefine;
    
    function _undefine( options ) {
      options = options || {};
      
      return _define;
      
      function _define( name, dependencies, factory ) {
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
             This guaranties that factory is executed and allows to set window.
             https://github.com/umdjs/umd/blob/master/amdWebGlobal.js does not work
             unless the module is later required, which is not guarantied if other modules
             assume global dependencies.
          */
          options.global && ( global.require || global.curl || fatal( 'AMD require() not found' ) )( [ name ], function( exports ) {
            set_private_module( name, exports, options );
          } );
        } else {
        
          // @Node.js_code
          if ( typeof exports == 'object' ) {
            log( 'Node loading', name );
            
            return call_factory( node_require, function( result ) {
              if ( result ) module.exports = result;
            } );
          }
          
          // Standalone
          log( 'Standalone loading', name, options );
          
          call_factory( require_global, function( result ) {
            set_private_module( name, result, options );
          } );
        }
        
        function call_factory( require, then ) {
          if ( typeof factory != 'function' ) return factory;
          
          return get_dependencies( require, dependencies, module, factory, node_exports, then );
        } // call_factory()
      } // _define()
    } // _undefine()
  } // set_module()
  
  function has_define() {
    return typeof define == 'function' && define.amd;
  } // has_define()
  
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
  } // get_dependencies()
  
  function require_global( dependency ) {
    var name = dependency.split( '/' ).pop();
    
    log( 'require_global(), name:', name );
    
    // ToDo: call module factory function lazyly only upon first require, unless global
    var exports = modules[ name ] || global[ name ];
    
    exports || log( 'require_global(), module not yet available name:', name );
    
    return exports;
  } // require_global()
  
  function set_private_module( name, exports, options ) {
    log( 'set_private_module', name, exports, options );
    
    modules[ name ] && fatal( 'set_private_module(), allready loaded: ' + name );
    
    modules[ name ] = exports || {};
    
    if ( exports && options.global ) {
      var no_conflict = options.no_conflict;
      
      if ( no_conflict ) {
        var previous = global[ name ];
        
        exports.no_conflict = function() {
          global[ name ] = previous;
          
          return exports;
        };
      }
      
      global[ name ] = exports;
    }
  } // set_private_module()
  
  function fatal( message ) {
    throw new Error( me + ', ' + message );
  } // fatal()
}( this ); // undefine.js
