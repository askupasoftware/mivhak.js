Mivhak.component('caption', {
    template: '<div class="mivhak-caption"></div>',
    props: {
        text: null
    },
    created: function() {
        this.$el.html(this.text);
    }
});