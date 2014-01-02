
/////////////////////////////////////////////////////////////////////
/*Explorer Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Knowledges = Backbone.Collection.extend({
    model : global.Models.Knowledge,
    initialize : function() {
        console.log('Knowleges collection Constructor');
        this.url = "knowledge";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Poches = Backbone.Collection.extend({
    model : global.Models.Poche,
    initialize : function() {
        console.log('Poches collection Constructor');
        this.url = "poche";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/////////////////////////////////////////////////////////////////////
/*Timela Collections*/
/////////////////////////////////////////////////////////////////////
global.Collections.Timelines = Backbone.Collection.extend({
    model : global.Models.Timeline,
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        console.log('Timelines collection Constructor');
        this.url = "timeline";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.Posts = Backbone.Collection.extend({
    model : global.Models.Post,
    /*url : "post",*/
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Post collection Constructor');
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.CommentsCollection = Backbone.Collection.extend({
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
global.Collections.LinksCollection = Backbone.Collection.extend({
    model : global.Models.LinkModel,
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

