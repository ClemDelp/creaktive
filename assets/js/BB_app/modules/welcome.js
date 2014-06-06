/////////////////////////////////////////////////
var welcome = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.Main = new this.Views.Main({
      allNews_notifs  : global.AllNewsNotificationsDictionary, // Le dictionnaire de toutes les nouvelles notifications
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    });
    this.views.Main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
welcome.Views.Main = Backbone.View.extend({
    el : "#welcome_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.allNews_notifs    = json.allNews_notifs;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.eventAggregator.on('AllNewsNotificationsDictionary',this.actualize,this);
        // Templates
        this.template = _.template($('#welcome-template').html());
    },
    events : {},
    actualize : function(dic){
        this.allNews_notifs = dic;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).empty();
        $(this.el).append(this.template({
            user        : this.user.toJSON(),
            notifNbre   : this.allNews_notifs.length
        }))
        
        return this;
    }
});
/////////////////////////////////////////////////