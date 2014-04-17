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
  init: function (currentUser, currentProject, users, knowledges, poches,projects, concepts, links, notifications, permissions,callback) {
    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    this.models.currentProject = new this.Models.ProjectModel(currentProject); 
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.CKLinks();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
<<<<<<< HEAD
    // Notifications
    this.collections.Notifications = new this.Collections.NotificationsCollection();
    this.collections.knowledge_notifs = new Backbone.Collection();
    this.collections.concept_notifs = new Backbone.Collection();
    this.collections.category_notifs = new Backbone.Collection();
    // Fetch
    global.collections.Users.fetch({reset:true,complete:function(){},success:function(){
      global.collections.Knowledges.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},success:function(){
        global.collections.Poches.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},success:function(){
          global.collections.Projects.fetch({reset:true,success:function(){
            global.collections.Concepts.fetch({reset:true,data : { projectId : global.models.currentProject.get('id') },success:function(){
              global.collections.Links.fetch({reset:true,data : {projectId : global.models.currentProject.get('id')},success:function(){
                global.collections.Notifications.fetch({
                  reset:true,
                  data : {projectId : global.models.currentProject.get('id')},
                  success:function(collection, response){
                    collection.each(function(notif){
                      if(notif.get('object') == "Knowledge"){
                        global.collections.knowledge_notifs.add(notif);
                      }else if(notif.get('object') == "Concept"){
                        global.collections.concept_notifs.add(notif);
                      }else if(notif.get('object') == "Category"){
                        global.collections.category_notifs.add(notif);
                      }
                    });
                    //alert(global.collections.knowledge_notifs.length+" - "+global.collections.concept_notifs.length+" - "+global.collections.category_notifs.length)
                    global.collections.Permissions.fetch({reset:true,success:function(){}});
                  }
                });
              }});
            }});        
          }});      
        }});    
      }});  
    }}); 
=======


    this.collections.Knowledges.reset(knowledges);
    this.collections.Users.reset(users);
    this.collections.Poches.reset(poches);
    this.collections.Projects.reset(projects);
    this.collections.Concepts.reset(concepts);
    this.collections.Links.reset(links);
    this.collections.Notifications.reset(notifications);
    this.collections.Permissions.reset(permissions);
    // Fetch
    // global.collections.Users.fetch({reset:true,success:function(){},complete:function(){
    //   global.collections.Knowledges.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},complete:function(){
    //     global.collections.Poches.fetch({reset: true,data : {projectId : global.models.currentProject.get('id')},complete:function(){
    //       global.collections.Projects.fetch({reset:true,complete:function(){
    //         global.collections.Concepts.fetch({reset:true,data : { projectId : global.models.currentProject.get('id') },complete:function(){
    //           global.collections.Links.fetch({reset:true,data : {projectId : global.models.currentProject.get('id')},complete:function(){
    //             global.collections.Notifications.fetch({reset:true,complete:function(){
    //               global.collections.Permissions.fetch({reset:true,complete:function(){
      
    //               }});
    //             }});
    //           }});
    //         }});        
    //       }});      
    //     }});    
    //   }});  
    // }}); 
>>>>>>> origin/bootstrap
  
    callback();

  },
  initManager :function (currentUser, callback) {
    //Variables
    this.models.current_user = new this.Models.User(JSON.parse(currentUser)); 
    console.log("******* Connected as ", this.models.current_user.get("name"))
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
    global.collections.Users.fetch({reset:true,complete:function(){},success:function(){
      global.collections.Knowledges.fetch({reset: true,success:function(){
        global.collections.Poches.fetch({reset: true,success:function(){
          global.collections.Projects.fetch({reset:true,success:function(){
            global.collections.Concepts.fetch({reset:true,success:function(){
              global.collections.Links.fetch({reset:true,success:function(){
                global.collections.Notifications.fetch({reset:true,success:function(){
                  global.collections.Permissions.fetch({reset:true,success:function(){
      
                  }});
                }});
              }});
            }});        
          }});      
        }});    
      }});  
    }}); 
  
    callback();
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
// MANAGER PART
/////////////////////////////////////////////////////////////////////////////////////////////
var analyse = {
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
      concepts : global.collections.Concepts,
      knowledges : global.collections.Knowledges,
      links : global.collections.Links,
      eventAggregator : global.eventAggregator
    }); 
    this.views.Main.render()
  }
};
/////////////////////////////////////////////////
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
      permissions : global.collections.Permissions,
      projects    : global.collections.Projects,
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
var welcome = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.Main = new this.Views.Main({
      notifications : global.collections.Notifications,
      user : global.models.current_user
    })
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
      notifications : global.collections.Notifications,
      concepts    : global.collections.Concepts,
      project     : global.models.currentProject,
      user        : global.models.current_user,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      eventAggregator : global.eventAggregator
    }); 
    this.views.Main.render()  
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
      notifications   : global.collections.Notifications,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      user        : global.models.current_user,
      eventAggregator : global.eventAggregator,
    });   
    this.views.Main.render()
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
      notifications   : global.collections.Notifications,
      // project         : global.models.currentProject,
      // projects        : global.collections.Projects,
      // concepts        : global.collections.Concepts,
      // knowledges      : global.collections.Knowledges,
      // experts         : global.collections.Users,
      // poches          : global.collections.Poches,
      // links           : global.collections.Links,
      user            : global.models.current_user,
      //users           : global.collections.Users,
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
  init: function (_project,_page) {
    /*Init*/
    this.views.Main = new this.Views.Main({
      project           : _project,
      page              : _page,
      user              : global.models.current_user,
      eventAggregator   : global.eventAggregator
    });  
    this.views.Main.render();
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
    this.views.Main.render()
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
      notifications : global.collections.Notifications,
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
<<<<<<< HEAD
=======
    this.views.main.render()

    //this.views.main.render();
>>>>>>> origin/bootstrap
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
var comments = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/////////////////////////////////////////////////
var attachment = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
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
