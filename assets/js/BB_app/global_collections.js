/*-----------------------------------------------------------------*/
/*Collections*/
/*-----------------------------------------------------------------*/

/***************************************/
global.Collections.PostsCollection = Backbone.Collection.extend({
    model : global.Models.PostModel,
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
    model : global.Models.UserModel,
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
global.Collections.UserGroup = Backbone.Collection.extend({
    initialize : function() {
        //console.log('Groups collection Constructor');
        this.url = "usergroup";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Collections.VersionsCollection = Backbone.Collection.extend({
    model : global.Models.VersionModel,
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
    model : global.Models.CommentModel,
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
global.Collections.KnowledgesCollection = Backbone.Collection.extend({
    model : global.Models.KnowledgeModel,
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
global.Collections.TagsCollection = Backbone.Collection.extend({
    model : global.Models.TagModel,
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
