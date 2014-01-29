/**
 * ConceptController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */


 module.exports = {


  find : function (req,res){

    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err)
        res.send(concepts)
    });

  },

  create : function (req,res){
    var c = req.body.params;
    c.project = req.session.currentProject.id;
    console.log(c)
    Concept.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Concept", c.id, function(notification){
          res.send(notification);
      });
      res.send(concept);
    });
  },

  update : function(req, res){
    console.log(req.body.params.id);
    Concept.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        console.log("Concept found");
        Concept.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          
          

          Notification.objectUpdated(req,res,"Concept", c[0].id, function(notification){
            res.send(notification);
          });

          res.send(c[0]);
      });
      }else{
        console.log("Concept not found creating it")
        var concept = req.body.params;
        concept.project = req.session.currentProject.id;
        Concept.create(concept).done(function(err,c){
          if(err) res.send(err);

          Notification.objectCreated(req,res,"Concept", c.id, function(notification){
            res.send(notification);
          });
          res.send(c);
        });
      }
    })
  },


  destroy : function(req,res){
    Concept.findOne(req.body.params.id).done(function(err,concept){
      if(err) console.log(err);
      concept.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  conceptview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      res.view({
        currentUser : JSON.stringify(req.session.user),
        projectTitle : req.session.currentProject.title,
        projectId : req.session.currentProject.id,
        currentProject : JSON.stringify(req.session.currentProject)
      });
    })
    
  },


};
