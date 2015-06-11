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
    newLink : function(source,target,silent){
    var silent_event = false;
    if(silent) silent_event = silent;
    //////////////////
    // si ya une boucle infinie avec ce nouveau lien
    var new_cklink = new global.Models.CKLink({
      id :guid(),
      user : global.models.current_user.get('id'),
      date : getDate(),
      source : source.get('id'),
      target : target.get('id'),
      project : global.models.currentProject.get('id')
    });
    new_cklink.save();
    // On l'ajoute à la collection
    global.collections.Links.add(new_cklink,{silent : silent});   
    // rules sur les links
    rules.new_link_rules(new_cklink,source,target);

    return new_cklink; 
    
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
    newElement : function(type,title,top,left,pos){
    // title
    var title = title;
    //if(title == "") title = "new "+type;
    // CSS definition
    var css = global.css_transparent_element;
    // Father definition
    // var father_id = father;
    // if(father != "none"){
    //     father_id = father.get('id');
    // }
    // Type definition
    if(type == "concept") css = global.css_concept_default;
    else if(type == "knowledge") css = global.css_knowledge_default;
    else css = global.css_poche_default;
    // On crée l'object
    var new_element = new global.Models.Element({
        id : guid(),
        date : getDate(),
        type : type,
        id_father: "none",//father_id
        top : top,
        left : left,
        project: global.models.currentProject.get('id'),
        title: title,
        user: global.models.current_user.get('id'),
        css : css,
        visibility : true
    });
    new_element.save();
    // On ajoute le model à la collection
    global.collections.Elements.add(new_element,{from:"client"});
    // Set last model
    try{
      bbmap.views.main.setLastModel(new_element,'addModelToView');
      //joyride
      setTimeout(function(){
          bbmap.views.main.startJoyride(new_element.get('id'))
          console.log('startjoyrid')
      },800);  
    }catch(err){}
    
    return new_element;
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