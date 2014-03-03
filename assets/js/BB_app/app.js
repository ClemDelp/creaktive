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

    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    this.models.currentProject = new this.Models.ProjectModel(JSON.parse(currentProject)); 
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();

    // Fetch
    global.collections.Users.fetch({reset:true,success:function(){},complete:function(){
      global.collections.Knowledges.fetch({reset: true,complete:function(){
        global.collections.Poches.fetch({reset: true,complete:function(){
          global.collections.Projects.fetch({reset:true,complete:function(){
            global.collections.Concepts.fetch({reset:true,complete:function(){
              global.collections.Links.fetch({reset:true,complete:function(){
                global.collections.Notifications.fetch({reset:true,complete:function(){
                  global.collections.Permissions.fetch({reset:true,complete:function(){
      
                  }});
                }});
              }});
            }});        
          }});      
        }});    
      }});  
    }}); 
  
    callback();

  },
  initManager :function (currentUser, callback) {
    // Variable
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    console.log("******* Connected as ", this.models.current_user.get("name"))
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    // Fetch
    global.collections.Projects.fetch({reset: true,complete:function(){
      global.collections.Notifications.fetch({reset : true,complete:function(){}});  
    }});

    callback();
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
      projects : global.collections.Projects,
      currentUser : global.models.current_user,
      eventAggregator : global.eventAggregator
    }); 
  }
};
/////////////////////////////////////////////////
var conceptsmap = {
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
      concepts    : global.collections.Concepts,
      project     : global.models.currentProject,
      user        : global.models.current_user,
      knowledges  : global.collections.Knowledges,
      eventAggregator : global.eventAggregator
    });   
  }
};
/////////////////////////////////////////////////
var category = {
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
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
    });   
  }
};
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
  init: function (page) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      projects        : global.collections.Projects,
      project         : global.models.currentProject,
      page            : page,
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    });  
  }
};
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
  init: function (projectTitle) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      projects    : global.collections.Projects,
      project     : projectTitle,
      concepts    : global.collections.Concepts,
      knowledges  : global.collections.Knowledges,
      experts     : global.collections.Users,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      users       : global.collections.Users,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator
    });  

  }
};
/////////////////////////////////////////////////
var user = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (project_) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      project     : project_,
      users       : global.collections.Users,
      permissions : global.collections.Permissions,
      eventAggregator : global.eventAggregator
    });  
  }
};
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
