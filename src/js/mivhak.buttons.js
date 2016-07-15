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
     * The collapse button toggles the entire code block into and out of its
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
            this.notifier.dismissibleNotification('Mivhak.js v1.0.0 | <a href="http://products.askupasoftware.com/mivhak-js/">Official Page</a>');
        }
    }
};