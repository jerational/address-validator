/**
 * Created by jerational on 2/14/15.
 */
$(function() {
    var Address = Backbone.Model.extend({
        defaults: {
            addressLine1:"",
            addressLine2:"",
            addressLine3:"",
            city:"",
            region:"",
            countryCode:"",
            postalCode:""
        },
        check: function(callback) {
            $.post('/validate', this.attributes, callback);
        }
    });

    var FormView = Backbone.View.extend({
        template: _.template($('#form-template').html()),
        events: {
            'submit': 'onFormSubmit'
        },

        initialize: function() {
            this.address = new Address();
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        onFormSubmit: function(e) {
            e.preventDefault();
            $(".alert").remove();

            var address = this.address;

            this.$el.find('input[type=text]').each(function() {
                address.set(this.name, this.value);
            });

            this.address.check(function(data) {
                console.log(data);
                this.$el.prepend(data);
            }.bind(this))
        }
    });

    var AppView = Backbone.View.extend({
        el: 'body',

        initialize: function() {
            var formView = new FormView();
            this.$el.append(formView.render().el);
        }
    });

    var App = new AppView();
});