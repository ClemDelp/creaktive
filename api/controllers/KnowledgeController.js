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
    console.log("Fetching knowledge")
    if(req.session.currentProject){

      Knowledge.find({
        project : req.session.currentProject.id
      }).done(function(err,knowledges){
        if(err) return res.send({err:err});
          res.send(knowledges)
      });
    }else{
            Knowledge.find({

      }).done(function(err,knowledges){
        if(err) return res.send({err:err});
          res.send(knowledges)
      });
    }

  },

  update : function(req, res){
    console.log("Updating knowledge", req.body.notification);

    Knowledge.findOne(req.body.params.id).done(function(err, knowledge){
  		if(err) return res.send({err:err});
  		if(knowledge){
        // Update the Knowledge
  			Knowledge.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err);
          req.socket.broadcast.to(c.project).emit("knowledge:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Knowledge", c[0], knowledge);
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
        Knowledge.create(k).done(function(err,knowledge){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(knowledge.project).emit("knowledge:create", knowledge);
          Notification.objectCreated(req,res,"Knowledge", knowledge);
          res.send(knowledge);
          
        });
        //sails.config.elasticsearch.indexKnowledge(k);
      }
    })
  },

  destroy : function(req,res){
    console.log("Destroying knowledge")
    Knowledge.findOne(req.body.params.id).done(function(err,k){
      if(err) return res.send({err:err});
      req.socket.broadcast.to(k.project).emit("knowledge:remove2", k);
      Notification.objectRemoved(req,res,"Knowledge", k);
      k.destroy(function(err){
        if(err) return res.send({err:err});
        res.send({msg:"destroyed"})
      })
    });
  },


};
