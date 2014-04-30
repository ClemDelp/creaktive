
module.exports = function(req, res, next) {
 
	'use strict';


	var project_id = req.session.currentProject.id;

	Permission.find({
		user_id : req.session.user.id,
		project_id : project_id
	}).done( function (err, perm){
		if(err) next(err);
		if(perm.length !== 0){
			console.log(perm)
			if (perm[0].right == "admin") return next();
			else res.send({err : "Only project administrators can manage users" });
		} 
		else res.send({err : "You are not permitted to perform this action" });
	})

 
};