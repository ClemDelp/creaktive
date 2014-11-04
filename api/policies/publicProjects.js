module.exports = function(req, res, next) {
 
	'use strict';

	req.session.publicProjects = [];
	try{
		Project.find({status:"public"}).done(function(err,projects){
			if(err) res.send(err);
			req.session.publicProjects = _.pluck(projects,"id");
			return next();
		});	
	}catch(err){
		res.redirect('/login');
	}
	 
};