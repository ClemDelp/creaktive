
/////////////////////////////////////////////////////////////////////
/*Explorer Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Poches = Backbone.Collection.extend({
    model : global.Models.Poche,
    initialize : function() {
        this.url = "poche";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove', this.serverRemove, this);
    },
    serverCreate : function(category){
        this.add(category);
    },
    serverUpdate : function(category){
        global.eventAggregator.trigger(category.id,category);
    },
    serverRemove : function(category){
        this.remove(category.id);
    }
});
/////////////////////////////////////////////////////////////////////
/*Timela Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Knowledges = Backbone.Collection.extend({
    model : global.Models.Knowledge,
    /*url : "post",*/
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        this.url = "knowledge";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove', this.serverRemove, this);
    },
    serverCreate : function(model){
        //this.add(new_knowledge);
        global.eventAggregator.trigger("knowledge:create",new Backbone.Model(model));
    },
    serverUpdate : function(knowledge){
        global.eventAggregator.trigger(knowledge.id,knowledge);
    },
    serverRemove : function(model){
        //this.remove(knowledge.id);
        global.eventAggregator.trigger("knowledge:remove",new Backbone.Model(model));

    }
});
/***************************************/
global.Collections.Backups = Backbone.Collection.extend({
    model : global.Models.Backup,
    initialize : function() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Filters = Backbone.Collection.extend({
    model : global.Models.Filter,
    initialize : function() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Comments = Backbone.Collection.extend({
    model : global.Models.Comment,
    //url : "comment",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
 /***************************************/
global.Collections.NotificationsCollection = Backbone.Collection.extend({
    model : global.Models.NotificationModel,
    initialize : function() {
        //console.log('Notifications collection Constructor');
        this.url = "notification";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate');
        this.ioBind('create', this.serverCreate, this);
    },
    comparator: function(m){
        return -m.get('comparator');
    },
    serverCreate : function(new_notif){
        this.add(new_notif);
    }
});
/***************************************/
global.Collections.UsersCollection = Backbone.Collection.extend({
    model : global.Models.User,
    initialize : function() {
        //console.log('Users collection Constructor');
        this.url = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});

/***************************************/
global.Collections.GroupsCollection = Backbone.Collection.extend({
    model : global.Models.GroupModel,
    initialize : function() {
        //console.log('Groups collection Constructor');
        this.url = "group";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Collections.ConceptsCollection = Backbone.Collection.extend({
    model : global.Models.ConceptModel,
    url : "concept",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove', this.serverRemove, this);
    },
    serverCreate : function(model){
        //this.add(model);
        global.eventAggregator.trigger("concept:create",new Backbone.Model(model));
    },
    serverUpdate : function(model){
        global.eventAggregator.trigger("concept:update",new Backbone.Model(model));
    },
    serverRemove : function(model){
        //this.remove(new Backbone.Model(model));
        global.eventAggregator.trigger("concept:remove",new Backbone.Model(model));

    }
});
/***************************************/
global.Collections.UserGroup = Backbone.Collection.extend({
    model : global.Models.UserGroupModel,
    url : "usergroup",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});
   
/***************************************/
global.Collections.CKLinks = Backbone.Collection.extend({
    model : global.Models.CKLink,
    url : "link",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
  
/***************************************/
global.Collections.PermissionsCollection = Backbone.Collection.extend({
    model : global.Models.PermissionModel,
    url : "permission",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});  
/***************************************/
global.Collections.ProjectsCollection = Backbone.Collection.extend({
    model : global.Models.ProjectModel,
    url : "project",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});  

