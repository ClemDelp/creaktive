/***************************************/
var actualitiesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/***************************************/
actualitiesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.notifications = json.notifications;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.notifications.bind("add",this.render);
        this.notifications.bind("remove",this.render);
        this.notifications.bind("change",this.render);
        // Templates
        this.template = _.template($('#actualitiesList-template').html());     
    },
    events : {},
    render : function(){
        // Init
        $(this.el).html('');
        // Poche list
        $(this.el).append(this.template({notifications : this.notifications.toJSON()}));
        
        return this;
    }
});
/***************************************/