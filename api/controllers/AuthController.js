/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var passport = require('passport');
 
var AuthController = {

	register : function(req,res){
		res.view();
	},
 
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

		req.socket.join("users")
		req.socket.set('user', req.session.user.id, function(args){
			var connectedUsers = []
			for (var socketId in sails.io.sockets.sockets) {
			    sails.io.sockets.sockets[socketId].get('user', function(err, u) {
			        if(err) console.log(err)
			    	connectedUsers.push(u);
			    });
			}
			sails.io.sockets.emit("connectedUsers", _.compact(_.uniq(connectedUsers)));
			req.socket.set('connectedUsers', _.compact( _.uniq(connectedUsers)));

		})

		req.socket.on("disconnect", function(){
			console.log("DISCONNECTED")
			req.socket.get('connectedUsers', function(err, connectedUsers){
				var i = connectedUsers.indexOf(req.session.user.id);
				delete connectedUsers[i];
				sails.io.sockets.emit("connectedUsers", _.compact(_.uniq(connectedUsers)));
			});	
		});
		
		_.each(req.session.allowedProject, function(project){
			req.socket.join(project)
		})		
		
		//res.send({msg:"Channels opened", channels : req.session.allowedProject});
	
	},
 
	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
 
};
module.exports = AuthController;