!function(n){"use strict";function o(o,l,c){function d(d){function p(p,s,g){function y(n,e){return"function"!=typeof g?g:t(n,s,o,g,c,e)}if(g||(g=s,s=null),e()){a("AMD loading",p,d);var m=[g];s&&m.unshift(s.map(r)),d.annonymous||m.unshift(d.amd_id||p),define.apply(o,m),d.global&&(n.require||n.curl||f("AMD require() not found"))([p],function(n){u(p,n,d)})}else{if("object"==typeof exports)return a("Node loading",p),y(function(n){return l(r(n))},function(n){n&&(o.exports=n)});a("Standalone loading",p,d),y(i,function(n){u(p,n,d)})}}return d=d||{},p}return d}function e(){return"function"==typeof define&&define.amd}function t(n,o,e,t,r,i){function u(o){return f[o]||n(o)}var f={require:n,exports:r||{},module:e};o=(o||["require","exports","module"]).map(u);var l=t.apply(e,o);i&&i(l)}function r(n){return n.pop?n[d]:n}function i(o){var e="require_global()",t=r(o).split("/").pop();a(e,"name:",t);var i=c[t]||n[t];return i||f(e+" not found: "+t),i}function u(o,e,t){var r="register()",i=t.global;if(a(r,o,e,t),c[o]&&f(r+" allready loaded: "+o),c[o]=e||{},e&&i){if(o="string"==typeof i?i:o,t.no_conflict){var u=n[o];e.no_conflict=function(){return n[o]=u,e}}n[o]=e}}function f(n){throw new Error(l+", "+n)}var l="undefine",a="object"==typeof console&&console.log&&console.log.bind(console,l+":")||function(){},c={},d=0;if(e())a("Cooperating with AMD loader, define.amd:",e());else{if("object"==typeof exports)return a("Loaded by node"),d=1,module.exports=o;a("Standalone globally"),n.require=function(o,e){e||(e=o,o=null),t(i,o,n,e)}}n[l]=o(n)}(this);
//# sourceMappingURL=undefine-min.map