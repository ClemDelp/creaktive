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
    /*Loads*/
    // this.models.current_user.fetch({
    //   reset : true,
    //   error: function(model, response, options){
    //     console.log("connected as a guest");
    //   }
    // });

    this.collections.Knowledges.fetch({reset: true});
    this.collections.Poches.fetch({reset: true});
    this.collections.Projects.fetch({reset:true});
    this.collections.Concepts.fetch({reset:true});
    this.collections.Links.fetch({reset:true});
    this.collections.Notifications.fetch({reset:true});

    callback();

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
var interface2 = {
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
    console.log('interface2 Constructor');
    /*views*/
    
    /*Renders*/
   
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


