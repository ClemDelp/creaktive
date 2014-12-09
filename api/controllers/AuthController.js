/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var bcrypt = require('bcrypt');
var passport = require('passport');
var xss = require('node-xss').clean;
 
var AuthController = {

	resetpassword : function(req,res){
		console.log("Loading reset password view")
		res.view();
	},

	processResetPassword : function(req,res){
		console.log("processing reset password")
		var key = ""
		var url = "";

		bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(IdService.guid(), salt, function(err, hash) {
            if(err) return res.send({err:err});
            else{
              key = hash;

		User.find({
			email : req.body.email
		}).done(function(err, users){
			if(err) return res.send(err);
			if(users.length === 0 ){
				return res.send(400,"Email not found")
			}
	      	var user = users[0];
	      	if(req.baseUrl == "http://localhost:1337"){
		        url = req.baseUrl + "/newpassword?id="+user.id+"&k=" + key;
	      	} 
	      	else{
		        var u = req.baseUrl
		        u = u.slice(0, u.lastIndexOf(":"))
		        url = u + "/newpassword?id="+user.id+"&k=" + key;
	      	}

			user.recoveryLink = key;
			user.save(function (err, u) {
				if(err) console.log(err)
				EmailService.sendPasswordRecovery(user.email, url,function(err, msg){
			        if(err) console.log(err)

			      res.redirect("/resetconfirmation")
			      });
			});
		})		

		

		            }
          });
        });
	},

	newpassword : function(req,res){
		req.session.pendingUser = req.query.id;
		req.session.pendingKey = req.query.k;
		res.view();
	},

	processNewPassword : function(req,res){
		User.findOne(req.session.pendingUser).done(function(err, user){
			if(err) return res.send({err:err});

			if(req.session.pendingKey == user.recoveryLink){
				user.pw = req.body.password;
				user.hashPassword(user, function(err, user){
					if(err) return res.send({err:err});
					delete user.recoveryLink;
				
					user.save(function(err, u){
						if(err) return res.send({err:err});
						res.redirect("/login");
					})

				})


			}


			req.session.pendingUser = ""
			req.session.pendingKey = "";
		})
	},

	registernew : function(req,res){
		res.view();
	},

	processRegistrationNew : function(req,res){
		User.create({
			id : IdService.guid(),
			name : req.body.username,
			email : req.body.email,
			confirmed : false,
			pw : req.body.password,
			img : req.body.img || "img/default-user-icon-profile.png",
			admin : true
		}).done(function(err, user){
			if(err) return res.redirect("/newuser");
	      	EmailService.sendNewUserMail(user, function(err, msg){
		        if(err) console.log(err)
	      	});

	      	res.redirect("/confirmation");
		})
	},

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
		if(req.body.password !== req.body.confirmPassword) res.send("passwords must match")
		User.findOne(req.session.pendingUser.id).done(function(err, user){
			delete user.pw;
			user.pw = req.body.password;
			user.email = req.body.email;
			user.name = req.body.username;
			user.confirmed = true;
			user.img = req.body.image || "/img/default-user-icon-profile.png";
			user.hashPassword(user, function(err, user){
			user.save(function(err, user){
				if(err) return res.send({err:err});
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
 				req.session.user = req.user;

 					res.redirect('/');
 					return;

			});

		})(req, res);
	},


	openChannels : function(req,res){

		// req.socket.join("users")
		
		// req.socket.set('user', req.session.user.id, function(args){
		// 	var connectedUsers = []
		// 	for (var socketId in sails.io.sockets.sockets) {
		// 	    sails.io.sockets.sockets[socketId].get('user', function(err, u) {
		// 	        if(err) console.log(err)
		// 	    	connectedUsers.push(u);
		// 	    });
		// 	}
		// 	sails.io.sockets.emit("connectedUsers", _.compact(_.uniq(connectedUsers)));
		// 	req.socket.set('connectedUsers', _.compact( _.uniq(connectedUsers)));

		// })

		// req.socket.on("disconnect", function(){
		// 	console.log("DISCONNECTED")
		// 	req.socket.get('connectedUsers', function(err, connectedUsers){
		// 		var i = connectedUsers.indexOf(req.session.user.id);
		// 		delete connectedUsers[i];
		// 		sails.io.sockets.emit("connectedUsers", _.compact(_.uniq(connectedUsers)));
		// 	});	
		// });


		Permission.find({
			user_id : req.session.user.id
		}).done(function (err, permissions){
			var allowedProject = _.pluck(permissions, "project_id");
			_.each(allowedProject, function(project){
				req.socket.join(project)
			})	
		});
		
	
		
		//res.send({msg:"Channels opened", channels : req.session.allowedProject});
	
	},
 
	logout: function(req, res) {
		req.logout();
		res.redirect('/login');
	}
 
};
module.exports = AuthController;