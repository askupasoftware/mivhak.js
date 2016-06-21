Mivhak.component('notifier', {
    template: '<div class="mivhak-notifier"></div>',
    methods: {
        notify: function(html, timeout) {
            if(!html) return;
            clearTimeout(this.timeout);
            this.$el.html(html);
            this.$el.addClass('mivhak-visible');
            if(typeof timeout !== 'undefined')
            {
                var $this = this;
                this.timeout = setTimeout(function(){
                    $this.hide();
                },timeout);
            }
        },
        hide: function() {
            this.$el.removeClass('mivhak-visible');
        }
    }
});