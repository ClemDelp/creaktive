/*
* 	Vérifie que l'utilisateur est administrateur du projet
*	Appel :
*		- quand un projet modifié/supprimé
*		- quand une présentation est créée
*/


module.exports = function(req, res, next) {
 
	'use strict';

	if(_.indexOf(req.session.permissions.admin, req.body.project) > -1){
		return next();
	}else{
		return res.send({err : "Only project administrator can perform this action"});
	};



};