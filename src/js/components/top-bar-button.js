Mivhak.component('top-bar-button', {
    template: '<div class="mivhak-top-bar-button"></div>',
    props: {
        text: null,
        icon: null,
        dropdown: null,
        mivhakInstance: null,
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
        if(this.icon) this.$el.addClass('mivhak-icon mivhak-icon-'+this.icon).append($(Mivhak.icons[this.icon]));
        if(this.dropdown) 
        {
            $this.$el.append(this.dropdown.$el);
            this.onClick = function() {
                $this.toggleActivation();
                $this.dropdown.toggle();
            };
        }
    },
    methods: {
        activate: function() {
            this.$el.addClass('mivhak-button-active');
        },
        deactivate: function() {
            this.$el.removeClass('mivhak-button-active');
        },
        toggleActivation: function() {
            this.$el.toggleClass('mivhak-button-active');
        },
        isActive: function() {
            return this.$el.hasClass('mivhak-button-active');
        }
    }
});