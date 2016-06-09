Mivhak.component('toggle', {
    template: '<div class="mivhak-toggle"><div class="mivhak-toggle-knob"></div></div>',
    props: {
        on: true
    },
    events: {
        click: function() {
            this.toggle();
        }
    },
    created: function() {
        this.$el.addClass('mivhak-toggle-'+(this.on?'on':'off'));
    },
    methods: {
        toggle: function() {
            this.on = !this.on;
            this.$el.toggleClass('mivhak-toggle-on').toggleClass('mivhak-toggle-off');
        }
    }
});