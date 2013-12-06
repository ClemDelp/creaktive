/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var passport = require('passport');
 
var AuthController = {
 
	login: function(req, res) {
		res.view();
	},
 
	process : function(req, res) {
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				console.log("Login error")
				res.redirect('/login');
				return;
			}
			req.logIn(user, function(err) {
				if (err) {
					res.send(err);
					return;
				}
 
				res.redirect('/manager');
				return;
			});
		})(req, res);
	},

	getCurrentUser : function(req, res){
		if(req.user){
			res.send(req.user);
		}else{
			console.log("User not found");
			res.send({
		      name:"Timela user",
		      signature:"Your personnal signature here",
		      desc:"Your personnal description here",
		      img:"assets/img/default-user-icon-profile.png"
			})
		}
		
	},
 
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
 
};
module.exports = AuthController;