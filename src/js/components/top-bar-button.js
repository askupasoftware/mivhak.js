Mivhak.component('top-bar-button', {
    template: '<div class="mivhak-top-bar-button"></div>',
    props: {
        text: null,
        icon: null,
        dropdown: null,
        onClick: function(){}
    },
    events: {
        click: function() {
            this.onClick();
        }
    },
    created: function() {
        var $this = this;
        this.$el.text(this.text);
        if(this.icon) this.$el.addClass('mivhak-icon').append($(Mivhak.icons[this.icon]));
        if(this.dropdown) 
        {
            $this.$el.append(this.dropdown.$el);
            this.onClick = function() {
                $this.dropdown.toggle();
            };
        }
    }
});