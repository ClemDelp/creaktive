module.exports = function(req, res, next) {

	
	var project_id = req.body.params.id;

	Permission.find({
		user_id : req.session.user.id,
		project_id : project_id
	}).done( function (err, perm){
		if(err) next(err);
		if(perm.length !== 0){
			if (perm[0].right == "admin") next();
			else res.send({err : "Only project administrators can manage users" });
		} 
		else res.send({err : "You are not permitted to perform this action" });
	})


};