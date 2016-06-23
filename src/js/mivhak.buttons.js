// Built-in buttons
Mivhak.buttons = {
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
            this.callMethod('copyCode');
        }
    },
    collapse: {
        text: 'Colllapse',
        click: function(e) {
            this.callMethod('collapse');
        }
    },
    about: {
        text: 'About Mivhak',
        click: function(e) {
            var $this = this;
            this.notifier.closableNotification('Mivhak.js v1.0.0');
        }
    }
};