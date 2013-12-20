var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (currentUser) {
    /*Init*/
    console.log("manager loading...");

    this.models.CurrentUser = new this.Models.User({id:currentUser}); 

    /*Collections*/
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Groups = new this.Collections.GroupsCollection();
    this.collections.UserGroup = new this.Collections.UserGroup();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    
    /*Fetch*/
    this.models.CurrentUser.fetch({
      error: function(model, response, options){
        console.log("'invité' doesn't exist yet, creating it now...")
        model.set({id:"999999999", name : "invité", img:"img/default-user-icon-profile.png"});
        model.save();
      }
    });
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



