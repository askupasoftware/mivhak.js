$.fn.mivhak = function( methodOrOptions ) {
        
    var args = arguments.length > 1 ? Array.apply(null, arguments).slice(1) : null;
    
    return this.each(function(){
        if( typeof methodOrOptions === 'object' || !methodOrOptions )
        {
            if( typeof $(this).data( 'mivhak' ) === 'undefined' ) {
                var plugin = new Mivhak( this, methodOrOptions );
                $(this).data( 'mivhak', plugin );
            }
            else
            {
                // Update settings if this is not the initial call
                Mivhak.methods.update.call($(this).data('mivhak'), [methodOrOptions]);
            }
        }
        // If this is a method call, run the method if it exists
        else if( Mivhak.methodExists( methodOrOptions )  )
        {
            Mivhak.methods[methodOrOptions].call($(this).data('mivhak'), args);
        }
    });
};