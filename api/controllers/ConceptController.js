/**
 * ConceptmapController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 module.exports = {


  find : function (req,res){
    console.log("Fetch concepts");
    if(req.body.params.project){
    Concept.find({
      project : req.body.params.project
    }).done(function(err,concepts){
      if(err) return res.send({err:err});
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }else{
        Concept.find({
    }).done(function(err,concepts){
      if(err) return res.send({err:err});
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }

  },

  update : function(req, res){
    console.log("Updating concept",req.body.notification)
    Concept.findOne(req.body.params.id).done(function(err, concept){
      if(err) return res.send({err:err});
      if(concept){
        Concept.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(c.id).emit("concept:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Concept", c[0], concept);

          res.send(c[0]);

      });

      }else{
        var concept = req.body.params;
        ///////////////////////////
        concept.type = "concept";
        if((concept.top)&&(concept.top == 0))concept.top = 550;
        if((concept.left)&&(concept.left == 0))concept.left = 550;
        ///////////////////////////
        Concept.create(concept).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.id).emit("concept:create", c);
          Notification.objectCreated(req,res,"Concept", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting concept')
    Concept.findOne(req.body.params.id).done(function(err,concept){
      if(err) return res.send({err:err});
      if(concept.position == 0) res.send({err : "You can't remove c0"})
      else{
        req.socket.broadcast.to(concept.id).emit("concept:remove2", concept);
        Notification.objectRemoved(req,res,"Concept", concept);
        concept.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },

};
