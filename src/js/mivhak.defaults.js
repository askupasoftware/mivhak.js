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
     * Mivhak's accent color. The color will be applied to scrollbars, 
     * tab navigation and dropdown items. 
     * @type String
     */
    accentColor:    false,
    
    /**
     * Whether to collapse the viewport initially
     * @type Boolean
     */
    collapsed:      false,
    
    /**
     * Text/HTML string to be displayed at the bottom of the embedded code block
     * @type Boolean|string
     */
    caption:        false,
    
    /**
     * Mivhak's theme. One of (dark|light)
     * @type String
     */
    theme:          'light',
    
    /**
     * The viewport's height. Either a number (for a custom height in pixels) 
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
};