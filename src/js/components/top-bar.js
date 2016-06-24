Mivhak.component('top-bar', {
    template: '<div class="mivhak-top-bar"><div class="mivhak-nav-tabs"></div><div class="mivhak-controls"></div><div class="mivhak-line"></div></div>',
    props: {
        mivhakInstance: null,
        navTabs: [],
        controls: [],
        line: null
    },
    created: function() {
        this.line = this.$el.find('.mivhak-line');
        this.createTabNav();
        if(this.mivhakInstance.options.runnable) this.createPlayButton();
        this.createCogButton();
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
        },
        createTabNav: function() {
            var $this = this;
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
        },
        createPlayButton: function() {
            var playBtn = Mivhak.render('top-bar-button',{
                icon: 'play',
                mivhakInstance: this.mivhakInstance,
                onClick: function() {

                }
            });
            this.controls.push(playBtn);
            this.$el.find('.mivhak-controls').append(playBtn.$el);
        },
        createCogButton: function() {
            var cogBtn = Mivhak.render('top-bar-button',{
                icon: 'cog',
                mivhakInstance: this.mivhakInstance,
                dropdown: Mivhak.render('dropdown',{
                    mivhakInstance: this.mivhakInstance,
                    items: this.mivhakInstance.options.buttons
                })
            });
            this.controls.push(cogBtn);
            this.$el.find('.mivhak-controls').append(cogBtn.$el);
        }
    }
});