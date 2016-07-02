/**
 * Extends the functionality of jQuery to include Mivhak
 * 
 * @param {Function|Object} methodOrOptions
 * @returns {jQuery} 
 */
$.fn.mivhak = function( methodOrOptions ) {

    return this.each(function(){
        
        // If this is an options object, set or update the options
        if( typeof methodOrOptions === 'object' || !methodOrOptions )
        {
            // If this is the initial call for this element, instantiate a new Mivhak object
            if( typeof $(this).data( 'mivhak' ) === 'undefined' ) {
                var plugin = new Mivhak( this, methodOrOptions );
                $(this).data( 'mivhak', plugin );
            }
            // Otherwise update existing settings (consequent calls will update, rather than recreate Mivhak)
            else
            {
                Mivhak.methods.update.call($(this).data('mivhak'), methodOrOptions);
            }
        }
        
        // If this is a method call, run the method (if it exists)
        else if( Mivhak.methodExists( methodOrOptions )  )
        {
            var args = [];
            Array.prototype.push.apply( args, arguments );
            args.shift(); // Remove the method's name from the args list
            Mivhak.methods[methodOrOptions].apply($(this).data('mivhak'), args);
        }
    });
};