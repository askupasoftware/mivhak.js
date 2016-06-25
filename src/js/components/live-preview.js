Mivhak.component('live-preview', {
    template: '<iframe class="mivhak-live-preview" allowtransparency="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" frameborder="0"></iframe>',
    props: {
        sources: []
    },
    created: function() {
        var $this = this, i;
        this.$el.ready(function(){
            $this.insertSources($this.$el.contents());
        });
    },
    methods: {
        insertSources: function($content) {
            var $head = $content.find('head'),
                $body = $content.find('body');
        
            $head.append($('<meta http-equiv="content-type" content="text/html; charset=UTF-8">'));
            $head.append($('<meta name="robots" content="noindex, nofollow">'));
            $head.append($('<meta name="googlebot" content="noindex, nofollow">'));
        
            for(var i = 0; i < this.sources.length; i++)
            {
                var source = this.sources[i];
                if('markup' === source.runAs) $body.html(source.content);
                if('style' === source.runAs) $head.append(this.createStyle(source.content, source.visible ? false : source.source));
            }
        },
        createScript: function(content,src) {
            if(src) return $('<script>',{src: src, type: 'text/javascript'});
            return $('<script>',{html: '//<![CDATA[\n$(window).load(function(){'+content+'});//]]>\n'}); // @see http://stackoverflow.com/questions/66837/when-is-a-cdata-section-necessary-within-a-script-tag
        },
        createStyle: function(content,href) {
            if(href) return $('<link>',{href: href, rel: 'stylesheet'});
            return $('<style>',{html: content});
        },
        show: function() {
            this.$el.addClass('mivhak-active');
            this.run();
        },
        hide: function() {
            this.$el.removeClass('mivhak-active');
        },
        run: function() {
            var $contents = this.$el.contents(),
                $head = $contents.find('head'),
                $scripts = $contents.find('script');
            
            $scripts.remove();
            for(var i = 0; i < this.sources.length; i++)
            {
                var source = this.sources[i];
                if('script' === source.runAs) 
                    $head.append(this.createScript(source.content, source.visible ? false : source.source));
            }
        }
    }
});