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
 * jQuery plugin's methods. 
 * In all methods, the 'this' keyword is pointing to the calling instance of Mivhak.
 * These functions serve as the plugin's public API.
 */
Mivhak.methods = {
    toggleLineWrap: function() {
        var $this = this;
        this.state.lineWrap = !this.state.lineWrap;
        $.each(this.tabs.tabs, function(i,tab) {
            tab.editor.getSession().setUseWrapMode($this.state.lineWrap);
            tab.editor.resize();
        });
    },
    update: function(options) {
        // Update options here
    }
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
 * 
 */
Mivhak.prototype.state = {
    lineWrap:   true,
    collapsed:  false,
    activeTab:  0
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
        this.options = $.extend(true, {}, this.options, options, readAttributes(this.$selection[0]));
    }
    // Otherwise, merge them with the defaults
    else
    {
        this.options = $.extend(true, {}, Mivhak.defaults, options, readAttributes(this.$selection[0]));
    }
};

/**
 * 
 * @param {type} methodName
 */
Mivhak.prototype.callMethod = function( methodName, args )
{
    if(Mivhak.methodExists(methodName))
    {
        Mivhak.methods[methodName].apply(this, args);
    }
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

/**
 * 
 */
Mivhak.prototype.init = function() 
{
    this.createTabs();
    this.createTopBar();
};

/**
 * 
 */
Mivhak.prototype.createTabs = function() 
{
    this.tabs = Mivhak.render('tabs',{mivhakInstance: this});
    this.$selection.prepend(this.tabs.$el);
};

/**
 * 
 */
Mivhak.prototype.createTopBar = function() 
{
    this.topbar = Mivhak.render('top-bar',{mivhakInstance: this});
    this.$selection.prepend(this.topbar.$el);
};

/* test-code */
testapi.mivhak = Mivhak;
/* end-test-code */