$.fn.mivhak = function( methodOrOptions ) {
        
     
    
    return this.each(function(){
        // If this is an options object, set or update the options
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
            var args = [];
            Array.prototype.push.apply( args, arguments );
            args.shift(); // Remove the method's name from the args list
            Mivhak.methods[methodOrOptions].apply($(this).data('mivhak'), args);
        }
    });
};