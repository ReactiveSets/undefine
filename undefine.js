/*  undefine.js

    The MIT License (MIT)

    Copyright (c) 2015-2020, Reactive Sets

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
!function undefine_factory( global ) {
  'use strict';
  
  var me      = 'undefine'
    , c       = typeof console == 'object' && console
    , clog    = c && c.log
    , log     = clog && clog.bind( c, me + ':' ) || function() {} 
    , de      = 0
    , ug      = log
    , modules = {}
    , node    = 0;
  ;
  
  if ( has_define() ) {
    de&&ug( 'Cooperating with AMD loader, define.amd:', has_define() );
    
    // AMD loader provides its own require function
  } else {
  
    // @Node.js_code
    if ( typeof exports == 'object' ) {
      de&&ug( 'Loaded by node' );
      
      node = 1;
      
      // Requires to first set node module and require, that of the module being defined, not this global object
      return module.exports = set_module;
    }

    de&&ug( 'Standalone globally' );
    
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
          de&&ug( 'AMD loading', name, options );
          
          var parameters = [ factory ];
          
          dependencies && parameters.unshift( dependencies.map( disambiguate ) );
          
          options.annonymous || parameters.unshift( options.amd_id || name );
          
          define.apply( module, parameters );
          
          /*
             If module is to be defined as a window global, require it immediately
             This guaranties that factory is executed and allows to set window.
             https://github.com/umdjs/umd/blob/master/amdWebGlobal.js does not work
             unless the module is later required, which is not guarantied if other modules
             assume global dependencies.
          */
          options.global && ( global.require || global.curl || fatal( 'AMD require() not found' ) )( [ name ], function( exports ) {
            register( name, exports, options );
          } );
        } else {
        
          // @Node.js_code
          if ( typeof exports == 'object' ) {
            de&&ug( 'Node loading', name );
            
            return call_factory(
              function( dependency ) {
                return node_require( disambiguate( dependency ) )
              },
              
              function( result ) {
                if ( result ) module.exports = result;
              }
            );
          }
          
          // Standalone
          de&&ug( 'Standalone loading', name, options );
          
          call_factory( require_global, function( result ) {
            register( name, result, options );
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
    
    // Wish: wait if not all dependencies are met
    // This would be backward compatible since today most programs would fail if a dependency
    // is not met.
    
    var result = factory.apply( module, dependencies );
    
    then && then( result );
    
    function _require( dependency ) {
      return specials_dependencies[ dependency ] || require( dependency );
    } // _require()
  } // get_dependencies()
  
  function disambiguate( dependency ) {
    return dependency.pop ? dependency[ node ] : dependency
  } // disambiguate()
  
  function require_global( dependency ) {
    var f = 'require_global()'
      , name = disambiguate( dependency )
    ;
    
    if ( typeof name != 'string' ) return name; // dependency name is the exported value
    
    name = name.split( '/' ).pop();
    
    de&&ug( f, 'name:', name );
    
    // Wish: a 'lazy' option to call factory function only upon first require, unless global
    // This option would be backward compatible because it would be an option
    var exports = modules[ name ] || global[ name ];
    
    exports || fatal( f + ' not found: ' + name );
    
    return exports;
  } // require_global()
  
  function register( name, exports, options ) {
    var f       = 'register()'
      , _global = options.global
    ;
    
    de&&ug( f, name, exports, options );
    
    modules[ name ] && fatal( f + ' allready loaded: ' + name );
    
    modules[ name ] = exports || {};
    
    if ( exports && _global ) {
      name = typeof _global == 'string' ? _global : name;
      
      if ( options.no_conflict ) {
        var previous = global[ name ];
        
        exports.no_conflict = function() {
          global[ name ] = previous;
          
          return exports;
        };
      }
      
      global[ name ] = exports;
    }
  } // register()
  
  function fatal( message ) {
    throw new Error( me + ', ' + message );
  } // fatal()
}( this ); // undefine.js
