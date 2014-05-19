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

global.Models.CKObject = Backbone.Model.extend({
    defaults : {
        id:"",
        user: "",
        type : "",
        title : "",
        content : "",/*use for url post type*/
        tags : [],
        comments: [],
        date : "",
        date2: "",
        attachment: "",
        color: "#C0392B",
        members:[],
        attachment:[],
        top : "",
        left:"",
        project:""
    },
    parse : function(serverObj){
        serverObj.comments = new global.Collections.Comments(serverObj.comments);
        serverObj.members = new global.Collections.UsersCollection(serverObj.members);
        return serverObj;
    },
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
global.Models.Knowledge = global.Models.CKObject.extend({
    initialize : function Post() {
        this.urlRoot = "knowledge";
        this.set({type : "knowledge"});
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.ConceptModel = global.Models.CKObject.extend({
    initialize : function Comment() {
        this.urlRoot = "concept";
        this.set({
            type : "concept"
        });
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Poche = global.Models.CKObject.extend({
    initialize : function Poche() {
        //console.log('Poche Constructor');
        this.urlRoot = "poche";
        this.set({type : "category"});
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
global.Models.Comment = Backbone.Model.extend({
    model: this,
    defaults : {
        id:"",
        user : "",
        date : "",
        content : "",
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        //this.urlRoot = "comment";
        //console.log('Comment Constructor');
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
        img : "",
        color : "",
        tags: []
    },
    initialize : function User() {
        //console.log('User Constructor');
        this.urlRoot = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
});
/*-----------------------------------------------------------------*/
/*Model*/
/*-----------------------------------------------------------------*/
global.Models.ProjectModel = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "no projects",
        conceptsMapJson : {},
        date : getDate()
    },
    initialize : function Doc() {
        //console.log('Project Constructor');
        this.urlRoot = "project";
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
        object : "",
        content : "",//description de la notification: "mise à jour sur le post"
        to : "",//cible: projet, post, document, ...
        from : "",//Qui est à l'origine: utilisateur, mise à jour, ...
        date : getDate(),
        project_id : "",
        read : ""
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
        knowledge : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "link";
        //console.log('Concept Constructor');
    }
});

