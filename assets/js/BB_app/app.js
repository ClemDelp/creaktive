//////////////////////////////////////////////
// Global object
//////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    console.log("global object loading...");
    /*Collections*/
    this.collections.Knowledges = new this.Collections.Knowledges();
    this.collections.Poches = new this.Collections.Poches();
    this.collections.Timelines = new this.Collections.Timelines();
        this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.LinksCollection();
    
    /*Loads*/
    this.collections.Knowledges.fetch({reset: true,complete:function(){}});
    this.collections.Poches.fetch({reset: true,complete:function(){}});
    this.collections.Timelines.fetch({reset: true,complete:function(){}});
    this.collections.Projects.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });
    this.collections.Concepts.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){
        console.log(response)
      },
    });
    this.collections.Links.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){
        console.log(response)
      },
    });

    ///////////////////////////////
    // Variables pour les tests
    ///////////////////////////////
    this.models.current_user = new this.Models.User({id:guid(),name:"clarth",email : "delpuech.clement@gmail.com",img:"assets/img/default-user-icon-profile.png",color:"#FFF",pw:"clem"});
    /*this.models.v1 = new this.Models.Version({user:this.models.current_user,title:"v1",content :"v1 content",tags:[],type:"text",date:getDate(),date2:new Date().getTime()});
    this.models.v2 = new this.Models.Version({user:this.models.current_user,title:"v2",content :"v2 content",tags:[],type:"text",date:getDate(),date2:new Date().getTime()});
    this.models.post1 = new this.Models.Post({title:"no post",knowledge:"",versions:[this.models.v1,this.models.v2],comments:[]});
    this.models.post2 = new this.Models.Post({title:"no post",knowledge:"",versions:[this.models.v1,this.models.v2],comments:[]});
    this.collections.posts = new this.Collections.Posts().add([this.models.post1,this.models.post2]);
*/
    /*this.models.k1 = new this.Models.Knowledge({id:guid(), title : "k1", content : "tagged loutre", user : "clem", date : getDate(), color : "#FFF", tag : ["loutre"]});
    this.models.k2 = new this.Models.Knowledge({id:guid(), title : "k2", content : "tagged lapin", user : "clem", date : getDate(), color : "#FFF", tag : ["lapin"]});
    this.models.k3 = new this.Models.Knowledge({id:guid(), title : "k3", content : "tagged fox", user : "clem", date : getDate(), color : "#FFF", tag : ["fox"]});
    this.models.k4 = new this.Models.Knowledge({id:guid(), title : "k4", content : "tagged fox & lapin", user : "clem", date : getDate(), color : "#FFF", tag : ["fox","lapin"]});
    this.collections.Knowledges.add([this.models.k1,this.models.k2,this.models.k3,this.models.k4]);
    */
    /*this.models.p1 = new this.Models.Poche({id:guid(), title:"loutre", user:"clem", date:getDate()});
    this.models.p2 = new this.Models.Poche({id:guid(), title:"lapin", user:"clem", date:getDate()});
    this.models.p3 = new this.Models.Poche({id:guid(), title:"fox", user:"clem", date:getDate()});
    this.collections.Poches.add([this.models.p1,this.models.p2,this.models.p3]);*/
  }
};
/////////////////////////////////////////////////
var timela = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    console.log('Timela Constructor');
  }
};
/////////////////////////////////////////////////
var explorer = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    console.log('Explorer Constructor');
  }
};
/////////////////////////////////////////////////
var concepts = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    console.log('Concepts Constructor');
  }

};
/////////////////////////////////////////////////
var interface3 = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    console.log('interface3 Constructor');
    /*views*/
    this.views.Main = new this.Views.Main({
      collection:global.collections.Knowledges,
      model:global.models.current_user,
      poches:global.collections.Poches,
      timelines:global.collections.Timelines,
      user:global.models.current_user
    });
    /*Renders*/
    this.views.Main.render();
        
  }
};
/////////////////////////////////////////////////
var interface2 = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},

  init: function () {
    /*Init*/
    console.log('interface2 Constructor');
    /*views*/
    
    /*Renders*/
   
  }
};
/////////////////////////////////////////////////
var interface1 = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},

    // Objects
  
  init: function () {
    /*Init*/
    console.log('interface1 Constructor');
    /*views*/
    
    /*views*/
    this.views.Main = new this.Views.Main({
      currentUser : global.models.current_user,
      currentProject : new global.Models.ProjectModel({}),
      concepts : global.collections.Concepts,
      links : this.collections.Links,
      knowledges : global.collections.Knowledges,
      poches : global.collections.Poches
    });

    /*Renders*/
    this.views.Main.render();

    
  }
};
///////////////////////////////////////////////////
$(document).ready(function () {
  console.log( "CreaKtive DOM loaded!" );
  ////////////////////////////////////////
  Backbone.Model.prototype.toJSON = function() {
    return JSON.parse(JSON.stringify(this.attributes));
  };
  ////////////////////////////////////////
  global.init();
  /*Modules*/
  explorer.init();
  timela.init();
  concepts.init();
  /*Interfaces*/
  interface1.init();
  interface2.init();
  interface3.init();
  ////////////////////////////////////////
  /*activat of "hashchange events's monitoring"*/
  Backbone.history.start();       

});
/////////////////////////////////////////////////////////////////////////////////////////////
// Realtime connection
/////////////////////////////////////////////////////////////////////////////////////////////

function rt (io, callback) {
  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  socket.on('connect', function socketConnected() {
    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {     
      console.log('New comet message received :: ', message);
    });
    console.log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    callback();
  });

  window.socket = socket;

};

