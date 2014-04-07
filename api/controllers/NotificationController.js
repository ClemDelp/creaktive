/**
 * NotificationController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  
  find : function (req,res){
    
    if(req.body.params.projectId){
    Notification.find({
      project_id : req.session.currentProject.id
    }).done(function(err,notifications){
      if(err) res.send(err);
      this.notifications = notifications;
      c0 = _.findWhere(notifications, {position : 0});
     
        res.send(notifications)
    });
  }else{
        Notification.find({
    }).done(function(err,notifications){
      if(err) res.send(err);
      this.notifications = notifications;
      c0 = _.findWhere(notifications, {position : 0});
     
        res.send(notifications)
    });
  }

  },

  create : function (req,res){
    var c = req.body.params;
    c.project = req.session.currentProject.id;

    Notification.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Notification", c.id, function(notification){
          res.send(notification);
      });
      res.send(concept);
    });
  },

  update : function(req, res){
    console.log("tutu")
    Notification.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        Notification.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          console.log(c)
          res.send(c[0]);
      });
      }else{
        var concept = req.body.params;
        concept.project = req.session.currentProject.id;
        Notification.create(concept).done(function(err,c){
          if(err) res.send(err);
          res.send(c);
        });
      }
    })
  },


  destroy : function(req,res){
    Notification.findOne(req.body.params.id).done(function(err,concept){
      if(err) console.log(err);
      concept.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },






};
