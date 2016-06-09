Mivhak.component('tab-pane', {
    template: '<div class="mivhak-tab-pane"></div>',
    props: {
        pre: null,
        editor: null,
        mivhakInstance: null
    },
    created: function() {
        
        this.setOptions();
        
        this.pre.innerText = this.pre.innerText.trim(); // Remove redundant space from code
        
        this.editor = ace.edit(this.pre);
        this.editor.setReadOnly(!this.mivhakInstance.options.editable);
        this.editor.setTheme("ace/theme/"+this.getTheme());
        this.editor.setShowPrintMargin(false);
        this.editor.renderer.setShowGutter(this.mivhakInstance.options.lineNumbers);
        this.editor.getSession().setMode("ace/mode/"+this.lang);
        this.editor.getSession().setUseWorker(false); // Disable syntax checking
        this.editor.getSession().setUseWrapMode(this.mivhakInstance.state.lineWrap); // Set initial line wrapping
        
        this.editor.setOptions({
            maxLines: Infinity,
            firstLineNumber: 1,
            highlightActiveLine: false,
            fontSize: parseInt(14)
        });
        
        this.$el = $(this.pre).wrap(this.$el).parent();
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
        },
        hide: function() {
            this.$el.removeClass('mivhak-tab-pane-active');
        }
    }
});