module.exports = {

	checkPermissions : function(cb){
		req.session.permissions = {};
		Permission.find({user_id : req.session.user.id}).done(function(err, permissions){
			if(err) cb(err);
			permissions = _.indexBy(permissions, 'right');
			req.session.permissions.all = _.pluck(permissions,"project_id");
			req.session.permissions.admin = _.pluck(permissions["admin"],"project_id");
			req.session.permissions.rw = _.pluck(permissions["rw"],"project_id");
			req.session.permissions.admin = _.pluck(permissions["r"],"project_id");
			req.session.permissions.admin = _.pluck(permissions["smartphone"],"project_id");
			cb();
		})
	}



}