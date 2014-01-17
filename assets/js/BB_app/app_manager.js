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
var topBar = {
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
      eventAggregator : global.eventAggregator
    });
    // this.collections.Links.fetch({
    //   reset:true,
    //   success : function(collection, response, options){},
    //   complete : function(collection, response, options){},
    //   error : function(collection, response, options){
    //     console.log(response)
    //   },
    // });

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
  
  }
};



