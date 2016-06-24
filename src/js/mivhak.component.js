Mivhak.components = [];

Mivhak.component = function(name, options)
{
    Mivhak.components[name] = options;
};

/**
 * 
 * @param {type} name
 * @param {type} props
 */
Mivhak.render = function(name, props)
{
    var component = $.extend(true, {}, Mivhak.components[name]);
    var el = {};
    
    // Create the element from the template
    el.$el = $(component.template);
    
    // Create all methods
    $.each(component.methods, function(name, method){
        el[name] = function() {return method.apply(el,arguments);};
    });
    
    // Set properties
    $.each(component.props, function(name, prop){
        el[name] = (typeof props !== 'undefined' && props.hasOwnProperty(name) ? props[name] : prop);
    });
    
    // Bind events
    $.each(component.events, function(name, method){
        el.$el.on(name, function() {return method.apply(el,arguments);});
    });
    
    // Call the 'created' function if exists
    if(component.hasOwnProperty('created')) component.created.call(el);
    
    return el;
};