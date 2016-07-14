/**
 * Package:      mivhak-js
 * URL:          http://products.askupasoftware.com/mivhak-js
 * Version:      1.0.0
 * Date:         2016-07-13
 * Dependencies: jQuery Mousewheel, Ace Editor
 * License:      GNU GENERAL PUBLIC LICENSE
 *
 * Developed by Askupa Software http://www.askupasoftware.com
 */

(function ( $ ) {// Ace global config
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/');/**
 * Converts a string to it's actual value, if applicable
 * 
 * @param {String} str
 */
function strToValue( str )
{
    if('true' === str.toLowerCase()) return true;
    if('false' === str.toLowerCase()) return false;
    if(!isNaN(str)) return parseFloat(str);
    return str;
}

/**
 * Convert hyphened text to camelCase.
 * 
 * @param {string} str
 * @returns {string}
 */
function toCamelCase( str )
{
    return str.replace(/-(.)/g,function(match){
        return match[1].toUpperCase();
    });
}

/**
 * Reads the element's 'miv-' attributes and returns their values as an object
 * 
 * @param {DOMElement} el
 * @returns {Object}
 */
function readAttributes( el ) 
{
    var options = {};
    $.each(el.attributes, function(i, attr){
        if(/^miv-/.test(attr.name))
        {
            options[toCamelCase(attr.name.substr(4))] = strToValue(attr.value);
        }
    });
    return options;
}

/**
 * Get the average value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function average( arr )
{
    var i = arr.length, sum = 0;
    while(i--) sum += parseFloat(arr[i]);
    return sum/arr.length;
}

/**
 * Get the maximum value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function max( arr )
{
    var i = arr.length, maxval = arr[--i];
    while(i--) if(arr[i] > maxval) maxval = arr[i];
    return maxval;
}

/**
 * Get the minimum value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function min( arr )
{
    var i = arr.length, minval = arr[--i];
    while(i--) if(arr[i] < minval) minval = arr[i];
    return minval;
}

/**
 * Calculate the editor's height based on the number of lines & line height.
 * 
 * @param {jQuery} $editor Ther editor wrapper element (PRE)
 * @returns {Number}
 */
function getEditorHeight( $editor )
{
    var height = 0;
    $editor.find('.ace_text-layer').children().each(function(){
        height += $(this).height();
    });
    return height;
}

/**
 * Convert a string like "3, 5-7" into an array of ranges in to form of
 * [
 *   {start:2, end:2},
 *   {start:4, end:6},
 * ]
 * The string should be given as a list if comma delimited 1 based ranges.
 * The result is given as a 0 based array of ranges.
 * 
 * @param {string} str
 * @returns {Array}
 */
function strToRange( str )
{
    var range = str.replace(' ', '').split(','),
        i = range.length,
        ranges = [],
        start, end, splitted;
    
    while(i--)
    {
        // Multiple lines highlight
        if( range[i].indexOf('-') > -1 )
        {
            splitted = range[i].split('-');
            start = parseInt(splitted[0])-1;
            end = parseInt(splitted[1])-1;
        }

        // Single line highlight
        else
        {
            start = parseInt(range[i])-1;
            end = start;
        }
        
        ranges.unshift({start:start,end:end});
    }
    
    return ranges;
}

/**
 * Request animation frame. Uses setTimeout as a fallback if the browser does
 * not support requestAnimationFrame (based on 60 frames per second).
 * 
 * @param {type} cb
 * @returns {Number}
 */
var raf = window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(cb) { return window.setTimeout(cb, 1000 / 60); };

/**
 * The constructor.
 * See Mivhal.defaults for available options.
 * 
 * @param {DOMElement} selection
 * @param {Object} options
 */
function Mivhak( selection, options )
{   
    // Bail if there are no resources
    if(!selection.getElementsByTagName('PRE').length) return;
    
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
 * Initiate the code viewer.
 */
Mivhak.prototype.init = function() 
{
    this.initState();
    this.parseResources();
    this.createUI();
    this.applyOptions();
    this.callMethod('showTab',0); // Show first tab initially
};

/**
 * Apply the options that were set by the user. This function is called when
 * Mivhak is initiated, and every time the options are updated.
 */
Mivhak.prototype.applyOptions = function() 
{
    this.callMethod('setHeight', this.options.height);
    this.callMethod('setAccentColor', this.options.accentColor);
    if(this.options.collapsed) this.callMethod('collapse');
    if(!this.options.topbar) this.$selection.addClass('mivhak-no-topbar');
    else this.$selection.removeClass('mivhak-no-topbar');
    
    this.createCaption();
    this.createLivePreview();
};

/**
 * Initiate this instance's state.
 */
Mivhak.prototype.initState = function() 
{
    this.state = {
        lineWrap:   true,
        collapsed:  false,
        height:     0,
        activeTab:  null,   // Updated by tabs.showTab
        resources:  []    // Generated by parseResources()
    };
};

/**
 * Set or update this instance's options.
 * @param {object} options
 */
Mivhak.prototype.setOptions = function( options ) 
{
    // If options were already set, update them
    if( typeof this.options !== 'undefined' )
        this.options = $.extend(true, {}, this.options, options, readAttributes(this.$selection[0]));
    
    // Otherwise, merge them with the defaults
    else this.options = $.extend(true, {}, Mivhak.defaults, options, readAttributes(this.$selection[0]));
};

/**
 * Call one of Mivhak's methods. See Mivhak.methods for available methods.
 * To apply additional arguments, simply pass the arguments after the methodName
 * i.e. callMethod('methodName', arg1, arg2).
 * This method is also called internally when making a method call through jQuery
 * i.e. $('#el').mivhak('methodName', arg1, arg2);
 * 
 * @param {string} methodName
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
 * Create the user interface.
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

/**
 * Calculate the height in pixels.
 * 
 * auto: Automatically calculate the height based on the number of lines.
 * min: Calculate the height based on the height of the tab with the maximum number of lines
 * max: Calculate the height based on the height of the tab with the minimum number of lines
 * average: Calculate the height based on the average height of all tabs
 * 
 * @param {string|number} h One of (auto|min|max|average) or a custom number
 * @returns {Number}
 */
Mivhak.prototype.calculateHeight = function(h)
{
    var heights = [],
        padding = this.options.padding*2,
        i = this.tabs.tabs.length;

    while(i--)
        heights.unshift(getEditorHeight($(this.tabs.tabs[i].resource.pre))+padding);

    if('average' === h) return average(heights);
    if('min' === h) return min(heights);
    if('max' === h) return max(heights);
    if('auto' === h) return getEditorHeight($(this.activeTab.resource.pre))+padding;
    if(!isNaN(h)) return parseInt(h);
    return heights[0];
};

/**
 * Loop through each PRE element inside this.$selection and store it's options
 * in this.resources, merging it with the default option values.
 */
Mivhak.prototype.parseResources = function()
{
    var $this = this;
    
    this.resources = new Resources();
    this.$selection.find('pre').each(function(){
        $this.resources.add(this);
    });
};

Mivhak.prototype.createCaption = function()
{
    if(this.options.caption)
    {
        if(!this.caption)
        {
            this.caption = Mivhak.render('caption',{text: this.options.caption});
            this.$selection.append(this.caption.$el);
        }
        else this.caption.setText(this.options.caption);
    }
    else this.$selection.addClass('mivhak-no-caption');
};

/**
 * Create the live preview iframe window
 */
Mivhak.prototype.createLivePreview = function()
{
    if(this.options.runnable && typeof this.preview === 'undefined')
    {
        this.preview = Mivhak.render('live-preview',{resources: this.resources});
        this.tabs.$el.append(this.preview.$el);
    }
};

/**
 * Remove all generated elements, data and events.
 * 
 * TODO: keep initial HTML
 */
Mivhak.prototype.destroy = function() 
{
    this.$selection.empty();
};

/**
 * A list of Mivhak default options
 */
Mivhak.defaults = {
    
    /**
     * Whether to add a live preview (and a "play" button) to run the code
     * @type Boolean
     */
    runnable:       false,
    
    /**
     * Whether to allow the user to edit the code. If runnable is set to true, 
     * the live preview will be updated when the code changes.
     * @type Boolean
     */
    editable:       false,
    
    /**
     * Whether to show line numbers on the left
     * @type Boolean
     */
    lineNumbers:    false,
    
    /**
     * One of the supported CSS color formats (HEX, RGB, etc...) to be used as 
     * the code viewer's accent color. The color will be applied to scrollbars, 
     * tab navigation and dropdown items. 
     * @type String
     */
    accentColor:    false,
    
    /**
     * Whether to collapse the code viewer initially
     * @type Boolean
     */
    collapsed:      false,
    
    /**
     * Text/HTML string to be displayed at the bottom of the code viewer
     * @type Boolean|string
     */
    caption:        false,
    
    /**
     * The code viewer's theme. One of (dark|light)
     * @type String
     */
    theme:          'light',
    
    /**
     * The code viewer's height. Either a number (for a custom height in pixels) 
     * or one of (auto|min|max|average).
     * @type String|Number
     */
    height:         'average',
    
    /**
     * The surrounding padding between the code and the wrapper.
     * @type Number
     */
    padding:        15,
    
    /**
     * Whether to show/hide the top bar
     * @type Boolean
     */
    topbar: true,
    
    /**
     * An array of strings/objects for the settings dropdown menu
     * @type Array
     */
    buttons:        ['wrap','copy','collapse','about']
};

/**
 * A list of Mivhak resource default settings (Mivhak resources are any <pre> 
 * elements placed inside a Mivhak wrapper element).
 */
Mivhak.resourceDefaults = {
    
    /**
     * The resource language (one of the supported Ace Editor languages)
     * @type string
     */
    lang:           null,
    
    /**
     * How the resource should be treated in the preview window. One of (script|style|markup)
     * @type bool|string
     */
    runAs:          false,
    
    /**
     * A URL to an external source
     * @type bool|string
     */
    source:         false,
    
    /**
     * Whether to show this resource as a tab. Useful if you want to include
     * external libraries for the live preview and don't need to see their contents.
     * @type Boolean
     */
    visible:        true,
    
    /**
     * Mark/highlight a range of lines given as a string in the format '1, 3-4'
     * @type bool|string
     */
    mark:           false,
    
    /**
     * Set the initial line number (1 based).
     * @type Number
     */
    startLine:      1
};/**
 * Any <pre> element inside the mivhak wrapper is considered to be a Mivhak 
 * resource. When a new Mivhak instance is created, the list of resources is 
 * parsed nad stored in this object.
 * 
 * @returns {Resources}
 */
var Resources = function() {
    this.data = [];
};

/**
 * Return the number of resources
 * @returns {Number}
 */
Resources.prototype.count = function() {
    return this.data.length;
};

/**
 * Add a resource to the list. Given a <pre> element, this function will extract
 * all the attributes beginning with 'miv-' and the element's content and insert
 * it to the list of resources.
 * 
 * @param {DOMElement} pre
 */
Resources.prototype.add = function(pre) {
    this.data.push($.extend({},
        Mivhak.resourceDefaults,{
            pre:pre, 
            content: pre.textContent
        },
        readAttributes(pre)
    ));
};

/**
 * Get a resource by a given index
 * @param {Number} i
 * @returns {Object}
 */
Resources.prototype.get = function(i) {
    return this.data[i];
};

/**
 * Update the content of the resource corresponding to the given index.
 * 
 * @param {number} i
 * @param {string} content
 */
Resources.prototype.update = function(i, content) {
    this.data[i].content = content;
};

// Built-in buttons
Mivhak.buttons = {
    
    /**
     * The wrap button features a toggle button and is used to toggle line wrap
     * on/off for the currently active tab
     */
    wrap: {
        text: 'Wrap Lines', 
        toggle: true, 
        click: function(e) {
            e.stopPropagation();
            this.callMethod('toggleLineWrap');
        }
    },
    
    /**
     * The copy button copies the code in the currently active tab to clipboard
     * (except for Safari, where it selects the code and prompts the user to press command+c)
     */
    copy: {
        text: 'Copy',
        click: function(e) {
            this.callMethod('copyCode');
        }
    },
    
    /**
     * The collapse button toggles the entire code viewer into and out of its
     * collapsed state.
     */
    collapse: {
        text: 'Colllapse',
        click: function(e) {
            this.callMethod('collapse');
        }
    },
    
    /**
     * The about button shows the user information about Mivhak
     */
    about: {
        text: 'About Mivhak',
        click: function(e) {
            this.notifier.closableNotification('Mivhak.js v1.0.0');
        }
    }
};/**
 * jQuery plugin's methods. 
 * In all methods, the 'this' keyword is pointing to the calling instance of Mivhak.
 * These functions serve as the plugin's public API.
 */
Mivhak.methods = {
    
    /**
     * Toggle line wrap on/off for the currently active tab. Initially set to 
     * on (true) by default.
     */
    toggleLineWrap: function() {
        var $this = this;
        this.state.lineWrap = !this.state.lineWrap;
        $.each(this.tabs.tabs, function(i,tab) {
            tab.editor.getSession().setUseWrapMode($this.state.lineWrap);
            tab.vscroll.refresh();
            tab.hscroll.refresh();
        });
    },
    
    /**
     * copy the code in the currently active tab to clipboard (works in all
     * browsers apart from Safari, where it selects the code and prompts the 
     * user to press command+c)
     */
    copyCode: function() {
        var editor = this.activeTab.editor;
        editor.selection.selectAll();
        editor.focus();
        if(document.execCommand('copy')) {
            editor.selection.clearSelection();
            this.notifier.timedNotification('Copied to clipboard!', 2000);
        }
        else this.notifier.timedNotification('Press &#8984;+C to copy the code', 2000);
    },
    
    /**
     * Collapse the code viewer and show a "Show Code" button.
     */
    collapse: function() {
        if(this.state.collapsed) return;
        var $this = this;
        this.state.collapsed = true;
        this.notifier.closableNotification('Show Code', function(){$this.callMethod('expand');});
        this.$selection.addClass('mivhak-collapsed');
        this.callMethod('setHeight',this.notifier.$el.outerHeight(true));
    },
    
    /**
     * Expand the code viewer if it's collapsed;
     */
    expand: function() {
        if(!this.state.collapsed) return;
        this.state.collapsed = false;
        this.notifier.hide(); // In case it's called by an external script
        this.$selection.removeClass('mivhak-collapsed');
        this.callMethod('setHeight',this.options.height);
    },
    
    /**
     * Show/activate a tab by the given index (zero based).
     * @param {number} index
     */
    showTab: function(index) {
        this.tabs.showTab(index);
        this.topbar.activateNavTab(index);
        if(this.options.runnable)
            this.preview.hide();
    },
    
    /**
     * Set the height of the code viewer. One of (auto|min|max|average) or 
     * a custom number.
     * @param {string|number} height
     */
    setHeight: function(height) {
        var $this = this;
        raf(function(){
            $this.state.height = $this.calculateHeight(height);
            $this.tabs.$el.height($this.state.height);
            $.each($this.tabs.tabs, function(i,tab) {
                tab.editor.resize();
                tab.vscroll.refresh();
                tab.hscroll.refresh();
            });
        });
    },
    
    /**
     * Set the code viewer's accent color. Applied to the nav-tabs text color, 
     * underline, scrollbars and dropdown menu text color.
     * 
     * @param {string} color
     */
    setAccentColor: function(color) {
        if(!color) return;
        this.topbar.$el.find('.mivhak-top-bar-button').css({'color': color});
        this.topbar.$el.find('.mivhak-dropdown-button').css({'color': color});
        this.topbar.$el.find('.mivhak-controls svg').css({'fill': color});
        this.tabs.$el.find('.mivhak-scrollbar-thumb').css({'background-color': color});
        this.topbar.line.css({'background-color': color});
    }
};Mivhak.icons = {};

// <div>Icons made by <a href="http://www.flaticon.com/authors/egor-rumyantsev" title="Egor Rumyantsev">Egor Rumyantsev</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
Mivhak.icons.play = '<svg viewBox="0 0 232.153 232.153"><g><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"/></g></svg>';

// <div>Icons made by <a href="http://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
Mivhak.icons.cog = '<svg viewbox="0 0 438.529 438.529"><g><path d="M436.25,181.438c-1.529-2.002-3.524-3.193-5.995-3.571l-52.249-7.992c-2.854-9.137-6.756-18.461-11.704-27.98c3.422-4.758,8.559-11.466,15.41-20.129c6.851-8.661,11.703-14.987,14.561-18.986c1.523-2.094,2.279-4.281,2.279-6.567c0-2.663-0.66-4.755-1.998-6.28c-6.848-9.708-22.552-25.885-47.106-48.536c-2.275-1.903-4.661-2.854-7.132-2.854c-2.857,0-5.14,0.855-6.854,2.567l-40.539,30.549c-7.806-3.999-16.371-7.52-25.693-10.565l-7.994-52.529c-0.191-2.474-1.287-4.521-3.285-6.139C255.95,0.806,253.623,0,250.954,0h-63.38c-5.52,0-8.947,2.663-10.278,7.993c-2.475,9.513-5.236,27.214-8.28,53.1c-8.947,2.86-17.607,6.476-25.981,10.853l-39.399-30.549c-2.474-1.903-4.948-2.854-7.422-2.854c-4.187,0-13.179,6.804-26.979,20.413c-13.8,13.612-23.169,23.841-28.122,30.69c-1.714,2.474-2.568,4.664-2.568,6.567c0,2.286,0.95,4.57,2.853,6.851c12.751,15.42,22.936,28.549,30.55,39.403c-4.759,8.754-8.47,17.511-11.132,26.265l-53.105,7.992c-2.093,0.382-3.9,1.621-5.424,3.715C0.76,182.531,0,184.722,0,187.002v63.383c0,2.478,0.76,4.709,2.284,6.708c1.524,1.998,3.521,3.195,5.996,3.572l52.25,7.71c2.663,9.325,6.564,18.743,11.704,28.257c-3.424,4.761-8.563,11.468-15.415,20.129c-6.851,8.665-11.709,14.989-14.561,18.986c-1.525,2.102-2.285,4.285-2.285,6.57c0,2.471,0.666,4.658,1.997,6.561c7.423,10.284,23.125,26.272,47.109,47.969c2.095,2.094,4.475,3.138,7.137,3.138c2.857,0,5.236-0.852,7.138-2.563l40.259-30.553c7.808,3.997,16.371,7.519,25.697,10.568l7.993,52.529c0.193,2.471,1.287,4.518,3.283,6.14c1.997,1.622,4.331,2.423,6.995,2.423h63.38c5.53,0,8.952-2.662,10.287-7.994c2.471-9.514,5.229-27.213,8.274-53.098c8.946-2.858,17.607-6.476,25.981-10.855l39.402,30.84c2.663,1.712,5.141,2.563,7.42,2.563c4.186,0,13.131-6.752,26.833-20.27c13.709-13.511,23.13-23.79,28.264-30.837c1.711-1.902,2.569-4.09,2.569-6.561c0-2.478-0.947-4.862-2.857-7.139c-13.698-16.754-23.883-29.882-30.546-39.402c3.806-7.043,7.519-15.701,11.136-25.98l52.817-7.988c2.279-0.383,4.189-1.622,5.708-3.716c1.523-2.098,2.279-4.288,2.279-6.571v-63.376C438.533,185.671,437.777,183.438,436.25,181.438z M270.946,270.939c-14.271,14.277-31.497,21.416-51.676,21.416c-20.177,0-37.401-7.139-51.678-21.416c-14.272-14.271-21.411-31.498-21.411-51.673c0-20.177,7.135-37.401,21.411-51.678c14.277-14.272,31.504-21.411,51.678-21.411c20.179,0,37.406,7.139,51.676,21.411c14.274,14.277,21.413,31.501,21.413,51.678C292.359,239.441,285.221,256.669,270.946,270.939z"/></g></svg>';/**
 * The list of registered components.
 * 
 * @type Array
 */
Mivhak.components = [];

/**
 * Register a new component
 * 
 * @param {string} name The components name
 * @param {Object} options A list of component properties
 */
Mivhak.component = function(name, options)
{
    Mivhak.components[name] = options;
};

/**
 * Render a new component
 * 
 * TODO: move this into a seperate library
 * 
 * @param {string} name The components name
 * @param {Object} props A list of component properties. 
 * This overrides the component's initial property values.
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
};Mivhak.component('caption', {
    template: '<div class="mivhak-caption"></div>',
    props: {
        text: null
    },
    created: function() {
        this.setText(this.text);
    },
    methods: {
        setText: function(text) {
            this.$el.html(text);
        }
    }
});Mivhak.component('dropdown', {
    template: '<div class="mivhak-dropdown"></div>',
    props: {
        items: [],
        mivhakInstance: null,
        visible: false
    },
    created: function() {
        var $this = this;
        $.each(this.items, function(i, item) {
            if( typeof item === 'string') item = Mivhak.buttons[item];
            var button = $('<div>',{class: 'mivhak-dropdown-button', text: item.text, click: function(e){item.click.call($this.mivhakInstance,e);}});
            if(item.toggle) 
            {
                button.$toggle = Mivhak.render('toggle');
                
                // Toggle only if not clicking on the toggle itself (which makes it toggle as it is)
                button.click(function(e){if($(e.target).parents('.mivhak-dropdown-button').length !== 1)button.$toggle.toggle();});
                button.append(button.$toggle.$el);
            }
            $this.$el.append(button);
        });
        
        // Hide dropdown on outside click
        $(window).click(function(e){
            if(!$(e.target).closest('.mivhak-icon-cog').length) {
                $this.$el.removeClass('mivhak-dropdown-visible');
                $this.$el.parent().removeClass('mivhak-button-active');
            }
        });
    },
    methods: {
        toggle: function() {
            this.visible = !this.visible;
            this.$el.toggleClass('mivhak-dropdown-visible');
        }
    }
});Mivhak.component('horizontal-scrollbar', {
    template: '<div class="mivhak-scrollbar mivhak-h-scrollbar"><div class="mivhak-scrollbar-thumb"></div></div>',
    props: {
        editor: null,
        $inner: null,
        $outer: null,
        mivhakInstance: null,
        minWidth: 50,
        state: {
            a: 0,    // The total width of the editor
            b: 0,    // The width of the viewport, excluding padding
            c: 0,    // The width of the viewport, including padding
            d: 0,    // The calculated width of the thumb
            l: 0     // The current left offset of the viewport
        },
        initialized: false
    },
    methods: {
        initialize: function() {
            if(!this.initialized)
            {
                this.initialized = true;
                this.dragDealer();
                var $this = this;
                $(window).resize(function(){
                    if(!$this.mivhakInstance.state.lineWrap)
                        $this.refresh();
                });
            }
            this.refresh();
        },
        updateState: function() {
            var oldState = $.extend({}, this.state);
            this.state.a = this.getEditorWidth();
            this.state.b = this.$outer.parent().width();
            this.state.c = this.state.b - this.mivhakInstance.options.padding*2;
            this.state.d = Math.max(this.state.c*this.state.b/this.state.a,this.minWidth);
            this.state.l *=  this.state.a/Math.max(oldState.a,1); // Math.max used to prevent division by zero
            return this.state.a !== oldState.a || this.state.b !== oldState.b;
        },
        refresh: function() {
            var $this = this, oldLeft = this.state.l;
            raf(function(){
                if($this.updateState())
                {
                    if($this.getDifference() > 0)
                    {
                        $this.doScroll('left',oldLeft-$this.state.l);
                        $this.$el.css({width: $this.state.d + 'px', left: 0});
                        $this.moveBar();
                    }
                    else 
                    {
                        $this.doScroll('left',$this.state.l);
                        $this.$el.css({width: 0});
                    }
                }
            });
        },
        dragDealer: function(){
            var $this = this,
                lastPageX;

            this.$el.on('mousedown.drag', function(e) {
                lastPageX = e.pageX;
                $this.$el.add(document.body).addClass('mivhak-scrollbar-grabbed');
                $(document).on('mousemove.drag', drag).on('mouseup.drag', stop);
                return false;
            });

            function drag(e){
                var delta = e.pageX - lastPageX,
                    didScroll;

                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageX = e.pageX;
                
                raf(function(){
                    didScroll = $this.doScroll(delta > 0 ? 'right' : 'left', Math.abs(delta*$this.getEditorWidth()/$this.$outer.parent().width()));
                    if(0 !== didScroll) $this.moveBar();
                });
            }

            function stop() {
                $this.$el.add(document.body).removeClass('mivhak-scrollbar-grabbed');
                $(document).off("mousemove.drag mouseup.drag");
            }
        },
        moveBar: function() {
            this.$el.css({
                left:  (this.state.b-this.state.d)/(this.state.a-this.state.c)*this.state.l + 'px'
            });
        },
        
        /**
         * Scrolls the editor element in the direction given, provided that there 
         * is remaining scroll space
         * @param {string} dir
         * @param {int} delta
         */
        doScroll: function(dir, delta) {
            var s = this.state,
                remaining,
                didScroll;
            
            if('left' === dir) 
            {
                remaining = s.l;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.l -= didScroll;
            }
            if('right' === dir) 
            {
                remaining = this.getDifference() - s.l;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.l += didScroll;
            }
            
            this.$inner.find('.ace_content').css({'margin-left': -s.l});
            return didScroll;
        },
        
        /**
         * Returns the difference between the containing div and the editor div
         */
        getDifference: function()
        {
            return this.state.a - this.state.c;
        },
        
        /**
         * Calculate the editor's width based on the number of lines
         */
        getEditorWidth: function() {
            return this.$inner.find('.ace_content').width();
        }
    }
});Mivhak.component('live-preview', {
    template: '<iframe class="mivhak-live-preview" allowtransparency="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" frameborder="0"></iframe>',
    props: {
        resources: []
    },
    methods: {
        renderHTML: function() {
            var html = '<html>',
                head = '<head>',
                body = '<body>';
            
            head += '<meta http-equiv="content-type" content="text/html; charset=UTF-8">';
            head += '<meta name="robots" content="noindex, nofollow">';
            head += '<meta name="googlebot" content="noindex, nofollow">';
            
            for(var i = 0; i < this.resources.count(); i++)
            {
                var source = this.resources.get(i);
                if('markup' === source.runAs) body += source.content;
                if('style' === source.runAs) head += this.createStyle(source.content, source.visible ? false : source.source);
                if('script' === source.runAs) head += this.createScript(source.content, source.visible ? false : source.source);
            }
            
            html += head+'</head>'+body+'</body></html>';
            
            return html;
        },
        createScript: function(content,src) {
            if(src) return '<script src="'+src+'" type="text/javascript"></script>';
            return '<script>\n//<![CDATA[\nwindow.onload = function(){'+content+'};//]]>\n</script>'; // @see http://stackoverflow.com/questions/66837/when-is-a-cdata-section-necessary-within-a-script-tag
        },
        createStyle: function(content,href) {
            if(href) return '<link href="'+href+'" rel="stylesheet">';
            return '<style>'+content+'</style>';
        },
        show: function() {
            this.$el.addClass('mivhak-active');
            this.run();
        },
        hide: function() {
            this.$el.removeClass('mivhak-active');
        },
        run: function() {
            var contents = this.$el.contents(),
                doc = contents[0];
        
            doc.open();
            doc.writeln(this.renderHTML());
            doc.close();
        }
    }
});Mivhak.component('notifier', {
    template: '<div class="mivhak-notifier"></div>',
    methods: {
        notification: function(html) {
            if(!html) return;
            clearTimeout(this.timeout);
            this.$el.off('click');
            this.$el.html(html);
            this.$el.addClass('mivhak-visible');
        },
        timedNotification: function(html, timeout) {
            var $this = this;
            this.notification(html);
            this.timeout = setTimeout(function(){
                $this.hide();
            },timeout);
        },
        closableNotification: function(html, onclick)
        {
            var $this = this;
            this.notification(html);
            this.$el.addClass('mivhak-button');
            this.$el.click(function(e){
                $this.hide();
                if(typeof onclick !== 'undefined')
                    onclick.call(null, e);
            });
        },
        hide: function() {
            this.$el.removeClass('mivhak-visible mivhak-button');
        }
    }
});Mivhak.component('tab-pane', {
    template: '<div class="mivhak-tab-pane"><div class="mivhak-tab-pane-inner"></div></div>',
    props: {
        resource:       null,
        editor:         null,
        index:          null,
        padding:        10,
        mivhakInstance: null
    },
    created: function() {
        this.setEditor();
        this.fetchRemoteSource();
        this.markLines();
        
        this.$el = $(this.resource.pre).wrap(this.$el).parent().parent();
        this.$el.find('.mivhak-tab-pane-inner').css({margin: this.mivhakInstance.options.padding});
        this.setScrollbars();
    },
    methods: {
        getTheme: function() {
            return this.mivhakInstance.options.theme === 'light' ? 'clouds' : 'ambiance';
        },
        fetchRemoteSource: function() {
            var $this = this;
            if(this.resource.source) {
                $.ajax(this.resource.source).done(function(res){
                    $this.editor.setValue(res,-1);
                    
                    // Refresh code viewer height
                    $this.mivhakInstance.callMethod('setHeight',$this.mivhakInstance.options.height);
                    
                    // Refresh scrollbars
                    raf(function(){
                        $this.vscroll.refresh();
                        $this.hscroll.refresh();
                    });
                });
                
            }
        },
        setScrollbars: function() {
            var $inner = $(this.resource.pre),
                $outer = this.$el.find('.mivhak-tab-pane-inner');
            
            this.vscroll = Mivhak.render('vertical-scrollbar',{editor: this.editor, $inner: $inner, $outer: $outer, mivhakInstance: this.mivhakInstance});
            this.hscroll = Mivhak.render('horizontal-scrollbar',{editor: this.editor, $inner: $inner, $outer: $outer, mivhakInstance: this.mivhakInstance});
            
            this.$el.append(this.vscroll.$el, this.hscroll.$el);
        },
        show: function() {
            this.$el.addClass('mivhak-tab-pane-active');
            this.editor.focus();
            this.editor.gotoLine(0); // Needed in order to get focus
            
            // Recalculate scrollbar positions based on the now visible element
            this.vscroll.initialize();
            this.hscroll.initialize();
        },
        hide: function() {
            this.$el.removeClass('mivhak-tab-pane-active');
        },
        setEditor: function() {
            
            // Remove redundant space from code
            this.resource.pre.textContent = this.resource.pre.textContent.trim(); 
            
            // Set editor options
            this.editor = ace.edit(this.resource.pre);
            this.editor.setReadOnly(!this.mivhakInstance.options.editable);
            this.editor.setTheme("ace/theme/"+this.getTheme());
            this.editor.setShowPrintMargin(false);
            this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
            this.editor.getSession().setMode("ace/mode/"+this.resource.lang);
            this.editor.getSession().setUseWorker(false); // Disable syntax checking
            this.editor.getSession().setUseWrapMode(true); // Set initial line wrapping

            this.editor.setOptions({
                maxLines: Infinity,
                firstLineNumber: this.resource.startLine,
                highlightActiveLine: false,
                fontSize: parseInt(14)
            });
            
            // Update source content for the live preview
            if(this.mivhakInstance.options.editable)
            {
                this.editor.getSession().on('change', (function() {
                    this.mivhakInstance.resources.update(this.index, this.editor.getValue());
                }).bind(this));
            }
            
            // Move view to show cursor position when the cursor moves
            this.editor.session.selection.on("changeCursor", (function(e){
                e.preventDefault();
                raf((function(){
                    var cursor = this.$el.find('.ace_cursor')[0].getBoundingClientRect(),
                        viewport = this.$el.find('.mivhak-tab-pane-inner')[0].getBoundingClientRect(),
                        up =  viewport.top - cursor.top,
                        down = cursor.top + cursor.height - viewport.top - viewport.height,
                        left = parseInt(this.$el.find('.ace_content').css('margin-left').replace('px',''));

                    // Move the scrollbar vertically only if the cursor leaves the viewport
                    this.vscroll.doScroll('up',Math.max(0, up)); //
                    this.vscroll.doScroll('down',Math.max(0, down));
                    this.vscroll.moveBar();
                    
                    // Ace Editor automatically moves the viewport, so we just need to move the scrollbar accordingly
                    this.hscroll.state.l = -left;
                    this.hscroll.moveBar();
                }).bind(this));
            }).bind(this));
        },
        markLines: function()
        {
            if(!this.resource.mark) return;
            var ranges = strToRange(this.resource.mark),
                i = ranges.length,
                AceRange = ace.require("ace/range").Range;

            while(i--)
            {
                this.editor.session.addMarker(
                    new AceRange(ranges[i].start, 0, ranges[i].end, 1), // Define the range of the marker
                    "ace_active-line",     // Set the CSS class for the marker
                    "fullLine"             // Marker type
                );
            }
        }
    }
});Mivhak.component('tabs', {
    template: '<div class="mivhak-tabs"></div>',
    props: {
        mivhakInstance: null,
        activeTab: null,
        tabs: []
    },
    created: function() {
        var $this = this;
        this.$el = this.mivhakInstance.$selection.find('pre').wrapAll(this.$el).parent();
        $.each(this.mivhakInstance.resources.data,function(i, resource){
            if(resource.visible)
                $this.tabs.push(Mivhak.render('tab-pane',{
                    resource: resource,
                    index: i,
                    mivhakInstance: $this.mivhakInstance
                }));
        });
    },
    methods: {
        showTab: function(index){
            var $this = this;
            $.each(this.tabs, function(i, tab){
                if(index === i) {
                    $this.mivhakInstance.activeTab = tab;
                    tab.show();
                }
                else tab.hide();
            });
        }
    }
});Mivhak.component('toggle', {
    template: '<div class="mivhak-toggle"><div class="mivhak-toggle-knob"></div></div>',
    props: {
        on: true
    },
    events: {
        click: function() {
            this.toggle();
        }
    },
    created: function() {
        this.$el.addClass('mivhak-toggle-'+(this.on?'on':'off'));
    },
    methods: {
        toggle: function() {
            this.on = !this.on;
            this.$el.toggleClass('mivhak-toggle-on').toggleClass('mivhak-toggle-off');
        }
    }
});Mivhak.component('top-bar-button', {
    template: '<div class="mivhak-top-bar-button"></div>',
    props: {
        text: null,
        icon: null,
        dropdown: null,
        mivhakInstance: null,
        onClick: function(){}
    },
    events: {
        click: function() {
            this.onClick();
        }
    },
    created: function() {
        var $this = this;
        this.$el.text(this.text);
        if(this.icon) this.$el.addClass('mivhak-icon mivhak-icon-'+this.icon).append($(Mivhak.icons[this.icon]));
        if(this.dropdown) 
        {
            $this.$el.append(this.dropdown.$el);
            this.onClick = function() {
                $this.toggleActivation();
                $this.dropdown.toggle();
            };
        }
    },
    methods: {
        activate: function() {
            this.$el.addClass('mivhak-button-active');
        },
        deactivate: function() {
            this.$el.removeClass('mivhak-button-active');
        },
        toggleActivation: function() {
            this.$el.toggleClass('mivhak-button-active');
        },
        isActive: function() {
            return this.$el.hasClass('mivhak-button-active');
        }
    }
});Mivhak.component('top-bar', {
    template: '<div class="mivhak-top-bar"><div class="mivhak-nav-tabs"></div><div class="mivhak-controls"></div><div class="mivhak-line"></div></div>',
    props: {
        mivhakInstance: null,
        navTabs: [],
        controls: [],
        line: null
    },
    created: function() {
        this.line = this.$el.find('.mivhak-line');
        this.createTabNav();
        if(this.mivhakInstance.options.runnable) this.createPlayButton();
        this.createCogButton();
    },
    methods: {
        activateNavTab: function(index) {
            var button = this.navTabs[index];
            // Deactivate all tabs and activate this tab
            $.each(this.navTabs, function(i,navTab){navTab.deactivate();});
            button.activate();

            // Position the line
            this.moveLine(button.$el);
        },
        moveLine: function($el) {
            if(typeof $el === 'undefined') {
                this.line.removeClass('mivhak-visible');
                return;
            }
            this.line.width($el.width());
            this.line.css({left:$el.position().left + ($el.outerWidth() - $el.width())/2});
            this.line.addClass('mivhak-visible');
        },
        createTabNav: function() {
            var source, i, pos = 0;
            for(i = 0; i < this.mivhakInstance.resources.count(); i++)
            {
                source = this.mivhakInstance.resources.get(i);
                if(source.visible) this.createNavTabButton(pos++, source.lang);
            }
        },
        createNavTabButton: function(i, lang) {
            var $this = this,
                button = Mivhak.render('top-bar-button',{
                text: lang,
                onClick: function() {
                    $this.mivhakInstance.callMethod('showTab',i);
                }
            });
            this.navTabs.push(button);
            this.$el.find('.mivhak-nav-tabs').append(button.$el);
        },
        createPlayButton: function() {
            var $this = this;
            var playBtn = Mivhak.render('top-bar-button',{
                icon: 'play',
                onClick: function() {
                    $this.mivhakInstance.preview.show();
                    $this.moveLine();
                }
            });
            this.controls.push(playBtn);
            this.$el.find('.mivhak-controls').append(playBtn.$el);
        },
        createCogButton: function() {
            var cogBtn = Mivhak.render('top-bar-button',{
                icon: 'cog',
                mivhakInstance: this.mivhakInstance,
                dropdown: Mivhak.render('dropdown',{
                    mivhakInstance: this.mivhakInstance,
                    items: this.mivhakInstance.options.buttons
                })
            });
            this.controls.push(cogBtn);
            this.$el.find('.mivhak-controls').append(cogBtn.$el);
        }
    }
});Mivhak.component('vertical-scrollbar', {
    template: '<div class="mivhak-scrollbar mivhak-v-scrollbar"><div class="mivhak-scrollbar-thumb"></div></div>',
    props: {
        editor: null,
        $inner: null,
        $outer: null,
        mivhakInstance: null,
        minHeight: 50,
        state: {
            a: 0,    // The total height of the editor
            b: 0,    // The height of the viewport, excluding padding
            c: 0,    // The height of the viewport, including padding
            d: 0,    // The calculated thumb height
            t: 0     // The current top offset of the viewport
        },
        initialized: false
    },
    methods: {
        initialize: function() {
            if(!this.initialized)
            {
                this.initialized = true;
                this.dragDealer();
                var $this = this;
                this.$inner.on('mousewheel', function(e){$this.onScroll.call(this, e);});
                $(window).resize(function(){
                    if($this.mivhakInstance.state.lineWrap)
                        $this.refresh();
                });
            }
            // Refresh anytime initialize is called
            this.refresh();
        },
        updateState: function() {
            var oldState = $.extend({}, this.state);
            this.state.a = getEditorHeight(this.$inner);
            this.state.b = this.mivhakInstance.state.height;
            this.state.c = this.mivhakInstance.state.height-this.mivhakInstance.options.padding*2;
            this.state.d = Math.max(this.state.c*this.state.b/this.state.a,this.minHeight);
            this.state.t *=  this.state.a/Math.max(oldState.a,1); // Math.max used to prevent division by zero
            return this.state.a !== oldState.a || this.state.b !== oldState.b;
        },
        refresh: function() {
            var $this = this, oldTop = this.state.t;
            raf(function(){
                if($this.updateState())
                {
                    if($this.getDifference() > 0)
                    {
                        $this.doScroll('up',oldTop-$this.state.t);
                        $this.$el.css({height: $this.state.d + 'px', top: 0});
                        $this.moveBar();
                    }
                    else 
                    {
                        $this.doScroll('up',$this.state.t);
                        $this.$el.css({height: 0});
                    }
                }
            });
        },
        onScroll: function(e) {
            var didScroll;
            
            if(e.deltaY > 0)
                didScroll = this.doScroll('up',e.deltaY*e.deltaFactor);
            else
                didScroll = this.doScroll('down',-e.deltaY*e.deltaFactor);
            
            if(0 !== didScroll) {
                this.moveBar();
                e.preventDefault(); // Only prevent page scroll if the editor can be scrolled
            }
        },
        dragDealer: function(){
            var $this = this,
                lastPageY;

            this.$el.on('mousedown.drag', function(e) {
                lastPageY = e.pageY;
                $this.$el.add(document.body).addClass('mivhak-scrollbar-grabbed');
                $(document).on('mousemove.drag', drag).on('mouseup.drag', stop);
                return false;
            });

            function drag(e){
                var delta = e.pageY - lastPageY,
                    didScroll;
            
                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageY = e.pageY;
                
                raf(function(){
                    didScroll = $this.doScroll(delta > 0 ? 'down' : 'up', Math.abs(delta*getEditorHeight($this.$inner)/$this.$outer.parent().height()));
                    if(0 !== didScroll) $this.moveBar();
                });
            }

            function stop() {
                $this.$el.add(document.body).removeClass('mivhak-scrollbar-grabbed');
                $(document).off("mousemove.drag mouseup.drag");
            }
        },
        moveBar: function() {
            this.$el.css({
                top:  (this.state.b-this.state.d)/(this.state.a-this.state.c)*this.state.t + 'px'
            });
        },
        
        /**
         * Scrolls the editor element in the direction given, provided that there 
         * is remaining scroll space
         * @param {string} dir
         * @param {int} delta
         */
        doScroll: function(dir, delta) {
            var s = this.state,
                remaining,
                didScroll;
            
            if('up' === dir) 
            {
                remaining = s.t;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.t -= didScroll;
            }
            if('down' === dir) 
            {
                remaining = this.getDifference() - s.t;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.t += didScroll;
            }
            
            this.$inner.css({top: -s.t});
            return didScroll;
        },
        
        /**
         * Returns the difference between the containing div and the editor div
         */
        getDifference: function()
        {
            return this.state.a - this.state.c;
        }
    }
});/**
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
};}( jQuery ));