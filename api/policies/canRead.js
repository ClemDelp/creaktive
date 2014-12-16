/*
* 	Vérifie que l'utilisateur à les droits de lecture sur un projet
*	Appel :
*		- quand Concept, Knowledge, Link, Poche fetché
*/

module.exports = function(req, res, next) {
 
	'use strict';

	if(_.indexOf(req.session.permissions.admin, req.body.project) > -1 ||
		_.indexOf(req.session.permissions.rw, req.body.project) > -1 ||
		_.indexOf(req.session.permissions.r, req.body.project) > -1){
		return next();
	}else{
		return res.send({err : "You have no permission on this project"});
	};
};