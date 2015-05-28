/*
* 	Vérifie que l'utilisateur à les droits d'écriture sur un projet
*	Appel :
*		- Concept, Knowledge, Link, Poche créé/edité/supprimé
*		- Présentation éditée
*/

module.exports = function(req, res, next) {
 
	'use strict';

	//console.log(req.body.project)

	if(_.indexOf(req.session.permissions.rw, req.body.project) > -1 || 
		_.indexOf(req.session.permissions.admin, req.body.project) > -1|| 
		_.indexOf(req.session.permissions.public, req.body.project) > -1 ){
		return next();
	}else{
		return res.send({err : "You don't have the right to perform this action"});
	};


};