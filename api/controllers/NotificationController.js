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
    Permission.find({
    }).done(function(err, permissions){
      var authorized_projects = _.pluck(permissions, 'project_id');
      Notification.find({
        project_id : authorized_projects
      }).done(function(err, notifications){
        if(err) res.send(err);
        res.send(notifications );
      });
    })

  },

  update : function(req, res){
  	Notification.findOne(req.body.params.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Notification.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Notification.create(req.body.params).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
  


};
