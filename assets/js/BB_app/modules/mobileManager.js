/////////////////////////////////////////////////
var mobileManager = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new mobileManager.Views.Main({
      el : json.el,
      projects : global.collections.Projects,
      user : global.models.current_user
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
mobileManager.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.projects = json.projects;
        this.user = json.user;
        this.template = _.template($('#mobileManager-template').html());
    },
    events : {
      "click .fullscreen" : "putInFullScreen",
    },
    putInFullScreen : function(e){
        e.preventDefault();
        if (screenfull.enabled) screenfull.request();
        
    },
    render : function(){        
        ///////////////////////
        // init
        $(this.el).empty();
        $(this.el).append(this.template({
          projects:this.projects.toJSON(),
          user:this.user.toJSON()
        }))
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
