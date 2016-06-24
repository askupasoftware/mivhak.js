Mivhak.component('tabs', {
    template: '<div class="mivhak-tabs"></div>',
    props: {
        mivhakInstance: null,
        activeTab: null,
        tabs: []
    },
    created: function() {
        var $this = this;
        this.$el = this.mivhakInstance.$selection.find('pre').wrapAll(this.$el).parent();
        $.each(this.mivhakInstance.state.sources,function(i, source){
            if(source.visible)
                $this.tabs.push(Mivhak.render('tab-pane',{
                    pre: source.pre, 
                    lang: source.lang,
                    mivhakInstance: $this.mivhakInstance
                }));
        });
    },
    methods: {
        showTab: function(index){
            var $this = this;
            $.each(this.tabs, function(i, tab){
                if(index === i) {
                    $this.mivhakInstance.activeTab = tab;
                    tab.show();
                }
                else tab.hide();
            });
        }
    }
});