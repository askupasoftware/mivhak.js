$._components = [];

$.component = function( name, config ) {
   $._components[name] = config;
};

/**
 * 
 * @param {type} name
 * @param {type} props
 */
$.render = function(name, props)
{
    var component = $.extend(true, {}, $._components[name]),
        data      = {},
        $el       = $(component.template);
    
    // Create the element from the template
    data.$el = $el;
    
    // Create all methods
    $.each(component.methods, function(name, method){
        data[name] = function() {return method.apply(data,arguments);};
    });
    
    // Set properties
    $.each(component.props, function(name, prop){
        data[name] = (typeof props !== 'undefined' && props.hasOwnProperty(name) ? props[name] : prop);
    });
    
    // Bind events
    $.each(component.events, function(name, method){
        $el.on(name, function() {return method.apply(data,arguments);});
    });
    
    // Call the 'created' function if exists
    if(component.hasOwnProperty('created')) component.created.call(data);
    
    $el.data('component', data);
    
    return $el;
};