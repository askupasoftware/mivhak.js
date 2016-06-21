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
        this.mivhakInstance.$selection.find('pre').each(function(){
            $this.tabs.push(Mivhak.render('tab-pane',{pre: this, mivhakInstance: $this.mivhakInstance}));
        });
    },
    methods: {
        showTab: function(index){
            var $this = this;
            $.each(this.tabs, function(i, tab){
                if(index === i) {
                    $this.activeTab = tab;
                    tab.show();
                }
                else tab.hide();
            });
        }
    }
});