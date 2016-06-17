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
        this.vscroll = Mivhak.render('scrollbar',{orientation: 'v',$inner: $(this.pre), $outer: this.$el.find('.mivhak-tab-pane-inner')});
        this.hscroll = Mivhak.render('scrollbar',{orientation: 'h',$inner: $(this.pre), $outer: this.$el.find('.mivhak-tab-pane-inner')});
        this.$el.append(this.vscroll.$el, this.hscroll.$el);
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
        show: function() {
            this.$el.addClass('mivhak-tab-pane-active');
            this.editor.focus();
            this.editor.gotoLine(0); // Needed in order to get focus
            
            // Recalculate scrollbar positions based on the now visible element
            this.vscroll.setPosition();
            this.hscroll.setPosition();
        },
        hide: function() {
            this.$el.removeClass('mivhak-tab-pane-active');
        },
        setEditor: function() {
            
            // Remove redundant space from code
            this.pre.innerText = this.pre.innerText.trim(); 
            
            // Set editor options
            this.editor = ace.edit(this.pre);
            this.editor.setReadOnly(!this.mivhakInstance.options.editable);
            this.editor.setTheme("ace/theme/"+this.getTheme());
            this.editor.setShowPrintMargin(false);
            this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
            this.editor.getSession().setMode("ace/mode/"+this.lang);
            this.editor.getSession().setUseWorker(false); // Disable syntax checking
            this.editor.getSession().setUseWrapMode(false); // Set initial line wrapping

            this.editor.setOptions({
                maxLines: Infinity,
                firstLineNumber: 1,
                highlightActiveLine: false,
                fontSize: parseInt(14)
            });
        }
    }
});