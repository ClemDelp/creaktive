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
      
    /*Fetch*/

    callback();
      
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
      var toLoad = [];
      var pathname = $(location).attr('pathname').split('/');
      /*Les routes sont à definir ici*/
      if(_.indexOf(pathname,'manager') > -1){
        toLoad.unshift("manager","topbar");
      }
      if(_.indexOf(pathname,'timeline') > -1){
        toLoad.unshift("timela","topbar");
      }
      if(_.indexOf(pathname,'export') > -1){
        toLoad.unshift("export","topbar");
      }
      if(_.indexOf(pathname,'note') > -1){
        toLoad.unshift("note","topbar");
      }
      /*Chargement des modules*/
      // Manager PART
      if(_.indexOf(toLoad,'manager') > -1){
        manager.init();
      }
      // TopBar PART
      if(_.indexOf(toLoad,'topbar') > -1){
        topbar.init();
      }
      // Timela PART
      if(_.indexOf(toLoad,'timela') > -1){
        timela.init();
      }
      // Export PART
      if(_.indexOf(toLoad,'export') > -1){
        exporter.init();
      }
      // Import PART
      if(_.indexOf(toLoad,'note') > -1){
        note.init();
      }
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
    socket.get('/auth/openChannels', function(data){
      console.log(data.msg)
    });
    // Listen for Comet messages from Sails
    socket.on('notification', function messageReceived(message) {     
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