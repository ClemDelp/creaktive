/**
*	Vérifie que l'utilisateur est administrateur de la plateforme et qu'il a un abonnement en cours
*	Appel :
*		- Quand un projet est créé
*/

module.exports = function(req, res, next) {
 
	'use strict';

	if(req.session.user.platformAdmin){
		var suscribing = new Date(req.session.user.suscribing);
		var today = new Date();
		console.log(suscribing, "***", today)
		if(suscribing > today){
			return next();
		}else{
			return res.send({err: "Your suscribing is over"})
		}
		
	}else{
		return res.send({err: "Only platform administrators can create project"})
	}


};