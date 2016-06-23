Mivhak.component('notifier', {
    template: '<div class="mivhak-notifier"></div>',
    methods: {
        notification: function(html) {
            if(!html) return;
            clearTimeout(this.timeout);
            this.$el.off('click');
            this.$el.html(html);
            this.$el.addClass('mivhak-visible');
        },
        timedNotification: function(html, timeout) {
            var $this = this;
            this.notification(html);
            this.timeout = setTimeout(function(){
                $this.hide();
            },timeout);
        },
        closableNotification: function(html, onclick)
        {
            var $this = this;
            this.notification(html);
            this.$el.addClass('mivhak-button');
            this.$el.click(function(e){
                $this.hide();
                if(typeof onclick !== 'undefined')
                    onclick.call(null, e);
            });
        },
        hide: function() {
            this.$el.removeClass('mivhak-visible mivhak-button');
        }
    }
});