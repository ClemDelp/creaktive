//////////////////////////////////////////////
// Global object
//////////////////////////////////////////////
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
    //Variables
    this.models.current_user = new this.Models.User(json.user); ; 
    this.models.currentProject = new this.Models.ProjectModel(json.project);

    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"))
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);

    this.collections.Knowledges = new this.Collections.Knowledges(json.knowledges);
    this.collections.Users = new this.Collections.UsersCollection(json.users);
    this.collections.Poches = new this.Collections.Poches(json.poches);
    this.collections.Projects = new this.Collections.ProjectsCollection(json.projects);
    this.collections.Concepts = new this.Collections.ConceptsCollection(json.concepts);
    this.collections.Links = new this.Collections.CKLinks(json.links);
    this.collections.Permissions = new this.Collections.PermissionsCollection(json.permissions);
    this.collections.Backups = new this.Collections.Backups(json.backups);
    // Notifications
    this.collections.all_notifs = new this.Collections.NotificationsCollection(json.notifications);
    this.collections.all_notifs.on('add',this.prepareNotifications,this)
    this.collections.all_notifs.on('remove',this.prepareNotifications,this)
    this.collections.all_notifs.on('change',this.prepareNotifications,this)

    this.NotificationsDictionary = {};
    this.ModelsNotificationsDictionary = {};
    this.ProjectsNotificationsDictionary = {};
    this.AllNewsNotificationsDictionary = {};
    this.AllReadNotificationsDictionary = {};

    this.prepareNotifications();

    this.ProjectsUsersDictionary = this.Functions.getProjectsUsersDictionary(this.collections.Projects,this.collections.Permissions);

    callback();

  },
  prepareNotifications : function(){
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
/////////////////////////////////////////////////
var notification = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({
      el              : "#notification_container",
      user            : global.models.current_user,
      notifications   : global.collections.personal_notifs,
      eventAggregator : global.eventAggregator
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
var cron = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({
      backups         : global.collections.Backups,
      knowledges      : global.collections.Knowledges,
      concepts        : global.collections.Concepts,
      categories      : global.collections.Poches,
      cklinks         : global.collections.Links,
      project         : global.models.currentProject,
      notifications   : global.collections.all_notifs,
      eventAggregator : global.eventAggregator
    });
    this.views.main.render();
  }
};
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
    this.views.Main.render();
  }
};

/////////////////////////////////////////////////
var bbmap = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({
      el : "#bbmap_container",
      concepts        : global.collections.Concepts,
      project         : global.models.currentProject,
      user            : global.models.current_user,
      knowledges      : global.collections.Knowledges,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      eventAggregator : global.eventAggregator

    });
    this.views.main.render();
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
    this.views.main = new this.Views.Main({
      projects_notifs : global.ProjectsNotificationsDictionary, // Le dictionnaire des notifications
      users_rec_dic   : global.ProjectsUsersDictionary,
      permissions     : global.collections.Permissions,
      projects        : global.collections.Projects,
      concepts        : global.collections.Concepts,
      knowledges      : global.collections.Knowledges,
      experts         : global.collections.Users,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      users           : global.collections.Users,
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    }); 
    this.views.main.render()
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
      allNews_notifs  : global.AllNewsNotificationsDictionary, // Le dictionnaire de toutes les nouvelles notifications
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    });
    this.views.Main.render();
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
    this.views.main = new this.Views.Main({
      models_notifs  : global.ModelsNotificationsDictionary, // Le dictionnaire des notifications
      concepts    : global.collections.Concepts,
      project     : global.models.currentProject,
      user        : global.models.current_user,
      knowledges  : global.collections.Knowledges,
      poches      : global.collections.Poches,
      links       : global.collections.Links,
      eventAggregator : global.eventAggregator
    }); 
    this.views.main.render();
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
    this.views.main = new this.Views.Main({
      models_notifs         : global.ModelsNotificationsDictionary, // Le dictionnaire des notifications
      project               : global.models.currentProject,
      knowledges            : global.collections.Knowledges,
      categories            : global.collections.Poches,
      user                  : global.models.current_user,
      users                 : global.collections.Users,
      links                 : global.collections.Links,
      eventAggregator       : global.eventAggregator,
    });   
    this.views.main.render()
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
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    });
    this.views.Main.render();
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
      a_notifications : global.collections.all_notifs,
      k_notifications : global.collections.knowledge_notifs,
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
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
// JIAN
/////////////////////////////////////////////////
var CKViewer = {
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
        backups : global.collections.Backups,
        project           : global.models.currentProject,
        links : global.collections.Links,
        knowledges : global.collections.Knowledges,
        concepts : global.collections.Concepts,
        eventAggregator : global.eventAggregator,
        poches : global.collections.Poches,
        user : global.models.current_user,
    });   
    this.views.Main.render();
  }
};
////////////////////////////////////////////////
var CKPreviewer = {
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
        links : global.collections.Links,
        knowledges : global.collections.Knowledges,
        concepts : global.collections.Concepts,
        eventAggregator : global.eventAggregator,
        poches : global.collections.Poches,
        user : global.models.current_user,
    });   
    this.views.Main.render();
  }
};