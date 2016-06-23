Mivhak.component('horizontal-scrollbar', {
    template: '<div class="mivhak-scrollbar mivhak-h-scrollbar"><div class="mivhak-scrollbar-thumb"></div></div>',
    props: {
        editor: null,
        $inner: null,
        $outer: null,
        mivhakInstance: null,
        state: {
            a: 0,    // The total width of the editor
            b: 0,    // The width of the viewport, excluding padding
            c: 0,    // The width of the viewport, including padding
            l: 0     // The current left offset of the viewport
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
                $(window).resize(function(){$this.refresh();});
            }
            this.refresh();
        },
        updateState: function() {
            var oldState = $.extend({}, this.state);
            this.state.a = this.getEditorWidth();
            this.state.b = this.$outer.parent().width();
            this.state.c = this.$outer.width();
            this.state.l *=  this.state.a/Math.max(oldState.a,1); // Math.max used to prevent division by zero
            return this.state.a !== oldState.a || this.state.b !== oldState.b;
        },
        refresh: function() {
            var $this = this, oldLeft = this.state.l;
            raf(function(){
                if($this.updateState())
                {
                    if($this.getDifference() > 0)
                    {
                        $this.doScroll('left',oldLeft-$this.state.l);
                        var s = $this.state;
                        $this.$el.css({width: s.c*s.b/s.a + 'px', left: 0});
                        $this.moveBar();
                    }
                    else $this.$el.css({width: 0});
                }
            });
        },
        dragDealer: function(){
            var $this = this,
                lastPageX;

            this.$el.on('mousedown.drag', function(e) {
                lastPageX = e.pageX;
                $this.$el.add(document.body).addClass('mivhak-scrollbar-grabbed');
                $(document).on('mousemove.drag', drag).on('mouseup.drag', stop);
                return false;
            });

            function drag(e){
                var delta = e.pageX - lastPageX,
                    didScroll;

                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageX = e.pageX;
                
                raf(function(){
                    didScroll = $this.doScroll(delta > 0 ? 'right' : 'left', Math.abs(delta*$this.getEditorWidth()/$this.$outer.parent().width()));
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
                left:  (this.state.l/this.state.a)*this.state.b + 'px'
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
            
            if('left' === dir) 
            {
                remaining = s.l;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.l -= didScroll;
            }
            if('right' === dir) 
            {
                remaining = this.getDifference() - s.l;
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                s.l += didScroll;
            }
            
            this.$inner.find('.ace_content').css({'margin-left': -s.l});
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
         * Calculate the editor's width based on the number of lines
         */
        getEditorWidth: function() {
            return this.$inner.find('.ace_content').width();
        }
    }
});