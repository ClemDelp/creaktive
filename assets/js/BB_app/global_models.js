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
        css_auto : "",
        css_manu : "",
        inside : "",
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
        user        : "",// id
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
global.Models.Action = Backbone.Model.extend({
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