Mivhak.component('vertical-scrollbar', {
    template: '<div class="mivhak-scrollbar mivhak-v-scrollbar"><div class="mivhak-scrollbar-thumb"></div></div>',
    props: {
        editor: null,
        $inner: null,
        $outer: null,
        mivhakInstance: null,
        minHeight: 50,
        state: {
            a: 0,    // The total height of the editor
            b: 0,    // The height of the viewport, excluding padding
            c: 0,    // The height of the viewport, including padding
            d: 0,    // The calculated thumb height
            t: 0     // The current top offset of the viewport
        },
        initialized: false
    },
    methods: {
        initialize: function() {
            if(!this.initialized)
            {
                this.initialized = true;
                this.dragDealer();
                var $this = this;
                this.$inner.on('mousewheel', function(e){$this.onScroll.call(this, e);});
                $(window).resize(function(){
                    if($this.mivhakInstance.state.lineWrap)
                        $this.refresh();
                });
            }
            // Refresh anytime initialize is called
            this.refresh();
        },
        updateState: function() {
            var oldState = $.extend({}, this.state);
            this.state.a = getEditorHeight(this.$inner);
            this.state.b = this.mivhakInstance.state.height;
            this.state.c = this.mivhakInstance.state.height-this.mivhakInstance.options.padding*2;
            this.state.d = Math.max(this.state.c*this.state.b/this.state.a,this.minHeight);
            this.state.t *=  this.state.a/Math.max(oldState.a,1); // Math.max used to prevent division by zero
            return this.state.a !== oldState.a || this.state.b !== oldState.b;
        },
        refresh: function() {
            var $this = this, oldTop = this.state.t;
            raf(function(){
                if($this.updateState())
                {
                    if($this.getDifference() > 0)
                    {
                        $this.doScroll('up',oldTop-$this.state.t);
                        $this.$el.css({height: $this.state.d + 'px', top: 0});
                        $this.moveBar();
                    }
                    else 
                    {
                        $this.doScroll('up',$this.state.t);
                        $this.$el.css({height: 0});
                    }
                }
            });
        },
        onScroll: function(e) {
            var didScroll;
            
            if(e.deltaY > 0)
                didScroll = this.doScroll('up',e.deltaY*e.deltaFactor);
            else
                didScroll = this.doScroll('down',-e.deltaY*e.deltaFactor);
            
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
                    didScroll = $this.doScroll(delta > 0 ? 'down' : 'up', Math.abs(delta*getEditorHeight($this.$inner)/$this.$outer.parent().height()));
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
                top:  (this.state.b-this.state.d)/(this.state.a-this.state.c)*this.state.t + 'px'
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
        }
    }
});