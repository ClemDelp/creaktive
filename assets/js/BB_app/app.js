//////////////////////////////////////////////
// Global object
//////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (currentUser, currentProject, callback) {
    /*Init*/

    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    this.models.currentProject = new this.Models.ProjectModel(JSON.parse(currentProject)); 
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    /*Collections*/
    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Notifications = new this.Collections.NotificationsCollection();


    /*Loads*/


    this.collections.Users.fetch({reset:true}); 
    this.collections.Knowledges.fetch({reset: true});
    this.collections.Poches.fetch({reset: true});
    this.collections.Projects.fetch({reset:true});
    this.collections.Concepts.fetch({reset:true});
    this.collections.Links.fetch({reset:true});
    this.collections.Notifications.fetch({reset:true});

      this.eventAggregator = {};//this.concepts.first();
      _.extend(this.eventAggregator, Backbone.Events);

    callback();

  },

  initManager :function (currentUser) {
    /*Init*/
    console.log("manager loading...");

    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    console.log("******* Connected as ", this.models.current_user.get("name"))
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
      projects : global.collections.Projects,
      currentUser : global.models.current_user
    }); 

    this.views.Main.render();
  
  }
};
/////////////////////////////////////////////////
var visu = {
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
      projects    : global.collections.Projects,
      concepts    : global.collections.Concepts,
      knowledges  : global.collections.Knowledges,
      experts     : global.collections.Users,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
      style       : "grid"

    });

    //this.views.main.render();
  }
};
/////////////////////////////////////////////////
// var topBar = {
//   // Classes
//   Collections: {},
//   Models: {},
//   Views: {},
//   // Instances
//   collections: {},
//   models: {},
//   views: {},
//   init: function () {
//     /*Init*/

//     this.views.Main = new this.Views.Main({
//       notifications : global.collections.Notifications,
//       current_user : global.models.current_user,
//       eventAggregator : global.eventAggregator
//     });
//   }
// };

/////////////////////////////////////////////////
// var notifications = {
//   // Classes
//   Collections: {},
//   Models: {},
//   Views: {},
//   // Instances
//   collections: {},
//   models: {},
//   views: {},
//   init: function () {
//     /*Init*/

//     this.views.Main = new this.Views.Main({
//       notifications : global.collections.Notifications,
//       current_user : global.models.current_user,
//       users : global.collections.Users,
//       eventAggregator : global.eventAggregator
//     });

//   }
// };

/////////////////////////////////////////////////
var explorer = {
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

  }
};
/////////////////////////////////////////////////
var cklink = {
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

  }
};
/////////////////////////////////////////////////
var tagK = {
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

  }
};
/////////////////////////////////////////////////
var concepts = {
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

  }

};
/////////////////////////////////////////////////
var interface3 = {
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

    /*views*/
    this.views.Main = new this.Views.Main({
      knowledges:global.collections.Knowledges,
      user:global.models.current_user,
      poches:global.collections.Poches,
      users : global.collections.Users,
      eventAggregator : global.eventAggregator
    });
    /*Renders*/
    this.views.Main.render();
        
  }
};
/////////////////////////////////////////////////
var interface1 = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},

    // Objects
  
  init: function () {
    /*Init*/

    /*views*/
    
    /*views*/
    this.views.Main = new this.Views.Main({
      users : global.collections.Users,
      currentUser : global.models.current_user,
      currentProject : new global.Models.ProjectModel({}),
      concepts : global.collections.Concepts,
      links : global.collections.Links,
      knowledges : global.collections.Knowledges,
      poches : global.collections.Poches,
      eventAggregator : global.eventAggregator
    });

    /*Renders*/
    this.views.Main.render();

    
  }
};


/////////////////////////////////////////////////
var details = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    
    details_ = new details.Views.Main({
      user : global.models.current_user,
      users : global.collections.Users,
      knowledges : global.collections.Knowledges,
      concepts : global.collections.Concepts,
      eventAggregator : global.eventAggregator,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      currentProject : global.models.currentProject
    });

      
  }
};
