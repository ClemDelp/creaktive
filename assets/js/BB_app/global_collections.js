/*-----------------------------------------------------------------*/
/*Collections*/
/*-----------------------------------------------------------------*/

/***************************************/
global.Collections.PostsCollection = Backbone.Collection.extend({
    model : global.Models.Post_model,
    url : "post",
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
global.Collections.NotificationsCollection = Backbone.Collection.extend({
    model : global.Models.Notification_model,
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
    model : global.Models.User_model,
    initialize : function() {
        //console.log('Users collection Constructor');
        this.url = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });

    }
});
/***************************************/
global.Collections.GroupsCollection = Backbone.Collection.extend({
    model : global.Models.Group_model,
    initialize : function() {
        //console.log('Groups collection Constructor');
        this.url = "group";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.VersionsCollection = Backbone.Collection.extend({
    model : global.Models.Version_model,
    url : "version",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Versions Collection Constructor');
    }
});
/***************************************/
global.Collections.CommentsCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
    url : "comment",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
/***************************************/
global.Collections.ConceptsCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
    url : "concept",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});
/***************************************/
global.Collections.KnowledgesCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
    url : "knowledge",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});    
/***************************************/
global.Collections.LinksCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
    url : "link",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
/***************************************/
global.Collections.TagsCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
    url : "tag",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});     
/***************************************/
global.Collections.PermissionsCollection = Backbone.Collection.extend({
    model : global.Models.Comment_model,
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
    model : global.Models.Comment_model,
    url : "project",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});  
