Mivhak.component('tab-pane', {
    template: '<div class="mivhak-tab-pane"><div class="mivhak-tab-pane-inner"></div></div>',
    props: {
        resource:       null,
        editor:         null,
        index:          null,
        padding:        10,
        mivhakInstance: null
    },
    created: function() {
        this.setEditor();
        this.fetchRemoteSource();
        this.markLines();
        
        this.$el = $(this.resource.pre).wrap(this.$el).parent().parent();
        this.$el.find('.mivhak-tab-pane-inner').css({margin: this.mivhakInstance.options.padding});
        this.setScrollbars();
    },
    methods: {
        getTheme: function() {
            return this.mivhakInstance.options.theme === 'light' ? 'clouds' : 'ambiance';
        },
        fetchRemoteSource: function() {
            var $this = this;
            if(this.resource.source) {
                $.ajax(this.resource.source).done(function(res){
                    $this.editor.setValue(res,-1);
                    
                    // Refresh viewport height
                    $this.mivhakInstance.callMethod('setHeight',$this.mivhakInstance.options.height);
                    
                    // Refresh scrollbars
                    raf(function(){
                        $this.vscroll.refresh();
                        $this.hscroll.refresh();
                    });
                });
                
            }
        },
        setScrollbars: function() {
            var $inner = $(this.resource.pre),
                $outer = this.$el.find('.mivhak-tab-pane-inner');
            
            this.vscroll = Mivhak.render('vertical-scrollbar',{editor: this.editor, $inner: $inner, $outer: $outer, mivhakInstance: this.mivhakInstance});
            this.hscroll = Mivhak.render('horizontal-scrollbar',{editor: this.editor, $inner: $inner, $outer: $outer, mivhakInstance: this.mivhakInstance});
            
            this.$el.append(this.vscroll.$el, this.hscroll.$el);
        },
        show: function() {
            this.$el.addClass('mivhak-tab-pane-active');
            this.editor.focus();
            this.editor.gotoLine(0); // Needed in order to get focus
            
            // Recalculate scrollbar positions based on the now visible element
            this.vscroll.initialize();
            this.hscroll.initialize();
        },
        hide: function() {
            this.$el.removeClass('mivhak-tab-pane-active');
        },
        setEditor: function() {
            
            // Remove redundant space from code
            this.resource.pre.textContent = this.resource.pre.textContent.trim(); 
            
            // Set editor options
            this.editor = ace.edit(this.resource.pre);
            this.editor.setReadOnly(!this.mivhakInstance.options.editable);
            this.editor.setTheme("ace/theme/"+this.getTheme());
            this.editor.setShowPrintMargin(false);
            this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
            this.editor.getSession().setMode("ace/mode/"+this.resource.lang);
            this.editor.getSession().setUseWorker(false); // Disable syntax checking
            this.editor.getSession().setUseWrapMode(true); // Set initial line wrapping

            this.editor.setOptions({
                maxLines: Infinity,
                firstLineNumber: this.resource.startLine,
                highlightActiveLine: false,
                fontSize: parseInt(14)
            });
            
            // Update source content for the live preview
            if(this.mivhakInstance.options.editable)
            {
                this.editor.getSession().on('change', (function() {
                    this.mivhakInstance.resources.update(this.index, this.editor.getValue());
                }).bind(this));
            }
            
            // Move view to show cursor position when the cursor moves
            this.editor.session.selection.on("changeCursor", (function(e){
                e.preventDefault();
                raf((function(){
                    var cursor = this.$el.find('.ace_cursor')[0].getBoundingClientRect(),
                        viewport = this.$el.find('.mivhak-tab-pane-inner')[0].getBoundingClientRect(),
                        up =  viewport.top - cursor.top,
                        down = cursor.top + cursor.height - viewport.top - viewport.height,
                        left = parseInt(this.$el.find('.ace_content').css('margin-left').replace('px',''));

                    // Move the scrollbar vertically only if the cursor leaves the viewport
                    this.vscroll.doScroll('up',Math.max(0, up)); //
                    this.vscroll.doScroll('down',Math.max(0, down));
                    this.vscroll.moveBar();
                    
                    // Ace Editor automatically moves the viewport, so we just need to move the scrollbar accordingly
                    this.hscroll.state.l = -left;
                    this.hscroll.moveBar();
                }).bind(this));
            }).bind(this));
        },
        markLines: function()
        {
            if(!this.resource.mark) return;
            var ranges = strToRange(this.resource.mark),
                i = ranges.length,
                AceRange = ace.require("ace/range").Range;

            while(i--)
            {
                this.editor.session.addMarker(
                    new AceRange(ranges[i].start, 0, ranges[i].end, 1), // Define the range of the marker
                    "ace_active-line",     // Set the CSS class for the marker
                    "fullLine"             // Marker type
                );
            }
        }
    }
});