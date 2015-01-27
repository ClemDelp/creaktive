/////////////////////////////////////////////////////////////////////
/*Explorer*/
/////////////////////////////////////////////////////////////////////
global.Models.File = Backbone.Model.extend({
    defaults : {
        id : "",
        name : "",
        path : "",
    },

});
/***************************************/
global.Models.Backup = Backbone.Model.extend({
    defaults : {
        id : "",
        knowledges_collection : "",
        concepts_collection : "",
        categories_collection : "",
        cklinks_collection : "",
        date : "",
        date2 : "",
        project_id : ""
    },
    initialize : function Poche() {
        this.urlRoot = "backup";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Filter = Backbone.Model.extend({
    defaults : {
        id : "",
        type : "",
        model : ""
    },
    initialize : function Poche() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
/***************************************/
global.Models.Element = Backbone.Model.extend({
    defaults : {
        id:"",
        user: "",
        type : "",
        title : "",
        content : "",
        comments: [],
        date : "",
        date2: "",
        attachment: "",
        color: "#C0392B",
        attachment:[],
        id_father: "",
        top : "",
        left:"",
        project:"",
        status : "private",
        css : "",
        displayChildrens : true,
        visibility : "show"
    },
    initialize : function Element() {
        this.urlRoot = "element";
        //this.set({type : "knowledge"});
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.ProjectModel = Backbone.Model.extend({
    initialize : function Doc() {
        //console.log('Project Constructor');
        this.urlRoot = "project";
        this.set({type : "project"});
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});
/***************************************/
global.Models.News = Backbone.Model.extend({
    defaults : {
        id          : "",
        project     : "",//id
        attachedTo  : "",// id
        user        : "", // id
    },
    initialize : function News() {
        this.urlRoot = "news";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});
/***************************************/
global.Models.Comment = Backbone.Model.extend({
    model: this,
    defaults : {
        id:"",
        project : "",//id
        attachedTo : "",// id of element
        user : "", // id
        date : "",
        content : "",
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "comment";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Attachment = Backbone.Model.extend({
    defaults : {
        id : "",
        name : "",
        path : "",
        url : "",
        user : "", // user_id
        date : "",
        project : "", // project id
        attachedTo : ""// id of element
    },
    initialize : function Poche() {
        this.urlRoot = "attachment";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/////////////////////////////////////////////////////////////////////
/*Manager*/
/////////////////////////////////////////////////////////////////////
global.Models.User = Backbone.Model.extend({
    defaults : {
        id:"",
        name : "",
        email : "",
        img : "img/default-user-icon-profile.png",
        color : "",
        tags: [],
        top : "",
        left : "",
        status : "",
        location : "",
        project : "",
        onlyMobile : false
    },
    initialize : function User() {
        //console.log('User Constructor');
        this.urlRoot = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});
/***************************************/
global.Models.NotificationModel = Backbone.Model.extend({
    defaults : {
        id:"",
        type:"",
        object : "",// concept / knowledge / poche / clink / ...
        action : "",// create / update / remove
        content : "",//description de la notification: "mise à jour sur le post"
        to : "", // new model version
        old : "", // old model version
        user : "",// Qui est à l'origine: utilisateur, mise à jour, ...
        date : getDate(),
        project : "",
        attachedTo : "",
    },
    initialize : function Doc() {
        //console.log('Notification part Constructor');
        this.urlRoot = "notification";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Action = Backbone.Model.extend({
    defaults : {
        id:"",
        object : "",// concept / knowledge / poche / clink / ...
        action : "",// create / update / remove
        to : "",// model
        old : "",
        date : getDate(),
        project_id : ""
    },
    initialize : function Action() {
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.PermissionModel = Backbone.Model.extend({
    defaults : {
        id : "",
        right : "",
        date:getDate(),
        user_id : "",
        project_id : ""
    },
    initialize : function Doc() {
        //console.log('User Constructor');
        this.urlRoot = "permission";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.GroupModel = Backbone.Model.extend({
    defaults : {
        id:'',
        title : "",
        users : []
    },
    initialize : function Doc() {
        //console.log('Group Constructor');
        this.urlRoot = "group";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});

/***************************************/
global.Models.UserGroupModel = Backbone.Model.extend({
    defaults : {
        id:'',
        group_id : "",
        user_id : ""
    },
    initialize : function Doc() {
        //console.log('Group Constructor');
        this.urlRoot = "usergroup";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});
/***************************************/
global.Models.CKLink = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        user : "",
        date : getDate(),
        concept : "",
        knowledge : "",
        source : "",
        target : "",
        project : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "link";
        //console.log('Concept Constructor');
    }
});

/***************************************/
global.Models.Screenshot = Backbone.Model.extend({
    defaults : {
        id : "",
        src : "",
        project_id : "",
        date : ""
    },
    initialize : function Poche() {
        this.urlRoot = "screenshot";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Presentation = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "",
        data : "",
        project_id : "",
        user_name : "",
    },
    initialize : function Poche() {
        this.urlRoot = "presentation";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
