var Sails = require('sails'),  
    sinon = require('sinon'),
    assert = require('assert'),
    request = require('supertest');

var app, projectController;

// Gets run before each test
before(function beforeControllerTest(done) {

  // Lift Sails and start the server
  Sails.lift({

    log: {
      level: 'error'
    },

  }, function(err, sails) {
  	if(err) return console.log(err)

      // Instantiates new sails application
    app = sails;

    // Instantiates controller
    projectController = app.controllers.ProjectController;

    // Lets testing framework know async call is done
    done(err, sails);
  });
});

// Gets run after each test
after(function afterControllerTest(done){

  // Destroys application
  app.lower(done);

});

// TESTS
describe('ProjectController', function() {

  describe('#create()', function() {
    it('creates a new project', function (done) {
      request("http://localhost:1337")
        .get('/project/tutu')
        .send()
        .end(function(err,res){
        	if(err) return console.log(err);
        	console.log(res.body);
        	done();
        });
        
    });
  });

});