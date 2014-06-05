var activitiesList = {
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
activitiesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model           = json.model;
        this.models_notifs   = json.models_notifs;        
        this.news_notifs     = this.models_notifs[this.model.get('id')].news;
        this.read_notifs     = this.models_notifs[this.model.get('id')].read;
        this.eventAggregator = json.eventAggregator;
        // En fonction du type on ecoute sur l'event adequat
        if(this.model.get('type') == 'project') this.eventAggregator.bind("ProjectsNotificationsDictionary",this.actualize,this);
        else this.eventAggregator.bind("ModelsNotificationsDictionary",this.actualize,this);
        // Templates
        this.template = _.template($('#activitiesList-template').html());     
    },
    events : {},
    actualize : function(models_notifs){
      console.log(models_notifs)
      console.log(this.model.get('id'))
      console.log(models_notifs[this.model.get('id')])
      this.news_notifs = models_notifs[this.model.get('id')].news;
      this.read_notifs = models_notifs[this.model.get('id')].read;
      this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        _this = this;
        // Poche list
        // notif_to_render = new Backbone.Collection();
        // this.notifications.each(function(notification){
        //     if(notification.get('to').id == _this.model.get('id')){notif_to_render.add(notification)}
        // });
        $(this.el).append(this.template({
          model       : this.model.toJSON(),
          news_notifs : this.news_notifs.toJSON(),
          read_notifs : this.read_notifs.toJSON()
        }));
        
        return this;
    }
});
