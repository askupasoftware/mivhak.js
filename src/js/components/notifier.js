Mivhak.component('notifier', {
    template: '<div class="mivhak-notifier"></div>',
    methods: {
        /**
         * Internally used to show a notification
         * @param {String} html
         */
        notification: function(html) {
            if(!html) return;
            clearTimeout(this.timeout);
            this.$el.html(html);
            this.$el.addClass('mivhak-visible');
        },
        
        /**
         * Show a notification that will be automatically dismissed after the 
         * given timeout has passed
         * 
         * @param {String} html
         * @param {Number} timeout
         */
        timedNotification: function(html, timeout) {
            var $this = this;
            this.notification(html);
            this.timeout = setTimeout(function(){
                $this.hide();
            },timeout);
        },
        
        /**
         * Show a notification that can be dismissed by clicking on the X button
         * @param {String} html
         * @param {Function} onclick
         */
        dismissibleNotification: function(html, onclick)
        {
            var $this = this,
                $times = $('<div>',{class:'mivhak-times',html:'&#215;'}).click(function(){$this.hide();});
            this.notification(html);
            this.$el.append($times).addClass('mivhak-dismissible').click(function(e){
                if(typeof onclick !== 'undefined')
                    onclick.call(null, e);
            });
        },
        
        /**
         * Show a notification that will execute a callback once clicked
         * @param {String} html
         * @param {Function} onclick
         */
        callbackNotification: function(html, onclick)
        {
            var $this = this;
            this.notification(html);
            this.$el.addClass('mivhak-button').click(function(e){
                if(typeof onclick !== 'undefined')
                    onclick.call($this, e);
            });
        },
        
        hide: function() {
            this.$el.removeClass('mivhak-visible mivhak-button mivhak-dismissible');
            this.$el.off('click');
        }
    }
});