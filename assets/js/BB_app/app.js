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
  // Objects
  currentUser : {},
  currentProject : {},
  init: function (callback) {
    /*Init*/
    console.log("global object loading...");
    /*Models*/
   currentUser = new this.Models.UserModel();
   currentProject = new this.Models.ProjectModel();
    /*Collections*/
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    /*Fetch*/
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

    callback();
      
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// CONCEPTS PART
/////////////////////////////////////////////////////////////////////////////////////////////
var concepts = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Objects
  eventAggregator : {},


  init: function () {
    /*Init*/
    console.log("concepts loading...");
    _this = this;
    _.extend(this.eventAggregator, Backbone.Events);
    /*views*/
    this.views.MapView = new this.Views.MapView({
      currentUser : new global.Models.UserModel(),
      currentProject : new global.Models.ProjectModel({}),
      collection : global.collections.Concepts,
      eventAggregator : this.eventAggregator
    });

    this.views.KnowledgeView = new this.Views.KnowledgeView({
      concepts : global.collections.Concepts,
      eventAggregator : this.eventAggregator
    });


    /*Loads*/
    //this.views.MapView.render();
    this.views.KnowledgeView.render();
  }
}

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

      concepts.init();
     
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