/////////////////////////////////////////////////
var bbmap = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Parameters
  window_height : $(window).height() - 50,
  zoom : new Backbone.Model({val : 1}),
  node_size : function(){ return 18*this.zoom.get('val'); },
  horizontal_gap : function(){ return 200*this.zoom.get('val'); },
  vertical_gap : function(){ return 80*this.zoom.get('val');},
  // Constructor
  init: function () {
    // main
    this.views.main = new this.Views.Main({
      el              : "#bbmap_container",
      elements        : global.collections.Elements,
      project         : global.models.currentProject,
      user            : global.models.current_user,
      users           : global.collections.Users,
      links           : global.collections.Links,
      eventAggregator : global.eventAggregator,
      notifications   : global.collections.Notifications,
      mode            : global.mode,
      init            : true,
      ckOperator      : global.ckOperator,
      filter          : global.filter,
      news            : global.collections.News

    });
  },
};






