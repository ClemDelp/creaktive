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
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.LinksCollection();
    
    /*Loads*/
    this.collections.Knowledges.fetch({reset: true,complete:function(){}});
    this.collections.Poches.fetch({reset: true,complete:function(){}});
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
    this.models.current_user = new this.Models.User({id:guid(),name:"clarth",email : "delpuech.clement@gmail.com",img:"img/default-user-icon-profile.png",color:"#FFF",pw:"clem"});
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
      knowledges:global.collections.Knowledges,
      user:global.models.current_user,
      poches:global.collections.Poches
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
  //timela.init();
  explorer.init();
  // concepts.init();
  /*Interfaces*/
  // interface1.init();
  // interface2.init();
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

