var Sails = require("sails");
var chai = require('chai')
var should = chai.should();

before(function(done) {
  // Lift Sails and store the app reference
  require('sails').lift({
	port: 99999,
	 adapters: {
	   default: 'mongo' // should be defined in config/local.js
	 },
    // turn down the log level so we can view the test results
    log: {
      level: 'error'
    },

  }, function(err, sails) {
       // export properties for upcoming tests with supertest.js
       sails.localAppURL = localAppURL = ( sails.usingSSL ? 'https' : 'http' ) + '://' + sails.config.host + ':' + sails.config.port + '';
       // save reference for teardown function
       done(err);
     });

});



 


 
 after(function (done) {
   sails.lower(done);
 });