module.exports = function(req, res, next) {
 
	'use strict';

	req.session.allowedProjects = [];

	User.findOne(req.session.user.id).done(function(err, user){
		try{
		   	Permission.find({user_id:req.session.user.id}).done(function(err,permissions){
				if(err) res.send(err);
				req.session.allowedProjects = _.pluck(permissions,"project_id");
				return next();
			});
		}catch(err){
			res.redirect('/login');
		}
	})
 
};