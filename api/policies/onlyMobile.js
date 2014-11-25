module.exports = function(req, res, next) {
 
	'use strict';

	User.findOne(req.session.user.id).done(function(err, user){
		try{
		   	if(user.onlyMobile == true) res.redirect('/mobileInterface');
			else return next();
		}catch(err){
			return next();
		}
	});
};