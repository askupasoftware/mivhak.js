/**
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
};