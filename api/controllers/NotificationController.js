/**
 * NotificationController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  getMore : function(req,res){
    var limit = req.body.limit;
    var project_id = req.body.project_id;

    Notification.find()
    .where({project_id : project_id})
    .where({read : req.session.user.id})
    .sort('comparator DESC')
    .limit(limit)
    .done(function(err,notifications){
      if(err) res.send(err);
      res.send(notifications)

    });

  },

  
  find : function (req,res){
    
    if(req.body.params.projectId){
    Notification.find({
      project_id : req.session.currentProject.id
    }).done(function(err,notifications){
      if(err) res.send(err);
    
        res.send(notifications)
    });
  }else{
        Notification.find({
    }).done(function(err,notifications){
      if(err) res.send(err);  
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
    Notification.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        Notification.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
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

  notificationview : function(req,res){
    sails.config.bootstrapdata.bootstrapmanager(req,res);
  },




};
