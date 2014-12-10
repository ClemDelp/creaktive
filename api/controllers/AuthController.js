/*jshint node:true */
 
/*---------------------
	:: Auth
	-> controller
---------------------*/
var bcrypt = require('bcrypt');
var passport = require('passport');
var activator = require('activator');
var xss = require('node-xss').clean;

model = {
	find : function(user,cb){
		User.findOne({email:user}).done(function(err, data){
			if(err) return cb(err);
			return data
		});
	},
	save : function(id,data,cb){
		User.update({id:id}, data).done(function(err){
			if(err) cb(err);
		});
	}
};

var mailPort = 465;
var transport = "smtp://creaktive.contact@smtp.gmail.com:465/localhost?secureConnection=true";
var mailTemplatesDir = __dirname + "/../../assets/mailTemplatesDir";
var config = { user : model, transport : transport, templates : mailTemplatesDir, from :"contact@creaktive.fr"};

activator.init(config);
 
var AuthController = {


	registernew : function(req,res){
		res.view();
	},

	processRegistrationNew : function(req,res){
		var today = new Date()
		var suscribing = (new Date(today.setMonth(today.getMonth() + 1))).toUTCString();
		User.create({
			id : IdService.guid(),
			name : req.body.username,
			email : req.body.email,
			confirmed : false,
			pw : req.body.password,
			img : req.body.img || "img/default-user-icon-profile.png",
			platformAdmin : true,
			suscribing : suscribing
		}).done(function(err, user){
			if(err) return res.redirect("/newuser");
			req.session.user = user;
			req.activator = {id:user.id, body : user.id};
			activator.createActivate(req,res,function(){
				res.redirect("/confirmation");
			})
		})
	},

	activate : function(req,res, next){
		activator.completeActivate(req,res,function(){
			res.redirect('activated')
		})
	},

	activated: function(req,res){
		res.view();
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

	logout: function(req, res) {
		req.logout();
		res.redirect('/login');
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
 

 
};
module.exports = AuthController;