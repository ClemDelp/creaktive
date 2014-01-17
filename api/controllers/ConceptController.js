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


notificate : function(req, res){

}



};
