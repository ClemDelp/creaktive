



module.exports = function(req, res, next) {
 
	'use strict';

	// Pour l'instant tout le monde est autorisé sur tous les projets

	Project.find().done(function (err, projects){
		req.session.allowedProject = _.pluck(projects, "id");
		return next();
	})


	// Quand on mettra les vraies permissions en place

	// Permission.find({
	// 	id_user : req.session.passport.user
	// }).done(function (err, permissions){
	// 	req.session.allowedProject = _.pluck(permissions, "id_project");
	// 	return next();
	// });
 
}