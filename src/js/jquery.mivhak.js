/**
 * Extends the functionality of jQuery to include Mivhak
 * 
 * @param {Function|Object} methodOrOptions
 * @returns {jQuery} 
 */
$.fn.mivhak = function( methodOrOptions ) {

    // Store arguments for use with methods
    var args = arguments.length > 1 ? Array.apply(null, arguments).slice(1) : null;

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
                $(this).data('mivhak').setOptions( methodOrOptions );
                $(this).data('mivhak').applyOptions();
            }
        }
        
        // If this is a method call, run the method (if it exists)
        else if( Mivhak.methodExists( methodOrOptions )  )
        {
            Mivhak.methods[methodOrOptions].apply($(this).data('mivhak'), args);
        }
    });
};