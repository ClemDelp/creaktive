/*-----------------------------------------------------------------*/
/*Model*/
/*-----------------------------------------------------------------*/
global.Models.ProjectModel = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "no projects",
        date : getDate(),
        permissions : []
    },
    initialize : function Doc() {
        //console.log('Project Constructor');
        this.urlRoot = "project";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    addDocument : function(){
        console.log("Add a document");
    }
});
/***************************************/
global.Models.PostModel = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "no post",
        date:getDate(),
        user:"",
        versions:[],
        comments:[]
    },
    initialize : function Doc() {
        //console.log('Document part Constructor');
        this.urlRoot = "post";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    addVersion : function(version){ 
        this.get('versions').push(version);
    },
    addComment : function(com){ 
        this.get('comments').push(com);
    },
    removeComment : function(com){ 
        unset_foireux(this.get('comments'),com);
    },
});

/***************************************/
global.Models.NotificationModel = Backbone.Model.extend({
    defaults : {
        id:"",
        type:"",
        content : "",//description de la notification: "mise à jour sur le post"
        to : "",//cible: projet, post, document, ...
        from : "",//Qui est à l'origine: utilisateur, mise à jour, ...
        date : getDate(),
        state : ""
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
global.Models.UserModel = Backbone.Model.extend({
    defaults : {
        name : "",
        email : "",
        img : "img/default-user-icon-profile.png",
        color : "",
        pw:"",
        tags: []
    },
    initialize : function Doc() {
        //console.log('User Constructor');
        this.urlRoot = "user";
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
        user : "",
        id_project : ""
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
global.Models.VersionModel = Backbone.Model.extend({
    defaults : {
        id:"",
        post: "",//id du post pere
        user: "",
        content : "",/*use for url post type*/
        type: "text",/*text, url, img, ...*/
        date : getDate(),
    },
    initialize : function Post() {
        //console.log('Version Constructor');
        this.urlRoot = "version";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});

/***************************************/
global.Models.CommentModel = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        user : '',
        date : getDate(),
        content : "",
        id_post : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "comment";
        //console.log('Comment Constructor');
    }
});
/***************************************/
global.Models.ConceptModel = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        title : "",
        user : "",
        date : getDate(),
        content : "",
        color : "",
        id_father : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "concept";
        //console.log('Concept Constructor');
    }
});
/***************************************/
global.Models.KnowledgeModel = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        title : "",
        user : "",
        date : getDate(),
        content : "",
        color : "",
        id_tags : "",
        id_post : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "knowledge";
        //console.log('Concept Constructor');
    }
});
/***************************************/
global.Models.LinkModel = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        user : "",
        date : getDate(),
        id_c : "",
        id_k : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "link";
        //console.log('Concept Constructor');
    }
});
/***************************************/
global.Models.TagModel = Backbone.Model.extend({
    model: this,
    defaults : {
        id :'',
        user : "",
        date : getDate(),
        title : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        this.urlRoot = "link";
        //console.log('Concept Constructor');
    }
});

