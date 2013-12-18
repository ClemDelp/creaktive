/**
 * Concept
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

	autoPK : false,
  	attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

  	notificate : function(concept, req){
  		/*
  		* Create a Notification and broadcast to the project channel
  		*/
  		Notification.create({
  			type : "ConceptCreated",
  			model : concept
  		}).done(function (err, notification){ 
  			if(err) console.log(err);			
  			req.socket.broadcast.to(concept.id).emit("notification", notification);
  		})
  	}
    
  	},



};
