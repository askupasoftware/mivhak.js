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
};