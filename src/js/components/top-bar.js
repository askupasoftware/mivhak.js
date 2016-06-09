Mivhak.component('top-bar', {
    template: '<div class="mivhak-top-bar"><div class="mivhak-nav-tabs"></div><div class="mivhak-controls"></div></div>',
    props: {
        mivhakInstance: null,
        navTabs: [],
        controls: []
    },
    created: function() {
        var $this = this;
        
        // Create tab navigation
        $.each(this.mivhakInstance.tabs.tabs, function(i,tab){
            var button = Mivhak.render('top-bar-button',{
                text: tab.lang,
                onClick: function() {
                    $this.mivhakInstance.tabs.showTab(i);
                    $.each($this.navTabs, function(i,navTab){navTab.deactivate();});
                    this.activate();
                }
            });
            $this.navTabs.push(button);
            $this.$el.find('.mivhak-nav-tabs').append(button.$el);
        });
        
        // Create buttons on right
        $this.controls.push(Mivhak.render('top-bar-button',{
            icon: 'play',
            onClick: function() {
                
            }
        }));
        
        $this.controls.push(Mivhak.render('top-bar-button',{
            icon: 'cog',
            dropdown: Mivhak.render('dropdown',{
                items: this.mivhakInstance.options.buttons
            })
        }));
        
        $this.$el.find('.mivhak-controls').append(
            $this.controls[0].$el,
            $this.controls[1].$el
        );
    }
});