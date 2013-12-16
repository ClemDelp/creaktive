var Sails = require('sails');
var assert = require('assert');
var chai = require('chai')
  , chaiSpies = require('chai-spies')
  , chaiHttp = require('chai-http')
  , should = chai.should()
  , request = require('superagent');

chai.use(chaiSpies);
chai.use(chaiHttp);
 
/**
 * Before ALL the test bootstrap the server
 */
var app;
 
before(function(done) {
  this.timeout(5000);
  // TODO: Create the database
  // Database.createDatabase.....
 
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      mongo: {
        module: 'sails-mongo',
        host: 'localhost',
        database: 'creaktive-test',
      }
    }
  }, function(err, sails) {
    app = sails;
    done(err, sails);
  });
  
}); 

describe('UserController', function(){
  it("test user controller", function(){
    request.get('/user/create', function(u){
      u.should.be.an('object');
    })
  })
})



after(function(done) {
 
  // TODO: Clean up db
  // Database.clean...
  
  app.lower(done);
 
});