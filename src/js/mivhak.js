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
    activeTab:  null // Updated by tabs.showTab
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
Mivhak.prototype.callMethod = function( methodName )
{
    if(Mivhak.methodExists(methodName))
    {
        // Call the method with the original arguments, removing the method's name from the list
        var args = [];
        Array.prototype.push.apply( args, arguments );
        args.shift();
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
    this.createUI();
    this.callMethod('setHeight', this.calculateHeight());
    this.callMethod('showTab',0); // Show first tab initially
};

/**
 * 
 */
Mivhak.prototype.createUI = function() 
{
    this.tabs = Mivhak.render('tabs',{mivhakInstance: this});
    this.topbar = Mivhak.render('top-bar',{mivhakInstance: this});
    this.notifier = Mivhak.render('notifier');
    
    this.$selection.prepend(this.tabs.$el);
    this.$selection.prepend(this.topbar.$el);
    this.tabs.$el.prepend(this.notifier.$el);
};

Mivhak.prototype.calculateHeight = function()
{
    var h = this.options.height,
        heights = [],
        padding = this.tabs.$el.css('padding-top') + this.tabs.$el.css('padding-bottom'),
        i = this.tabs.tabs.length;
console.log(padding);
    while(i--)
        heights.push(this.tabs.tabs[i].vscroll.getEditorHeight());

    if('average' === h) return average(heights);
    if('smallest' === h) return min(heights);
    if('largest' === h) return max(heights);
    if(!isNaN(h)) return parseInt(h);
    
};

/* test-code */
testapi.mivhak = Mivhak;
/* end-test-code */