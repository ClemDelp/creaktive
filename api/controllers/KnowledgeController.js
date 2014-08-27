/**
 * KnowledgeController
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

    if(req.session.currentProject){

      Knowledge.find({
        project : req.session.currentProject.id
      }).done(function(err,knowledges){
        if(err) res.send(err)
          res.send(knowledges)
      });
    }else{
            Knowledge.find({

      }).done(function(err,knowledges){
        if(err) res.send(err)
          res.send(knowledges)
      });
    }

  },

  update : function(req, res){
  	Knowledge.findOne(req.body.params.id).done(function(err, knowledge){
  		if(err) res.send(err);
  		if(knowledge){
        // Update the Knowledge
  			Knowledge.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err);
          req.socket.broadcast.to(req.session.currentProject.id).emit("knowledge:update", c[0]);
          Notification.objectUpdated(req,res,"Knowledge", c[0], knowledge, function(notification){
            res.send(notification);
          });

          res.send(c[0]);

        });
        //sails.config.elasticsearch.indexKnowledge(req.body.params);
  		}else{
        // Create a new knowledge
        var k = req.body.params;
        ///////////////////////////
        k.type = "knowledge";
        if((k.top)&&(k.top == 0))k.top = 550;
        if((k.left)&&(k.left == 0))k.left = 550;
        ///////////////////////////
        k.project = req.session.currentProject.id
        Knowledge.create(k).done(function(err,knowledge){
          if(err) res.send(err);
          req.socket.broadcast.to(req.session.currentProject.id).emit("knowledge:create", knowledge);
          Notification.objectCreated(req,res,"Knowledge", knowledge, function(notification){
            res.send(notification);
          });
          res.send(knowledge);
          
        });
        //sails.config.elasticsearch.indexKnowledge(k);
      }
    })
  },

  destroy : function(req,res){
    Knowledge.findOne(req.body.params.id).done(function(err,k){
      if(err) console.log(err);
      req.socket.broadcast.to(req.session.currentProject.id).emit("knowledge:remove2", k);
      Notification.objectRemoved(req,res,"Knowledge", k, function(notification){
        res.send(notification);
      });
      k.destroy(function(err){
        if(err) console.log(err)
        res.send({msg:"destroyed"})
      })
    });
  },

  knowledgeview : function(req,res){
    BootstrapService.bootstrapdata(req,res);
  },

};
