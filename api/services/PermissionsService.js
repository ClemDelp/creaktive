module.exports = {

	checkPermissions : function(req,cb){
		console.log('check permission')
		req.session.permissions = {};
		Permission.find({user_id : req.session.user.id}).done(function(err, permissions){
			if(err) return cb(err);
			var grouped_permissions = _.groupBy(permissions, 'right');	
			req.session.permissions.all = _.pluck(permissions,"project_id");
			req.session.permissions.admin = _.pluck(grouped_permissions["admin"],"project_id");
			req.session.permissions.rw = _.pluck(grouped_permissions["rw"],"project_id");
			req.session.permissions.r = _.pluck(grouped_permissions["r"],"project_id");
			req.session.permissions.smartphone = _.pluck(grouped_permissions["smartphone"],"project_id");

			cb();
		})
	}



}