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

describe('UserController', function (done){
  it("test user controller", function (done){
    request.post('http://localhost:1337/user')
      .send({name:"michel", password:"michel"})
      .end(function (res){
        res.body.should.not.be.null;
        res.body.should.include.keys("name", "password", "pd");
        done();
      })
  })
})

describe('Routes', function (done) {
  it('GET / should return 200', function (done) {
    request.get('http://localhost:1337/').end(function (res){
      res.should.have.status(200);
      done();
    });
  });
});



after(function(done) {
 
  // TODO: Clean up db
  // Database.clean...
  
  app.lower(done);
 
});