/////////////////////////////////////////////////
var publicMap = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.main = new this.Views.Main({
      projects        : global.collections.Projects,
      concepts        : global.collections.Concepts,
      knowledges      : global.collections.Knowledges,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    }); 
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
publicMap.Views.Main = Backbone.View.extend({
    el : $("#publicmap-container"),
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects           = json.projects;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Events
        // Templates
        this.template_header = _.template($('#publicmap-header-template').html());
        this.template_categories = _.template($('#publicmap-categories-template').html());
        this.template_footer = _.template($('#publicmap-footer-template').html());
    },
    events : {},
    render : function() {
        $(this.el).empty();
        $(this.el).append(this.template_header());
        var categories = new publicMap.Views.Categories({
            className : "large-3 small-3 medium-3 columns",
            projects : this.projects
        }).render().el;
        var maps = new publicMap.Views.Maps({
            className : "large-9 small-9 medium-9 columns",
            projects : this.projects
        }).render().el;
        $(this.el).append($('<div>',{class:'row panel'}).append(categories).append(maps));

        $("#maps_container").gridalicious({width: 300});
        
        return this;
    }
});
/////////////////////////////////////////////////
// Categories
/////////////////////////////////////////////////
publicMap.Views.Categories = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects;
        // Events
        // Templates
        this.template_categories = _.template($('#publicmap-categories-template').html());
    },
    events : {},
    render : function() {
        $(this.el).empty();
        $(this.el).append(this.template_categories({categories : ["tutu","tata"]}));
        return this;
    }
});
/////////////////////////////////////////////////
// Maps
/////////////////////////////////////////////////
publicMap.Views.Maps = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects;
        // Events
        // Templates
        this.template_maps = _.template($('#publicmap-maps-template').html());
    },
    events : {},
    render : function() {
        $(this.el).empty();
        $(this.el).append(this.template_maps({projects : this.projects.toJSON()}));
        return this;
    }
});
