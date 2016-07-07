Mivhak.component('live-preview', {
    template: '<iframe class="mivhak-live-preview" allowtransparency="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" frameborder="0"></iframe>',
    props: {
        resources: []
    },
    methods: {
        renderHTML: function() {
            var html = '<html>',
                head = '<head>',
                body = '<body>';
            
            head += '<meta http-equiv="content-type" content="text/html; charset=UTF-8">';
            head += '<meta name="robots" content="noindex, nofollow">';
            head += '<meta name="googlebot" content="noindex, nofollow">';
            
            for(var i = 0; i < this.resources.count(); i++)
            {
                var source = this.resources.get(i);
                if('markup' === source.runAs) body += source.content;
                if('style' === source.runAs) head += this.createStyle(source.content, source.visible ? false : source.source);
                if('script' === source.runAs) head += this.createScript(source.content, source.visible ? false : source.source);
            }
            
            html += head+'</head>'+body+'</body></html>';
            
            return html;
        },
        createScript: function(content,src) {
            if(src) return '<script src="'+src+'" type="text/javascript"></script>';
            return '<script>\n//<![CDATA[\nwindow.onload = function(){'+content+'};//]]>\n</script>'; // @see http://stackoverflow.com/questions/66837/when-is-a-cdata-section-necessary-within-a-script-tag
        },
        createStyle: function(content,href) {
            if(href) return '<link href="'+href+'" rel="stylesheet">';
            return '<style>'+content+'</style>';
        },
        show: function() {
            this.$el.addClass('mivhak-active');
            this.run();
        },
        hide: function() {
            this.$el.removeClass('mivhak-active');
        },
        run: function() {
            var contents = this.$el.contents(),
                doc = contents[0];
        
            doc.open();
            doc.writeln(this.renderHTML());
            doc.close();
        }
    }
});