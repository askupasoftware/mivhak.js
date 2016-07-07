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
        $.each(this.mivhakInstance.resources.data,function(i, resource){
            if(resource.visible)
                $this.tabs.push(Mivhak.render('tab-pane',{
                    resource: resource,
                    index: i,
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