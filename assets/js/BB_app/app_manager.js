var global = {
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
    console.log("manager loading...");

        /*Models*/
    currentUser = new this.Models.User();
    currentProject = new this.Models.ProjectModel();
    /*Collections*/
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Groups = new this.Collections.GroupsCollection();
    this.collections.UserGroup = new this.Collections.UserGroup();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    /*Fetch*/
    this.collections.Projects.fetch({reset: true});
    this.collections.Permissions.fetch({reset: true});
    this.collections.Users.fetch({reset: true});

    this.collections.Groups.fetch({reset: true});

    this.collections.UserGroup.fetch({reset: true});
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////
// MANAGER PART
/////////////////////////////////////////////////////////////////////////////////////////////
var manager = {
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
    console.log("manager loading...");
   
    /*views*/
    this.views.Users_view = new this.Views.Users_view({
      collection:global.collections.Users
    });
    this.views.Groups_view = new this.Views.Groups_view({
      collection:global.collections.Groups,
      users:global.collections.Users,
      userGroups : global.collections.UserGroup
    });
    this.views.Projects_view = new this.Views.Projects_view({
      collection:global.collections.Projects,
      users : global.collections.Users,
      groups:global.collections.Groups,
      permissions:global.collections.Permissions
    });
    /*Loads*/
    this.views.Projects_view.render();
    this.views.Users_view.render();
    this.views.Groups_view.render();

    /*router initialisation*/
    this.Router_manager = new manager.Router_manager(); 
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Document ready
/////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {

  Backbone.Model.prototype.toJSON = function() {
    return JSON.parse(JSON.stringify(this.attributes));
  };
  // Initialisation de l'managerlication ici
  console.log( "CreaKtive DOM loaded!" );
  global.init();
  manager.init();      
  ////////////////////////////////////////
  /*activat of "hashchange events's monitoring"*/
  Backbone.history.start();
}) ;

