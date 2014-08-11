module.exports = function(req, res, next) {

	'use strict';

	var today = Date.now()
	var date_limit = process.env.USERS_LIMIT ;

	if(today>date_limit) return res.send({err : "Your subscription plan is over"});
	else return next();


	
}