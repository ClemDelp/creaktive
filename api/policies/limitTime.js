module.exports = function(req, res, next) {

	'use strict';

	var today = Date.now()
	var date_limit = process.env.DATE_LIMIT ;
	if(date_limit){
		if(today>date_limit) return res.send({err : "Your subscription plan is over"});
	}
	
	next();


	
}