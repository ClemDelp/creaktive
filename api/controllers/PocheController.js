/**
 * PocheController
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
    console.log("fetching poche",req.body.notification)
    if(req.session.currentProject){
      Poche.find({
       project : req.session.currentProject.id
     }).done(function(err,poches){
      if(err) return res.send({err:err});
        res.send(poches)
    });
   }else{
    Poche.find({}).done(function(err,poches){
      if(err) return res.send({err:err});
        res.send(poches)
    });
  }
},

update : function(req, res){
  console.log("updating poche")
  Poche.findOne(req.body.params.id).done(function(err, poche){
    if(err) return res.send({err:err});
    if(poche){
      Poche.update({id: req.body.params.id}, req.body.params).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(req.session.currentProject.id).emit("poche:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Poche", c[0], poche);
          res.send(c[0]);   
      });
    }else{
      var p = req.body.params;
      ///////////////////////////
      p.type = "poche";
      ///////////////////////////
      p.project = req.session.currentProject.id
      Poche.create(p).done(function(err,c){
        if(err) return res.send({err:err});
        req.socket.broadcast.to(req.session.currentProject.id).emit("poche:create", c);
        Notification.objectCreated(req,res,"Poche", c);
        res.send(c);
      });
    }
  });
},

destroy : function(req,res){
  console.log('destroying poche')
  Poche.findOne(req.body.params.id).done(function(err,poche){
    if(err) return res.send({err:err});
    req.socket.broadcast.to(req.session.currentProject.id).emit("poche:remove2", poche);
    Notification.objectRemoved(req,res,"Poche", poche);    
    poche.destroy(function(err){
      if(err) return res.send({err:err});
      res.send({msg:"destroyed"})
    });
  });
},


};
