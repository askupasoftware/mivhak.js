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
     * Whther to allow the user to edit the code
     * @type Boolean
     */
    editable:       false,
    
    /**
     * Whether to show line numers on the left
     * @type Boolean
     */
    lineNumbers:    false,
    
    /**
     * One of the supported CSS color values (HEX, RGB, etc...) to set as the 
     * code viewer's accent color. Controls the scrollbars, tab navigation and 
     * dropdown item colors.
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
Mivhak.sourceDefaults = {
    
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
     * @type string
     */
    source:         false,
    
    /**
     * Whether to show this resource as a tab. Useful if you want to include
     * external libraries for the live preview and don't need to see their contents.
     * @type Boolean
     */
    visible:        true
};