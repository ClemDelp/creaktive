var activitiesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json){
    /*Init*/
    this.views.main = new this.Views.Main({
      el : json.el,
      model : global.models.currentProject,
      mode : json.mode,
      users : global.Collections.Users,
      notifications : global.collections.Notifications
    });
    this.views.main.render();
  }
};
/***************************************/
activitiesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.users = json.users;
        this.activity_size = 10;
        this.notifications = json.notifications;
        // Templates
        this.template_activityLog = _.template($('#activityLog-template').html());    
    },
    events : {},
    removeView : function(){
      this.remove();
    },
    render : function(){
        $(this.el).empty();
        var table = $('<table>',{style:'width:100%'});
        var nbr = 0;
        var _this = this;
        this.notifications.each(function(notif){console.log(notif.get('attachedTo'))
          if(notif.get('attachedTo') == _this.model.get('id')){
            nbr +=1;
            table.append(_this.template_el({
              user : _this.users.get(notif.get('user')).toJSON(),
              notif : notif.toJSON()
            }));
          }
        });
        $(this.el).append('<div class="large-12 medium-12 small-12 columns"><b>Activity Log ('+nbr+')</b></div>');
        $(this.el).append(table);

        return this;
    }
});
/***************************************/