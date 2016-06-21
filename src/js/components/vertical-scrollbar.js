Mivhak.component('vertical-scrollbar', {
    template: '<div class="mivhak-scrollbar mivhak-v-scrollbar"><div class="mivhak-scrollbar-thumb"></div></div>',
    props: {
        editor: null,
        $inner: null,
        $outer: null,
        state: {
            a: null,    // The total height of the editor
            b: null,    // The height of the viewport, excluding padding
            c: null,    // The height of the viewport, including padding
            t: null     // The current top offset of the viewport
        },
        initialized: false
    },
    methods: {
        initialize: function() {
            
            if(!this.initialized)
            {
                this.initialized = true;
                
                // Update state
                this.state.a = this.getEditorHeight();
                this.state.b = this.$outer.parent().height();
                this.state.c = this.$outer.height();
                this.state.t = 0;
                

                if(this.getDifference() > 0)
                {
                    var $this = this;

                    this.dragDealer();
                    this.$inner.on('mousewheel', function(e){$this.onScroll.call(this, e);});

                    this.stateUpdated();
                }
            }
        },
        stateUpdated: function() {
            var s = this.state;
            this.$el.css({height: s.c*s.b/s.a + 'px', top: 0});
            this.moveBar();
        },
        onHeightChange: function() {
            var height = this.getEditorHeight(),
                prevTop = this.state.t;
            this.state.t *=  height/this.state.a;
            this.doScroll('up',prevTop-this.state.t);
            this.state.a = height;
            this.stateUpdated();
        },
        onScroll: function(e) {
            var didScroll;
            
            if(e.deltaY > 0)
                didScroll = this.doScroll('up',e.deltaY);
            else
                didScroll = this.doScroll('down',-e.deltaY);
            
            if(0 !== didScroll) {
                this.moveBar();
                e.preventDefault(); // Only prevent page scroll if the editor can be scrolled
            }
        },
        dragDealer: function(){
            var $this = this,
                lastPageY;

            this.$el.on('mousedown.drag', function(e) {
                lastPageY = e.pageY;
                $this.$el.add(document.body).addClass('mivhak-scrollbar-grabbed');
                $(document).on('mousemove.drag', drag).on('mouseup.drag', stop);
                return false;
            });

            function drag(e){
                var delta = e.pageY - lastPageY,
                    didScroll;
            
                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageY = e.pageY;
                
                raf(function(){
                    didScroll = $this.doScroll(delta > 0 ? 'down' : 'up', Math.abs(delta*$this.getEditorHeight()/$this.$outer.parent().height()));
                    if(0 !== didScroll) $this.moveBar();
                });
            }

            function stop() {
                $this.$el.add(document.body).removeClass('mivhak-scrollbar-grabbed');
                $(document).off("mousemove.drag mouseup.drag");
            }
        },
        moveBar: function() {
            this.$el.css({
                top:  (this.state.t/this.state.a)*this.state.b + 'px'
            });
        },
        
        /**
         * Scrolls the editor element in the direction given, provided that there 
         * is remaining scroll space
         * @param {string} dir
         * @param {int} delta
         */
        doScroll: function(dir, delta) {
            var s = this.state,
                remaining,
                didScroll;
            
            if('up' === dir) 
            {
                remaining = s.t;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.t -= didScroll;
            }
            if('down' === dir) 
            {
                remaining = this.getDifference() - s.t;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.t += didScroll;
            }
            
            this.$inner.css({top: -s.t});
            return didScroll;
        },
        
        /**
         * Returns the difference between the containing div and the editor div
         */
        getDifference: function()
        {
            return this.state.a - this.state.c;
        },
        
        /**
         * Calculate the editor's height based on the number of lines
         */
        getEditorHeight: function() {
            var height = 0;
            this.$inner.find('.ace_text-layer').children().each(function(){
                height += $(this).height();
            });
            return height;
        }
    }
});