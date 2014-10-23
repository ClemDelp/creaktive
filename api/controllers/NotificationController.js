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
    .limit(limit)
    .done(function(err,notifications){
      if(err) res.send(err);
      res.send(notifications)

    });

  },

  
  find : function (req,res){
    console.log("fetching notifications")
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
    console.log("creating nottification")
    var c = req.body.params;
    c.project = req.session.currentProject.id;

    Notification.create(c).done(function(err, concept){
      if(err) res.send(err);

      res.send(concept);
    });
  },

  update : function(req, res){
    console.log('updating notification')
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
    console.log('destroying notification')
    Notification.findOne(req.body.params.id).done(function(err,concept){
      if(err) console.log(err);
      concept.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  notificationview : function(req,res){
    console.log("Loading notification view")
    BootstrapService.bootstrapmanager(req,res);
  },




};
