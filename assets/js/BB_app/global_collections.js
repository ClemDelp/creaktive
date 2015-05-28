/***************************************/
global.Collections.CKLinks = Backbone.Collection.extend({
    model : global.Models.CKLink,
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        this.url = "link";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        if(model.project == global.models.currentProject.get('id')){
            global.collections.Links.add(new global.Models.CKLink(model)) //global.eventAggregator.trigger("link:create",new global.Models.CKLink(model),"server");
        } 
    },
    serverUpdate : function(model){
        //global.eventAggregator.trigger(model.id+"_server",model);
    },
    serverRemove : function(model){
        if(model.project == global.models.currentProject.get('id')){
            global.collections.Links.remove(new global.Models.CKLink(model));
            // global.eventAggregator.trigger("link:remove",new global.Models.CKLink(model),"server");
        } 
    }
});
/////////////////////////////////////////////////////////////////////
global.Collections.Elements = Backbone.Collection.extend({
    model : global.Models.Element,
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        this.url = "element";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        if(model.project == global.models.currentProject.get('id')){
            global.collections.Elements.add(new global.Models.Element(model))
            //global.eventAggregator.trigger("model:create",new global.Models.Elementrs(model),"server");
        } 
    },
    serverUpdate : function(model){
        if(model.project == global.models.currentProject.get('id')){
            var element = global.collections.Elements.get(model.id);
            element.set(model)
            // global.eventAggregator.trigger(model.id+"_server",model);  
        } 
    },
    serverRemove : function(model){
        if(model.project == global.models.currentProject.get('id')) global.collections.Elements.remove(new global.Models.Element(model))//global.eventAggregator.trigger("model:remove",new global.Models.Elementrs(model),"server");
    }
});
/***************************************/
global.Collections.News = Backbone.Collection.extend({
    model : global.Models.News,
    initialize : function() {
        this.url = "news";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
}); 
/***************************************/
global.Collections.Comments = Backbone.Collection.extend({
    model : global.Models.Comment,
    comparator: function(m){
        return -m.get('date2');
    },
    initialize : function() {
        this.url = "comment";
        this.bind("error", function(model, error){
            console.log( error );
        });
        _.bindAll(this, 'serverCreate');
        this.ioBind('create', this.serverCreate, this);
    },
    serverCreate : function(model){
        if(model.project == global.models.currentProject.get('id')) global.collections.Comments.add(new global.Models.Comment(model));
    },
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
        _.bindAll(this, 'serverCreate','serverUpdate','serverRemove');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        console.log("user created")
    },
    serverUpdate : function(modelServer){
        //if(global.models.current_user.get('id') == modelServer.id) global.models.current_user.set(modelServer,{silent:true})
        var model = global.collections.Project_users.get(modelServer.id);
        if(model) model.set({
            top:modelServer.top,
            left:modelServer.left,
            location:modelServer.location
        });
    },
    serverRemove : function(model){
        console.log("user removed")
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
    serverCreate : function(model){
        if(model.project == global.models.currentProject.get('id')){
            var model = new global.Models.NotificationModel(model);
            // model.set({read : _.union(model.get('read'),global.models.current_user.get('id'))});
            // model.save();
            global.collections.Notifications.add(model);
            global.eventAggregator.trigger("notification:add",model,"server");// for update local history    
        }
    }
});
/***************************************/
global.Collections.LocalHistory = Backbone.Collection.extend({
    model : global.Models.Action,
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
/***************************************/
global.Collections.Attachments = Backbone.Collection.extend({
    model : global.Models.Attachment,
    initialize : function() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
}); 