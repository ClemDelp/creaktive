/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

 var memwatch = require('memwatch');

module.exports.bootstrap = function (cb) {

	sails.config.appName =  "CreaKtive";


	memwatch.on('leak', function(info) { 
		console.log("MEMORY LEAK");
		console.log(info)

	 });

	memwatch.on('stats', function(stats) { 
		console.log("MEMORY STATS");
		console.log(stats)

	 });


  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};