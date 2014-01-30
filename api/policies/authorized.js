// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

	Permission.find({
		user_id : req.session.user.id,
		project_id : req.query.projectId
	}).done( function (err, perm){
		console.log(req.session.user.id)
		console.log(req.query.projectId)
		if(err) next(err);
		if(perm.length !== 0) next();
		else res.redirect("/")
	})

	
 
};