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

    this.models.CurrentUser = new this.Models.User(JSON.parse(currentUser)); 

    /*Collections*/
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Groups = new this.Collections.GroupsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    

    this.collections.Projects.fetch({reset: true});
    this.collections.Permissions.fetch({reset: true});
    this.collections.Users.fetch({reset: true});
    this.collections.Groups.fetch({reset: true});

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
    this.views.Main = new this.Views.Main({
      users : global.collections.Users,
      groups : global.collections.Groups,
      projects : global.collections.Projects
    }); 
  
  }
};



