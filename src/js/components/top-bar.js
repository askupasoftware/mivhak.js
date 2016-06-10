Mivhak.component('top-bar', {
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
});