module.exports = function(req, res, next) {
 
	'use strict';

	req.session.allowedProjects = [];

	User.findOne(req.session.user.id).done(function(err, user){
		try{
			//If it is a super user, he can access to all projects
			if(user.super){
				Project.find().done(function(err, projects){
					req.session.allowedProjects = _.pluck(projects, "id");
					return next();
				})
			//We check all permissions		
			}else{
			   	Permission.find({user_id:req.session.user.id}).done(function(err,permissions){
					if(err) res.send(err);
					req.session.allowedProjects = _.pluck(permissions,"project_id");
					return next();
				});

			}
		}catch(err){
			res.redirect('/login');
		}
	})
 
};