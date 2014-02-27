// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

	Permission.find({
		user_id : req.session.user.id,
		project_id : req.session.currentProject.id
	}).done( function (err, perm){
		if(err) next(err);
		if(perm.length !== 0){
			next();
		} 
		else res.json({err : "You are not permitted to perform this action" });
	})

	
 
};