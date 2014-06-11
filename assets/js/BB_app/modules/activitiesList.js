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
        if(this.model.get('type') == 'project'){
          this.models_notifs = global.ProjectsNotificationsDictionary;
          this.listenTo(global.eventAggregator,"ProjectsNotificationsDictionary",this.actualize,this); 
          //global.eventAggregator.bind("ProjectsNotificationsDictionary",this.actualize,this);
        }else{
          this.models_notifs = global.ModelsNotificationsDictionary;
          this.listenTo(global.eventAggregator,"ModelsNotificationsDictionary",this.actualize,this);
          //global.eventAggregator.bind("ModelsNotificationsDictionary",this.actualize,this);
        } 
        // Event
        this.listenTo(this.model,"remove",this.removeView,this);
        //this.model.on("remove",this.remove,this);
        // Templates
        this.template = _.template($('#activitiesList-template').html());     
    },
    events : {},
    removeView : function(){
      this.remove();
    },
    actualize : function(models_notifs){
      if(this.model.get('type') == 'project'){
          this.models_notifs = global.ProjectsNotificationsDictionary;
        }else{
          this.models_notifs = global.ModelsNotificationsDictionary;
        } 
      //this.read_notifs = models_notifs[this.model.get('id')].read;
      this.render();
    },
    render : function(){
        // Init
        
        this.news_notifs     = this.models_notifs[this.model.get('id')].news;
        //this.read_notifs     = this.models_notifs[this.model.get('id')].read;
        $(this.el).empty();
        _this = this;
        // Poche list
        // notif_to_render = new Backbone.Collection();
        // this.notifications.each(function(notification){
        //     if(notification.get('to').id == _this.model.get('id')){notif_to_render.add(notification)}
        // });
        $(this.el).append(this.template({
          model       : this.model.toJSON(),
          news_notifs : this.news_notifs.toJSON(),
          //read_notifs : this.read_notifs.toJSON()
        }));
        
        return this;
    }
});
