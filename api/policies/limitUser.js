module.exports = function(req, res, next) {
	'use strict';

	var user_limit = process.env.USERS_LIMIT || 100000;

	User.find().done(function(err,users){
		if(users.length >= user_limit) return res.send({err : "You have reach your user limit"});
		else return next();
	});

}