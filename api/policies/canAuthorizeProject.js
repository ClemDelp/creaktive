// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

	if(req.session.user.id != req.session.user.id){
		Permission.find({
			user_id : req.session.user.id,
			project_id : req.body.project_id
		}).done( function (err, perm){
			if(err) next(err);
			if(perm.length !== 0) next();
			else res.json(401);
		})
	}
	else{
		next();
	}

	
 
};