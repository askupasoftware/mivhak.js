Mivhak.component('dropdown', {
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
});