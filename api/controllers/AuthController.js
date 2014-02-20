/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var passport = require('passport');
var xss = require('node-xss').clean;
 
var AuthController = {


	register : function(req,res){
	    if(req.query.id){
	    	User.findOne(req.query.id).done(function(err, user){
	    		req.session.pendingUser = user;
	    		res.view({user : user});
	    	})
	    	
	    }else {
	    	res.send("You are not auhtorized to perform this action")
	    }
	},

	processRegistration : function(req,res){
		console.log(req.body);
		if(req.body.password !== req.body.confirmPassword) res.send("passwords must match")
		User.findOne(req.session.pendingUser.id).done(function(err, user){
			delete user.pw;
			user.pw = req.body.password;
			user.email = req.body.email;
			user.name = req.body.username;
			user.confirmed = true;
			user.img = req.body.image;
			user.hashPassword(user, function(err, user){
							user.save(function(err, user){
				if(err) console.log(err)
				delete req.session.pendingUser;
				res.redirect("/login");
			});
			})


		})


		
	},
 
	login: function(req, res) {
		res.view();
	},
 
	process : function(req, res) {
		req.body = xss(req.body);
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
		res.redirect('/login');
	}
 
};
module.exports = AuthController;