( this.undefine || require( 'undefine' )( module, require ) )( { global: false } )
( 'fibonacci', [], function() {
  return fibonacci;
  
  // Naive recursive implementation of a Fibonacci number calculator
  function fibonacci( n ) {
    if ( n < 0 ) return undefined;
    
    if ( n < 2 ) return n;
    
    return fibonacci( n - 2 ) + fibonacci( n - 1 );
  }
} );
