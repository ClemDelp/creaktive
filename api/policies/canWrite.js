// We use passport to determine if we're authenticated
module.exports = function(req, res, next) {
 
	'use strict';

	var project_id = "";
	if(req.session.currentProject) project_id = req.session.currentProject.id;
	else if (req.query.projectId) project_id = req.query.projectId
	else if(req.body.params.projectId) project_id = req.body.params.project;

	Permission.find({
		user_id : req.session.user.id,
		project_id : project_id
	}).done( function (err, perm){
		if(err) next(err);
		if(perm.length !== 0){
			if (perm[0].right == "rw" || perm[0].right == "admin") next();
			else res.send({err : "You have read-only permission" });
		} 
		else res.send({err : "You are not permitted to perform this action" });
	})

	
 
};