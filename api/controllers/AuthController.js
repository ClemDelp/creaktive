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
 
				res.redirect('/');
				return;
			});
		})(req, res);
	},

	openChannels : function(req,res){
		console.log("Suscribing");
		Permission.subscribe(req.socket);
		Permission.find({
			id_user : req.session.passport.user
		}).done(function (err, permissions){

			_.each(_.pluck(permissions, "id_project"), function (id_project){
				req.socket.join(id_project)
			})
		})

		res.send({msg:"Channels opened"});
		


	},
 
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
 
};
module.exports = AuthController;