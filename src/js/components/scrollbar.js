Mivhak.component('scrollbar', {
    template: '<div class="mivhak-scrollbar"></div>',
    props: {
        orientation: null,
        $inner: null,
        $outer: null,
        innerTop: 0,
        padding: 10
    },
    created: function() {
        var $this = this;
        
        this.$el.addClass('mivhak-'+this.orientation+'-scrollbar');
        this.dragDealer();
        if('v' === $this.orientation)
            this.$inner.on('DOMMouseScroll mousewheel',function(e){$this.onScroll.call(this, e);});
    },
    methods: {
        onScroll: function(e) {
            e.preventDefault();
            var didScroll;

            if(e.originalEvent.wheelDelta > 0)
                didScroll = this.doScroll('up',20);
            else
                didScroll = this.doScroll('down',20);
            
            if(0 !== didScroll) this.moveBar();
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
                    diff = $this.$inner.height() - $this.$outer.height(),
                    remaining,
                    move;
            
                // Bail if the mouse hasn't moved
                if(!delta) return;
            
                lastPageY = e.pageY;
                remaining = delta > 0 ? diff - (-$this.innerTop) : (-$this.innerTop) ;
                move = remaining > 0 ? Math.min(remaining, Math.abs(delta)) : 0;
                
                raf(function(){
                    $this.innerTop += (delta > 0 ? -move : move);
                    $this.$inner.css({top: $this.innerTop});
                    $this.moveBar();
                });
            }

            function stop() {
                $this.$el.add(document.body).removeClass('mivhak-scrollbar-grabbed');
                $(document).off("mousemove.drag mouseup.drag");
            }
        },
        moveBar: function() {
            this.$el.css({
                top: (-this.innerTop) + this.padding + 'px'
            });
        },
        setPosition: function() {
            if('v' === this.orientation)
                this.$el.css({height: this.getRatio() * 100 + '%', top: this.padding});
            else this.$el.css({width: this.getRatio() * 100 + '%', left: this.padding});
        },
        getRatio: function() {
            if('v' === this.orientation)
                return (this.$outer.height() - this.padding*2 - 5) / this.$inner.outerHeight();
            return (this.$outer.width() - this.padding*2 - 5) / this.$inner.outerWidth();
        },
        doScroll: function(dir, delta) {
            var diff = this.$inner.height() - this.$outer.height(),
                remaining,
                didScroll;
            
            if('up' === dir) 
            {
                remaining = (-this.innerTop);
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                this.innerTop += didScroll;
            }
            if('down' === dir) 
            {
                remaining = diff - (-this.innerTop);
                didScroll = remaining > 0 ? Math.min(remaining,delta) : 0;
                this.innerTop -= didScroll;
            }
            
            this.$inner.css({top: this.innerTop});
            return didScroll;
        }
    }
});