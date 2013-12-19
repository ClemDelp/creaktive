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
        pw:"",
        tags: []
    },
    initialize : function User() {
        //console.log('User Constructor');
        this.urlRoot = "user";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    parse : function(model){

        return model;
    }
});
/////////////////////////////////////////////////////////////////////
/*Explorer*/
/////////////////////////////////////////////////////////////////////
global.Models.Knowledge = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "",
        content : "",
        user : "",
        date : "",
        color : "",
        tag : []
    },
    initialize : function Knwoledge() {
        console.log('Knowledge Constructor');
        this.urlRoot = "knowledge";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    addTag : function(tag){
        console.log("Add a tag to the model knowledge");
        this.tag.unshift(tag);
        /*this.save();*/
    },
    removeTag : function(tag){
        console.log("Remove knowledge model tag");
        var index = this.tag.indexOf(tag);

        /*this.save();*/
    }
});
/***************************************/
global.Models.Poche = Backbone.Model.extend({
    defaults : {
        id : guid(),
        title : "",
        user : "",
        date : ""
    },
    initialize : function Poche() {
        console.log('Poche Constructor');
        this.urlRoot = "poche";
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/////////////////////////////////////////////////////////////////////
/*Timela*/
/////////////////////////////////////////////////////////////////////
global.Models.Timeline = Backbone.Model.extend({
    defaults : {
        id:"",
        knowledge : "",
        posts : [],
        date : ""
    },
    initialize : function Timeline() {
        console.log('Timeline Constructor');
        this.urlRoot = "timeline";
        //this.urlRoot = "version";
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    addPost : function(post){ 
        this.get('posts').push(post);
        this.save();
    },
    removePostByID : function(id_post){ 
        array = this.get('posts');
        array.forEach(function(post){
            if(post.id == id_post){  
                array.splice(array.indexOf(post),1)
            }        
        });        
        this.save();
    }
});
/***************************************/
global.Models.Post = Backbone.Model.extend({
    defaults : {
        id:"",
        user: "",
        content : "",/*use for url post type*/
        tags : [],
        comments:[],
        date : "",
        date2: ""
    },
    initialize : function Post() {
        console.log('Post Constructor');
        /*this.urlRoot = "post";*/
        this.bind("error", function(model, error){
            console.log( error );
        });
    },
    addComment : function(com){ 
        this.get('comments').push(com);
        //this.save();
    },
    removeComment : function(com){ 
        unset_foireux(this.get('comments'),com);
        //this.save();
    }
});
/***************************************/
global.Models.Comment = Backbone.Model.extend({
    model: this,
    defaults : {
        user : "",
        date : "",
        content : "",
        post : ""
    },
    setText : function(value) {this.set({ text : value }); },
    initialize : function Comment() {
        //this.urlRoot = "comment";
        //console.log('Comment Constructor');
    }
});
/***************************************/