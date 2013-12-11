/////////////////////////////////////////////////////////////////////////////////////////////
// Global object
/////////////////////////////////////////////////////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (callback) {
    /*Init*/
    console.log("global object loading...");
    /*Models*/
   currentUser = new this.Models.UserModel();
   currentProject = new this.Models.ProjectModel();
    /*Collections*/
    this.collections.Users = new this.Collections.UsersCollection();
    this.collections.Groups = new this.Collections.GroupsCollection();
    this.collections.Permissions = new this.Collections.PermissionsCollection();
    this.collections.Projects = new this.Collections.ProjectsCollection();
    /*Fetch*/
    this.collections.Projects.fetch({
      reset: true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });
    this.collections.Permissions.fetch({
      reset: true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });
    this.collections.Users.fetch({
      reset: true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });

    this.collections.Groups.fetch({
      reset: true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });
    callback();
      
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
// MANAGER PART
/////////////////////////////////////////////////////////////////////////////////////////////
var manager = {
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
    console.log("manager loading...");
    
    /*views*/
    this.views.Users_view = new this.Views.Users_view({
      collection:global.collections.Users
    });
    this.views.Groups_view = new this.Views.Groups_view({
      collection:global.collections.Groups,
      users:global.collections.Users
    });
    this.views.Projects_view = new this.Views.Projects_view({
      collection:global.collections.Projects,
      groups:global.collections.Groups,
      permissions:global.collections.Permissions
    });
    /*Loads*/
    this.views.Projects_view.render();
    this.views.Users_view.render();
    this.views.Groups_view.render();

    /*router initialisation*/
    this.Router_manager = new manager.Router_manager(); 
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Document ready
/////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {

  Backbone.Model.prototype.toJSON = function() {
    return JSON.parse(JSON.stringify(this.attributes));
  };
  // Initialisation de l'managerlication ici
  console.log( "CreaKtive DOM loaded!" );

  rt(io, function(){
    // Globales variables
    global.init(function(){
      ////////////////////////////////////////
      // Global Router
      ////////////////////////////////////////
      manager.init();      

      ////////////////////////////////////////
      /*activat of "hashchange events's monitoring"*/
      Backbone.history.start();
    });

  });

}) ;

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