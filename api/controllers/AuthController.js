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
				console.log(req.user)
 				req.session.user = req.user;
				res.redirect('/');
				return;
			});

		})(req, res);
	},


	openChannels : function(req,res){
		_.each(req.session.allowedProject, function(project){
			req.socket.join(project)
		})		
		res.send({msg:"Channels opened", channels : req.session.allowedProject});


		
	},
 
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
 
};
module.exports = AuthController;