/**
 * Package: mivhak-js
 * URL:     http://products.askupasoftware.com/mivhak-js
 * Version: 1.0.0
 * Date:    2016-06-17
 * License: GNU GENERAL PUBLIC LICENSE
 *
 * Developed by Askupa Software http://www.askupasoftware.com
 */
/* test-code */
var testapi = {};
/* end-test-code */

(function ( $ ) {// Ace global config
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/');/**
 * Converts a string to it's actual value, if applicable
 * @param {String} str
 */
function strToValue( str )
{
    if('true' === str.toLowerCase()) return true;
    if('false' === str.toLowerCase()) return false;
    if(!isNaN(str)) return parseFloat(str);
    return str;
}

function toCamelCase( str )
{
    return str.replace(/-(.)/g,function(match){
        return match[1].toUpperCase();
    });
}

/**
 * Reads the element's 'miv-' attributes and returns their values as an object
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

// Request animation frame
var raf = window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(cb) { return window.setTimeout(cb, 1000 / 60); };

/* test-code */
testapi.strToValue = strToValue;
testapi.toCamelCase = toCamelCase;
testapi.readAttributes = readAttributes;
/* end-test-code */$._components = [];

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
};/**
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
    this.createTabs();
    this.createTopBar();
    this.callMethod('setHeight', 150);
    this.callMethod('showTab',0); // Show first tab initially
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
/* end-test-code */Mivhak.defaults = {
    runnable:       false,
    editable:       false,
    lineNumbers:    false,
    accentColor:    'currentColor',
    collapsed:      false,
    theme:          'light',
    height:         'auto',
    buttons:        ['wrap','copy','collapse','about'],
    ace:            {}
};/**
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
        });
    },
    showTab: function(index) {
        this.tabs.showTab(index);
        this.topbar.activateNavTab(index);
    },
    setHeight: function(height) {
        this.tabs.$el.height(height);
        $.each(this.tabs.tabs, function(i,tab) {
            $(tab.pre).height(height);
            tab.editor.resize();
        });
    },
    update: function(options) {
        // Update options here
    }
};Mivhak.icons = {};

// <div>Icons made by <a href="http://www.flaticon.com/authors/egor-rumyantsev" title="Egor Rumyantsev">Egor Rumyantsev</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
Mivhak.icons.play = '<svg viewBox="0 0 232.153 232.153"><g><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"/></g></svg>';

// <div>Icons made by <a href="http://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
Mivhak.icons.cog = '<svg viewbox="0 0 438.529 438.529"><g><path d="M436.25,181.438c-1.529-2.002-3.524-3.193-5.995-3.571l-52.249-7.992c-2.854-9.137-6.756-18.461-11.704-27.98c3.422-4.758,8.559-11.466,15.41-20.129c6.851-8.661,11.703-14.987,14.561-18.986c1.523-2.094,2.279-4.281,2.279-6.567c0-2.663-0.66-4.755-1.998-6.28c-6.848-9.708-22.552-25.885-47.106-48.536c-2.275-1.903-4.661-2.854-7.132-2.854c-2.857,0-5.14,0.855-6.854,2.567l-40.539,30.549c-7.806-3.999-16.371-7.52-25.693-10.565l-7.994-52.529c-0.191-2.474-1.287-4.521-3.285-6.139C255.95,0.806,253.623,0,250.954,0h-63.38c-5.52,0-8.947,2.663-10.278,7.993c-2.475,9.513-5.236,27.214-8.28,53.1c-8.947,2.86-17.607,6.476-25.981,10.853l-39.399-30.549c-2.474-1.903-4.948-2.854-7.422-2.854c-4.187,0-13.179,6.804-26.979,20.413c-13.8,13.612-23.169,23.841-28.122,30.69c-1.714,2.474-2.568,4.664-2.568,6.567c0,2.286,0.95,4.57,2.853,6.851c12.751,15.42,22.936,28.549,30.55,39.403c-4.759,8.754-8.47,17.511-11.132,26.265l-53.105,7.992c-2.093,0.382-3.9,1.621-5.424,3.715C0.76,182.531,0,184.722,0,187.002v63.383c0,2.478,0.76,4.709,2.284,6.708c1.524,1.998,3.521,3.195,5.996,3.572l52.25,7.71c2.663,9.325,6.564,18.743,11.704,28.257c-3.424,4.761-8.563,11.468-15.415,20.129c-6.851,8.665-11.709,14.989-14.561,18.986c-1.525,2.102-2.285,4.285-2.285,6.57c0,2.471,0.666,4.658,1.997,6.561c7.423,10.284,23.125,26.272,47.109,47.969c2.095,2.094,4.475,3.138,7.137,3.138c2.857,0,5.236-0.852,7.138-2.563l40.259-30.553c7.808,3.997,16.371,7.519,25.697,10.568l7.993,52.529c0.193,2.471,1.287,4.518,3.283,6.14c1.997,1.622,4.331,2.423,6.995,2.423h63.38c5.53,0,8.952-2.662,10.287-7.994c2.471-9.514,5.229-27.213,8.274-53.098c8.946-2.858,17.607-6.476,25.981-10.855l39.402,30.84c2.663,1.712,5.141,2.563,7.42,2.563c4.186,0,13.131-6.752,26.833-20.27c13.709-13.511,23.13-23.79,28.264-30.837c1.711-1.902,2.569-4.09,2.569-6.561c0-2.478-0.947-4.862-2.857-7.139c-13.698-16.754-23.883-29.882-30.546-39.402c3.806-7.043,7.519-15.701,11.136-25.98l52.817-7.988c2.279-0.383,4.189-1.622,5.708-3.716c1.523-2.098,2.279-4.288,2.279-6.571v-63.376C438.533,185.671,437.777,183.438,436.25,181.438z M270.946,270.939c-14.271,14.277-31.497,21.416-51.676,21.416c-20.177,0-37.401-7.139-51.678-21.416c-14.272-14.271-21.411-31.498-21.411-51.673c0-20.177,7.135-37.401,21.411-51.678c14.277-14.272,31.504-21.411,51.678-21.411c20.179,0,37.406,7.139,51.676,21.411c14.274,14.277,21.413,31.501,21.413,51.678C292.359,239.441,285.221,256.669,270.946,270.939z"/></g></svg>';Mivhak.components = [];

Mivhak.component = function(name, options)
{
    Mivhak.components[name] = options;
};Mivhak.component('dropdown', {
    template: '<div class="mivhak-dropdown"></div>',
    props: {
        items: [],
        mivhakInstance: null,
        visible: false
    },
    created: function() {
        var $this = this;
        $.each(this.items, function(i, item) {
            if( typeof item === 'string') item = dropdownButtons[item];
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
    },
    methods: {
        toggle: function() {
            this.visible = !this.visible;
            this.$el.toggleClass('mivhak-dropdown-visible');
        }
    }
});

// Built-in buttons
var dropdownButtons = {
    wrap: {
        text: 'Wrap Lines', 
        toggle: true, 
        click: function(e) {
            e.stopPropagation();
            this.callMethod('toggleLineWrap');
        }
    },
    copy: {
        text: 'Copy',
        click: function(e) {
            e.stopPropagation();
            console.log('copy called');
        }
    },
    collapse: {
        text: 'Colllapse',
        click: function(e) {
            e.stopPropagation();
            console.log('Colllapse called');
        }
    },
    about: {
        text: 'About Mivhak',
        click: function(e) {
            e.stopPropagation();
            console.log('about called');
        }
    }
};Mivhak.component('scrollbar', {
    template: '<div class="mivhak-scrollbar"></div>',
    props: {
        orientation: null,
        $inner: null,
        $outer: null,
        innerTop: 0,
        padding: 10
    },
    created: function() {
        var $this = this;
        
        this.$el.addClass('mivhak-'+this.orientation+'-scrollbar');
        this.dragDealer();
        if('v' === $this.orientation)
            this.$inner.on('DOMMouseScroll mousewheel',function(e){$this.onScroll.call(this, e);});
    },
    methods: {
        onScroll: function(e) {
            e.preventDefault();
            var didScroll;

            if(e.originalEvent.wheelDelta > 0)
                didScroll = this.doScroll('up',20);
            else
                didScroll = this.doScroll('down',20);
            
            if(0 !== didScroll) this.moveBar();
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
                    diff = $this.$inner.height() - $this.$outer.height(),
                    remaining,
                    move;
            
                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageY = e.pageY;
                remaining = delta > 0 ? diff - (-$this.innerTop) : (-$this.innerTop) ;
                move = remaining > 0 ? Math.min(remaining, Math.abs(delta)) : 0;
                
                raf(function(){
                    $this.innerTop += (delta > 0 ? -move : move);
                    $this.$inner.css({top: $this.innerTop});
                    $this.moveBar();
                });
            }

            function stop() {
                $this.$el.add(document.body).removeClass('mivhak-scrollbar-grabbed');
                $(document).off("mousemove.drag mouseup.drag");
            }
        },
        moveBar: function() {
            this.$el.css({
                top: (-this.innerTop) + this.padding + 'px'
            });
        },
        setPosition: function() {
            if('v' === this.orientation)
                this.$el.css({height: this.getRatio() * 100 + '%', top: this.padding});
            else this.$el.css({width: this.getRatio() * 100 + '%', left: this.padding});
        },
        getRatio: function() {
            if('v' === this.orientation)
                return (this.$outer.height() - this.padding*2 - 5) / this.$inner.outerHeight();
            return (this.$outer.width() - this.padding*2 - 5) / this.$inner.outerWidth();
        },
        doScroll: function(dir, delta) {
            var diff = this.$inner.height() - this.$outer.height(),
                remaining,
                didScroll;
            
            if('up' === dir) 
            {
                remaining = (-this.innerTop);
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                this.innerTop += didScroll;
            }
            if('down' === dir) 
            {
                remaining = diff - (-this.innerTop);
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                this.innerTop -= didScroll;
            }
            
            this.$inner.css({top: this.innerTop});
            return didScroll;
        }
    }
});Mivhak.component('tab-pane', {
    template: '<div class="mivhak-tab-pane"><div class="mivhak-tab-pane-inner"></div></div>',
    props: {
        pre: null,
        editor: null,
        padding: 10,
        mivhakInstance: null
    },
    created: function() {
        this.setOptions();
        this.setEditor();
        
        this.$el = $(this.pre).wrap(this.$el).parent().parent();
        this.vscroll = Mivhak.render('scrollbar',{orientation: 'v',$inner: $(this.pre), $outer: this.$el.find('.mivhak-tab-pane-inner')});
        this.hscroll = Mivhak.render('scrollbar',{orientation: 'h',$inner: $(this.pre), $outer: this.$el.find('.mivhak-tab-pane-inner')});
        this.$el.append(this.vscroll.$el, this.hscroll.$el);
    },
    methods: {
        getTheme: function() {
            return this.mivhakInstance.options.theme === 'light' ? 'clouds' : 'ambiance';
        },
        setOptions: function() {
            var $this = this;
            $.each(readAttributes(this.pre), function(name, value){
                $this[name] = value;
            });
        },
        show: function() {
            this.$el.addClass('mivhak-tab-pane-active');
            this.editor.focus();
            this.editor.gotoLine(0); // Needed in order to get focus
            
            // Recalculate scrollbar positions based on the now visible element
            this.vscroll.setPosition();
            this.hscroll.setPosition();
        },
        hide: function() {
            this.$el.removeClass('mivhak-tab-pane-active');
        },
        setEditor: function() {
            
            // Remove redundant space from code
            this.pre.innerText = this.pre.innerText.trim(); 
            
            // Set editor options
            this.editor = ace.edit(this.pre);
            this.editor.setReadOnly(!this.mivhakInstance.options.editable);
            this.editor.setTheme("ace/theme/"+this.getTheme());
            this.editor.setShowPrintMargin(false);
            this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
            this.editor.getSession().setMode("ace/mode/"+this.lang);
            this.editor.getSession().setUseWorker(false); // Disable syntax checking
            this.editor.getSession().setUseWrapMode(false); // Set initial line wrapping

            this.editor.setOptions({
                maxLines: Infinity,
                firstLineNumber: 1,
                highlightActiveLine: false,
                fontSize: parseInt(14)
            });
        }
    }
});Mivhak.component('tabs', {
    template: '<div class="mivhak-tabs"></div>',
    props: {
        mivhakInstance: null,
        tabs: []
    },
    created: function() {
        var $this = this;
        this.$el = this.mivhakInstance.$selection.find('pre').wrapAll(this.$el).parent();
        this.mivhakInstance.$selection.find('pre').each(function(){
            $this.tabs.push(Mivhak.render('tab-pane',{pre: this, mivhakInstance: $this.mivhakInstance}));
        });
    },
    methods: {
        showTab: function(index){
            $.each(this.tabs, function(i, tab){
                if(index === i) tab.show();
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
        var $this = this;
        
        this.line = this.$el.find('.mivhak-line');
        
        // Create tab navigation
        $.each(this.mivhakInstance.tabs.tabs, function(i,tab){
            var button = Mivhak.render('top-bar-button',{
                text: tab.lang,
                onClick: function() {
                    $this.mivhakInstance.callMethod('showTab',i);
                }
            });
            $this.navTabs.push(button);
            $this.$el.find('.mivhak-nav-tabs').append(button.$el);
        });
        
        // Create buttons on right
        $this.controls.push(Mivhak.render('top-bar-button',{
            icon: 'play',
            mivhakInstance: $this.mivhakInstance,
            onClick: function() {
                
            }
        }));
        
        $this.controls.push(Mivhak.render('top-bar-button',{
            icon: 'cog',
            mivhakInstance: $this.mivhakInstance,
            dropdown: Mivhak.render('dropdown',{
                mivhakInstance: $this.mivhakInstance,
                items: this.mivhakInstance.options.buttons
            })
        }));
        
        $this.$el.find('.mivhak-controls').append(
            $this.controls[0].$el,
            $this.controls[1].$el
        );
    },
    methods: {
        activateNavTab: function(index) {
            var button = this.navTabs[index];
            // Deactivate all tabs and activate this tab
            $.each(this.navTabs, function(i,navTab){navTab.deactivate();});
            button.activate();

            // Position the line
            this.line.width(button.$el.width());
            this.line.css({left:button.$el.position().left + (button.$el.outerWidth() - button.$el.width())/2});
        }
    }
});$.fn.mivhak = function( methodOrOptions ) {
        
     
    
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
};}( jQuery ));