Mivhak.component('caption', {
    template: '<div class="mivhak-caption"></div>',
    props: {
        text: null
    },
    created: function() {
        this.setText(this.text);
    },
    methods: {
        setText: function(text) {
            this.$el.html(text);
        }
    }
});