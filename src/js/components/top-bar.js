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
            this.moveLine(button.$el);
        },
        moveLine: function($el) {
            if(typeof $el === 'undefined') {
                this.line.removeClass('mivhak-visible');
                return;
            }
            this.line.width($el.width());
            this.line.css({left:$el.position().left + ($el.outerWidth() - $el.width())/2});
            this.line.addClass('mivhak-visible');
        },
        createTabNav: function() {
            var source, i, pos = 0;
            for(i = 0; i < this.mivhakInstance.state.sources.length; i++)
            {
                source = this.mivhakInstance.state.sources[i];
                if(source.visible) this.createNavTabButton(pos++, source.lang);
            }
        },
        createNavTabButton: function(i, lang) {
            var $this = this,
                button = Mivhak.render('top-bar-button',{
                text: lang,
                onClick: function() {
                    $this.mivhakInstance.callMethod('showTab',i);
                    if($this.mivhakInstance.options.runnable)
                        $this.mivhakInstance.preview.hide();
                }
            });
            this.navTabs.push(button);
            this.$el.find('.mivhak-nav-tabs').append(button.$el);
        },
        createPlayButton: function() {
            var $this = this;
            var playBtn = Mivhak.render('top-bar-button',{
                icon: 'play',
                onClick: function() {
                    $this.mivhakInstance.preview.show();
                    $this.moveLine();
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