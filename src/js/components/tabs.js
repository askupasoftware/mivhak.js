Mivhak.component('tabs', {
    template: '<div class="mivhak-tabs"></div>',
    props: {
        mivhakInstance: null,
        tabs: []
    },
    created: function() {
        var $this = this;
        this.$el = this.mivhakInstance.$selection.find('pre').wrapAll(this.$el).parent();
        this.mivhakInstance.$selection.find('pre').each(function(){
            $this.tabs.push(Mivhak.render('tab-pane',{pre: this, mivhakInstance: $this.mivhakInstance}));
        });
        
        // Show first tab initially
        this.showTab(0);
    },
    methods: {
        showTab: function(index){
            $.each(this.tabs, function(i, tab){
                if(index === i) tab.show();
                else tab.hide();
            });
        }
    }
});