/////////////////////////////////////////////////
var title = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (_project,_page) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      project           : _project,
      page              : _page,
      user              : global.models.current_user,
      eventAggregator   : global.eventAggregator
    });  
    this.views.Main.render();
  }
};
/////////////////////////////////////////
// Main
/////////////////////////////////////////
title.Views.Main = Backbone.View.extend({
    el:"#title_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.page = json.page;
        this.json = {};
        this.project = json.project;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($('#title-template').html());              
        
    },
    render : function(){
      $(this.el).empty();

      $(this.el).append(new together.Views.Main({
        project         : global.models.currentProject,
        user            : global.models.current_user,
        users           : global.collections.Project_users
      }).render().el)

      $(this.el).append(this.template({project: this.project,page : this.page}));
      
      $(document).foundation();
      return this;
    }
});
/////////////////////////////////////////
