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
  init: function (currentUser, callback) {
    /*Init*/
    console.log("global object loading...");

    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 

    /*Collections*/
    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.collections.users = new this.Collections.UsersCollection();
    /*Loads*/
    this.collections.Knowledges.fetch({reset: true});
    this.collections.Poches.fetch({reset: true});
    this.collections.Projects.fetch({reset:true});
    this.collections.Concepts.fetch({reset:true});
    this.collections.Links.fetch({reset:true});
    this.collections.Notifications.fetch({reset:true});
    this.collections.users.fetch({reset:true});

    callback();

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
    console.log('VISU Constructor');
    this.views.main = new this.Views.Main({
      concepts    : global.collections.Concepts,
      knowledges  : global.collections.Knowledges,
      experts     : global.collections.users,
      poches      : global.collections.Poches,
      links       : global.collections.Links
    });

    this.views.main.render();
  }
};
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
    console.log('TopBar Constructor');

    this.views.Main = new this.Views.Main({
      notifications : global.collections.Notifications,
      current_user : global.models.current_user
    });
    this.collections.Links.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){
        console.log(response)
      },
    });

  }
};
/////////////////////////////////////////////////
var k_details = {
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
    console.log('K_details Constructor');
  }
};

/////////////////////////////////////////////////
var c_details = {
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
    console.log('C_details Constructor');
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
    console.log('Explorer Constructor');
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
    console.log('CKLink Constructor');
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
    console.log('Concepts Constructor');
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
    console.log('interface3 Constructor');
    /*views*/
    this.views.Main = new this.Views.Main({
      knowledges:global.collections.Knowledges,
      user:global.models.current_user,
      poches:global.collections.Poches
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
    console.log('interface1 Constructor');
    /*views*/
    
    /*views*/
    this.views.Main = new this.Views.Main({
      currentUser : global.models.current_user,
      currentProject : new global.Models.ProjectModel({}),
      concepts : global.collections.Concepts,
      links : global.collections.Links,
      knowledges : global.collections.Knowledges,
      poches : global.collections.Poches
    });

    /*Renders*/
    this.views.Main.render();

    
  }
};


