Mivhak.component('tab-pane', {
    template: '<div class="mivhak-tab-pane"><div class="mivhak-tab-pane-inner"></div></div>',
    props: {
        pre: null,
        editor: null,
        padding: 10,
        mivhakInstance: null
    },
    created: function() {
        this.setOptions();
        this.setEditor();
        
        this.$el = $(this.pre).wrap(this.$el).parent().parent();
        this.$el.find('.mivhak-tab-pane-inner').css({margin: this.mivhakInstance.options.padding});
        this.setScrollbars();
    },
    methods: {
        getTheme: function() {
            return this.mivhakInstance.options.theme === 'light' ? 'clouds' : 'ambiance';
        },
        setOptions: function() {
            var $this = this;
            $.each(readAttributes(this.pre), function(name, value){
                $this[name] = value;
            });
        },
        setScrollbars: function() {
            var $inner = $(this.pre),
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
            this.pre.textContent = this.pre.textContent.trim(); 
            
            // Set editor options
            this.editor = ace.edit(this.pre);
            this.editor.setReadOnly(!this.mivhakInstance.options.editable);
            this.editor.setTheme("ace/theme/"+this.getTheme());
            this.editor.setShowPrintMargin(false);
            this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
            this.editor.getSession().setMode("ace/mode/"+this.lang);
            this.editor.getSession().setUseWorker(false); // Disable syntax checking
            this.editor.getSession().setUseWrapMode(true); // Set initial line wrapping

            this.editor.setOptions({
                maxLines: Infinity,
                firstLineNumber: 1,
                highlightActiveLine: false,
                fontSize: parseInt(14)
            });
        }
    }
});