/////////////////////////////////////////////////
var topbar = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator : global.eventAggregator,
  init: function (json) {
    /*Init*/
    this.views.main = new this.Views.Main({
      el : json.el,
      user : global.models.current_user,
      notifications : global.collections.Notifications
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user          = json.user;
        this.Notifications = json.notifications;
        // Templates
        this.template = _.template($('#topbar-template').html());
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({user:this.user.toJSON()}));
        workspacesList.init({el:"#workspaces_dropdown",display:"list"});
        return this;
    }
});
/***************************************/

