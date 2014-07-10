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
  init: function () {
    this.zoom = new Backbone.Model({val : 1});

    this.node_size = function(){ return 18*this.zoom.get('val'); };
    this.horizontal_gap = function(){ return 200*this.zoom.get('val'); };
    this.vertical_gap = function(){ return 80*this.zoom.get('val');};
    

    this.views.main = new this.Views.Main({
      el : "#bbmap_container",
      concepts        : global.collections.Concepts,
      project         : global.models.currentProject,
      user            : global.models.current_user,
      knowledges      : global.collections.Knowledges,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      eventAggregator : global.eventAggregator

    });
    this.views.main.render();
  }
};

