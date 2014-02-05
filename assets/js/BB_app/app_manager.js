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
    console.log("******* Connected as ", this.models.CurrentUser.get("name"))
    /*Collections*/
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Groups = new this.Collections.GroupsCollection();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Notifications = new this.Collections.NotificationsCollection();

    this.collections.Projects.fetch({reset: true});
    this.collections.Users.fetch({reset: true});
    this.collections.Groups.fetch({reset: true});
    this.collections.Notifications.fetch({reset : true});

          this.eventAggregator = {};//this.concepts.first();
      _.extend(this.eventAggregator, Backbone.Events);

  }
}

/////////////////////////////////////////////////
var notifications = {
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
      notifications : global.collections.Notifications,
      current_user : global.models.CurrentUser,
      users : global.collections.Users,
      eventAggregator : global.eventAggregator
    });

  }
};


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

    this.views.Main.render();
  
  }
};



