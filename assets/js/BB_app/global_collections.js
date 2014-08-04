
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
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        global.eventAggregator.trigger("model:create",new global.Models.Poche(model),"server");
    },
    serverUpdate : function(model){
        global.eventAggregator.trigger(model.id,model);
    },
    serverRemove : function(model){
        //this.remove(knowledge.id);
        global.eventAggregator.trigger("model:remove",new global.Models.Poche(model),"server");
    }
    // serverCreate : function(category){
    //     this.add(new global.Models.Poche(category));
    // },
    // serverUpdate : function(model){
    //     model = new global.Models.Knowledge(model);
    //     model = global.Functions.format_ckobject_model(model);
    //     global.eventAggregator.trigger(model.get('id'),model);
    // },
    // serverRemove : function(category){
    //     this.remove(category.id);
    // }
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
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        global.eventAggregator.trigger("model:create",new global.Models.Knowledge(model),"server");
    },
    serverUpdate : function(model){
        global.eventAggregator.trigger(model.id,model);
    },
    serverRemove : function(model){
        global.eventAggregator.trigger("model:remove",new global.Models.Knowledge(model),"server");
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
        _.bindAll(this, 'serverCreate');
        this.ioBind('create', this.serverCreate, this);
        this.ioBind('update', this.serverUpdate, this);
        this.ioBind('remove2', this.serverRemove, this);
    },
    serverCreate : function(model){
        global.eventAggregator.trigger("model:create",new global.Models.ConceptModel(model),"server");
    },
    serverUpdate : function(model){
        global.eventAggregator.trigger(model.id,model);
    },
    serverRemove : function(model){
        //this.remove(knowledge.id);
        global.eventAggregator.trigger("model:remove",new global.Models.ConceptModel(model),"server");
    }
    // serverCreate : function(model){
    //     //this.add(model);
    //     global.eventAggregator.trigger("concept:create",new Backbone.Model(model));
    // },
    // serverUpdate : function(model){
    //     model = new global.Models.Knowledge(model);
    //     model = global.Functions.format_ckobject_model(model);
    //     global.eventAggregator.trigger(model.get('id'),model);
        
    //     global.eventAggregator.trigger("concept:update",model);
    // },
    // serverRemove : function(model){
    //     //this.remove(new Backbone.Model(model));
    //     global.eventAggregator.trigger("concept:remove",new Backbone.Model(model));

    // }
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
        model = new global.Models.NotificationModel(model);
        model.set({read : _.union(model.get('read'),global.models.current_user.get('id'))});
        model.save();
        //this.add(new_notif);
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

/***************************************/
global.Collections.Screenshots = Backbone.Collection.extend({
    model : global.Models.Screenshot,
    initialize : function() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
}); 

/***************************************/
global.Collections.Presentations = Backbone.Collection.extend({
    model : global.Models.Presentation,
    initialize : function() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
}); 