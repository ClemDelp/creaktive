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
        this.activity_size = 10;
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
        this.template_activityLog = _.template($('#activityLog-template').html());    
    },
    events : {
      "click .closeAll" : "globalValidation",
      "click .close" : "simpleValidation",
      "click .more" : "loadMore"
    },
    loadMore : function(e){
      e.preventDefault();
      _this = this;
      this.activity_size = this.activity_size + 10;
      socket.post("/notification/getmore", {project_id : this.model.id, limit:this.activity_size}, function(activities){

        $(_this.el).empty();
        
        $(_this.el).append(_this.template({
          model       : _this.model.toJSON(),
          news_notifs : _this.news_notifs.toJSON(),
        }));

        if(_this.model.get('type') == 'project'){
          $(_this.el).append(_this.template_activityLog({
            model         : _this.model.toJSON(),
            notifications : activities
          }))
        }
        
        return this;
      })
    },
    globalValidation : function(e){
        e.preventDefault();
        _this = this;
        this.models_notifs[this.model.get('id')].news.each(function(notif){
            notif.set({read : _.union(notif.get('read'),global.models.current_user.get('id'))});
            notif.save();
        });
        this.render();
    },
    simpleValidation : function(e){
        e.preventDefault();
        notif = this.models_notifs[this.model.get('id')].news.get(e.target.getAttribute('data-id-notification'));
        notif.set({read : _.union(notif.get('read'),global.models.current_user.get('id'))});
        notif.save();
        this.render();
    },
    removeView : function(){
      this.remove();
    },
    actualize : function(models_notifs){
      _this = this;
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
        this.activityLog     = this.models_notifs[this.model.get('id')].read;
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

        if(this.model.get('type') == 'project'){
          $(this.el).append(this.template_activityLog({
            model         : this.model.toJSON(),
            notifications : this.activityLog.toJSON()
          }))
        }
        
        return this;
    }
});
