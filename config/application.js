var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcrypt');
 
// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
	User.findOne(id).done(function(err, user){
		done(err, user);
	})

});


 
// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object. In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
 
function(username, password, done) {
	// asynchronous verification, for effect...
	process.nextTick(function() {
 
		// Find the user by username. If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// indicate failure and set a flash message. Otherwise, return the
		// authenticated `user`.

			User.find({
				email : username,
			}).done(function(err, users){
				if(err) {
					return done(err);
				};
				if(users.length == 0){
					return done(null, false, {
						message: 'Unknown user ' + username
					});
				};

				for (var i = 0; i < users.length; i++) {
					var user = users[i];
					if(!user.confirmed) return done(null,false, {message : "Not confirmed"})
		        	bcrypt.compare(password, user.pw, function (err, res) {
			          if (!res)
			            return done(null, false, {
			              message: 'Invalid Password'
			            });
						console.log(user)
			          return done(null, user);
			        });

				};
			})
		



	});
}));
 
module.exports = {
 
	// SNIP ...
 
	// Custom express middleware - we use this to register the passport middleware
	express: {
		customMiddleware: function(app) {
			app.use(passport.initialize());
			app.use(passport.session());
		}
	}
 
};