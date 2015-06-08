/////////////////////////////////////////////////
var topbar = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator : global.eventAggregator,
  init: function (json) {
    // gestion des permissions impact sur l'affichage
    var mode = "visu";
    var permission = rules.getPermission();
    if(permission) mode = "edit";
    /*Init*/
    this.views.main = new this.Views.Main({
      el : json.el,
      page : json.page || "normal",
      mode : mode,
      user : global.models.current_user,
      project : global.models.currentProject,
      notifications : global.collections.Notifications
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user          = json.user;
        this.page          = json.page;
        this.mode          = json.mode;
        this.project       = json.project;
        this.Notifications = json.notifications;
        // Templates
        this.template = _.template($('#topbar-template').html());
        this.template_editor = _.template($('#topbar-editor-template').html());
    },
    render : function(){
        $(this.el).empty();
        ///////////////////////////
        // WHEN EDITOR
        if(this.page == "editor"){
          $(this.el).append(this.template_editor({
            user    : this.user.toJSON(),
            project : this.project.toJSON(),
            mode:this.mode
          }));
          /////////////////////////
          // Workspace editor
          if(workspaceEditor.views.main != undefined) workspaceEditor.views.main.close();
          workspaceEditor.init({
              el:"#title_project_modal",
              mode:this.mode
          });
        }
        ///////////////////////////
        // WHEN HOME OR OTHER PAGES
        else{
          $(this.el).append(this.template({user:this.user.toJSON()}));  
        }

        workspacesList.init({
          el:"#workspaces_dropdown",
          display:"list"
        });
        return this;
    }
});
/***************************************/

