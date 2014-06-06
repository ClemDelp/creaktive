//////////////////////////////////////////////////////////////////
//                    CONTROLLER DE CREAKTIVE 
//                        Global object 
//////////////////////////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  Functions: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  functions: {},
  init: function (json,callback) {
    //////////////////////////////////////////////////////////////////
    // Data
    //////////////////////////////////////////////////////////////////
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);
    // Models
    this.models.current_user = new this.Models.User(json.user); ; 
    this.models.currentProject = new this.Models.ProjectModel(json.project);
    // Collection
    this.collections.Knowledges = new this.Collections.Knowledges(json.knowledges);
    this.collections.Poches = new this.Collections.Poches(json.poches);
    this.collections.Users = new this.Collections.UsersCollection(json.users);
    this.collections.Permissions = new this.Collections.PermissionsCollection(json.permissions);
    this.collections.Projects = new this.Collections.ProjectsCollection(json.projects);
    this.collections.Concepts = new this.Collections.ConceptsCollection(json.concepts);
    this.collections.Links = new this.Collections.CKLinks(json.links);
    this.collections.Backups = new this.Collections.Backups(json.backups);
    this.collections.all_notifs = new this.Collections.NotificationsCollection(json.notifications);
    // Dictionaries    
    this.ProjectsUsersDictionary = this.Functions.getProjectsUsersDictionary(this.collections.Projects,this.collections.Permissions);// dictionaire pour le nombre d'utilisateur par projet
    this.NotificationsDictionary = {};
    this.ModelsNotificationsDictionary = {};
    this.ProjectsNotificationsDictionary = {};
    this.AllNewsNotificationsDictionary = {};
    this.AllReadNotificationsDictionary = {};
    //////////////////////////////////////////////////////////////////
    // Events
    //////////////////////////////////////////////////////////////////
    this.collections.Poches.on('add',this.prepareNotifications,this);
    this.collections.Projects.on('add',this.prepareNotifications,this);
    this.collections.Knowledges.on('add',this.prepareNotifications,this);
    this.collections.Concepts.on('add',this.prepareNotifications,this);
    this.collections.all_notifs.on('add',this.prepareNotifications,this);
    this.collections.all_notifs.on('remove',this.prepareNotifications,this);
    this.collections.all_notifs.on('change',this.prepareNotifications,this);
    //////////////////////////////////////////////////////////////////
    // Init
    //////////////////////////////////////////////////////////////////
    this.prepareNotifications();
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))    
    callback();
  },
  prepareNotifications : function(){alert("prepareNotifications")
    ////////////////////////////
    // Dictionaries 
    this.NotificationsDictionary = global.Functions.getNotificationsDictionary(global.models.current_user,global.collections.all_notifs,global.collections.Projects,global.collections.Knowledges,global.collections.Concepts,global.collections.Poches);
    
    this.ModelsNotificationsDictionary = this.NotificationsDictionary.models;
    this.ProjectsNotificationsDictionary = this.NotificationsDictionary.projects;
    this.AllNewsNotificationsDictionary = this.NotificationsDictionary.allNews;
    this.AllReadNotificationsDictionary = this.NotificationsDictionary.allRead;

    this.eventAggregator.trigger("ModelsNotificationsDictionary",this.ModelsNotificationsDictionary);
    this.eventAggregator.trigger("ProjectsNotificationsDictionary",this.ProjectsNotificationsDictionary);
    this.eventAggregator.trigger("AllNewsNotificationsDictionary",this.AllNewsNotificationsDictionary);
    this.eventAggregator.trigger("AllReadNotificationsDictionary",this.AllReadNotificationsDictionary);
  }
};
//////////////////////////////////////////////