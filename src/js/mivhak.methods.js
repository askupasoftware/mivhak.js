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
            tab.vscroll.onHeightChange();
            tab.hscroll.onWidthChange();
        });
    },
    copyCode: function() {
        var editor = this.activeTab.editor;
        editor.selection.selectAll();
        editor.focus();
        if(document.execCommand('copy'))
            editor.selection.clearSelection();
        else this.notifier.timedNotification('Press &#8984;+C to copy the code', 2000);
    },
    collapse: function() {
        var $this = this;
        this.notifier.closableNotification('Show Code', function(){$this.callMethod('expand');});
        this.$selection.addClass('mivhak-collapsed');
        this.callMethod('setHeight',this.notifier.$el.outerHeight(true));
    },
    expand: function() {
        this.notifier.hide(); // In case it's called by an external script
        this.$selection.removeClass('mivhak-collapsed');
        this.callMethod('setHeight',this.calculateHeight());
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
            tab.vscroll.onHeightChange();
        });
    },
    update: function(options) {
        // Update options here
    }
};