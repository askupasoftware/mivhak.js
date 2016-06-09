Mivhak.component('dropdown', {
    template: '<div class="mivhak-dropdown"></div>',
    props: {
        items: [],
        visible: false
    },
    created: function() {
        var $this = this;
        $.each(this.items, function(i, item) {
            if( typeof item === 'string') item = dropdownButtons[item];
            var button = $('<div>',{class: 'mivhak-dropdown-button', text: item.text, click: item.click});
            if(item.toggle) 
            {
                button.$toggle = Mivhak.render('toggle');
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
            console.log(this);
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