/**
 * The constructor
 * 
 * @param {DOMElement} selection
 * @param {object} options
 */
function Mivhak( selection, options )
{
    this.$selection = $( selection );
    this.setOptions( options );
    this.init();
}

/**
 * Plugin's methods. 
 * In all methods, the 'this' keyword is pointing to the calling instance of Mivhak.
 */
Mivhak.methods = {
    
};

/**
 * Check if a given string represents a supported method
 * @param {string} method
 */
Mivhak.methodExists = function( method )
{
    return typeof method === 'string' && Mivhak.methods[method];
};

/**
 * Reads the element's 'miv-' attributes and returns their values as an object
 */
Mivhak.readAttributes = function(el) 
{
    var options = {};
    $.each(el.attributes, function(i, attr){
        if(/^miv-/.test(attr.name))
        {
            options[toCamelCase(attr.name.substr(4))] = strToValue(attr.value);
        }
    });
    return options;
};

/**
 * Set or update this instance's options.
 * @param {object} options
 */
Mivhak.prototype.setOptions = function( options ) 
{
    // If options were already set, update them
    if( typeof this.options !== 'undefined' )
    {
        this.options = $.extend(true, {}, this.options, options, Mivhak.readAttributes(this.$selection[0]));
    }
    // Otherwise, merge them with the defaults
    else
    {
        this.options = $.extend(true, {}, Mivhak.defaults, options, Mivhak.readAttributes(this.$selection[0]));
    }
};

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

/**
 * 
 */
Mivhak.prototype.init = function() 
{
    this.createTabs();
    this.createTopBar();
};

Mivhak.prototype.createTabs = function() 
{
    this.tabs = Mivhak.render('tabs',{mivhakInstance: this});
    this.$selection.prepend(this.tabs.$el);
};

Mivhak.prototype.createTopBar = function() 
{
    this.topbar = Mivhak.render('top-bar',{mivhakInstance: this});
    this.$selection.prepend(this.topbar.$el);
};

/* test-code */
testapi.mivhak = Mivhak;
/* end-test-code */