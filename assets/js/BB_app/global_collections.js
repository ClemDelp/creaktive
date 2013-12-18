/*-----------------------------------------------------------------*/
/*Collections*/
/*-----------------------------------------------------------------*/

/***************************************/
globalObj.Collections.PostsCollection = Backbone.Collection.extend({
    model : globalObj.Models.PostModel,
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
globalObj.Collections.NotificationsCollection = Backbone.Collection.extend({
    model : globalObj.Models.NotificationModel,
    initialize : function() {
        //console.log('Notifications collection Constructor');
        this.url = "notification";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
globalObj.Collections.UsersCollection = Backbone.Collection.extend({
    model : globalObj.Models.UserModel,
    initialize : function() {
        //console.log('Users collection Constructor');
        this.url = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });

    }
});
/***************************************/
globalObj.Collections.GroupsCollection = Backbone.Collection.extend({
    model : globalObj.Models.GroupModel,
    initialize : function() {
        //console.log('Groups collection Constructor');
        this.url = "group";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
globalObj.Collections.VersionsCollection = Backbone.Collection.extend({
    model : globalObj.Models.VersionModel,
    url : "version",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Versions Collection Constructor');
    }
});
/***************************************/
globalObj.Collections.CommentsCollection = Backbone.Collection.extend({
    model : globalObj.Models.CommentModel,
    url : "comment",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
/***************************************/
globalObj.Collections.ConceptsCollection = Backbone.Collection.extend({
    model : globalObj.Models.ConceptModel,
    url : "concept",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});
/***************************************/
globalObj.Collections.KnowledgesCollection = Backbone.Collection.extend({
    model : globalObj.Models.KnowledgeModel,
    url : "knowledge",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});    
/***************************************/
globalObj.Collections.LinksCollection = Backbone.Collection.extend({
    model : globalObj.Models.LinkModel,
    url : "link",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
}); 
/***************************************/
globalObj.Collections.TagsCollection = Backbone.Collection.extend({
    model : globalObj.Models.TagModel,
    url : "tag",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});     
/***************************************/
globalObj.Collections.PermissionsCollection = Backbone.Collection.extend({
    model : globalObj.Models.PermissionModel,
    url : "permission",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});  
/***************************************/
globalObj.Collections.ProjectsCollection = Backbone.Collection.extend({
    model : globalObj.Models.ProjectModel,
    url : "project",
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        //console.log('Comments Collection Constructor');
    }
});  
