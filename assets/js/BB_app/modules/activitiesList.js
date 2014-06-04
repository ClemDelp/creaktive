/**************************************/
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
        this.all_notifs      = json.all_notifs;
        this.news_notifs     = json.model_notifs.news;
        this.read_notifs     = json.model_notifs.read;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.all_notifs.bind("add",this.render);
        this.all_notifs.bind("remove",this.render);
        this.all_notifs.bind("change",this.render);
        // Templates
        this.template = _.template($('#activitiesList-template').html());     
    },
    events : {},
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
          news_notifs : this.news_notifs.toJSON(),
          read_notifs : this.read_notifs.toJSON()
        }));
        
        return this;
    }
});
/**************************************/