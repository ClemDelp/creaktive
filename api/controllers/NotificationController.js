/**
 * NotificationController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  find : function (req,res){
    Notification.find({
    }).done(function(err, notifications){
      if(err) res.send(err);
      res.send(notifications );
    });
  },

  update : function(req, res){
  	Notification.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Notification.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Notification.create(req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
  


};
