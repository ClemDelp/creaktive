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
    if(req.body.params.project){
      Poche.find({
       project : req.body.params.project
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
  //console.log("updating poche")
  Poche.findOne(req.body.params.id).done(function(err, poche){
    if(err) return res.send({err:err});
    if(poche){
      Poche.update({id: req.body.params.id}, req.body.params).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.project).emit("poche:update", c[0]);
          News.createNews(req,c.project, c.id);
          res.send(c[0]);   
      });
    }else{
      var p = req.body.params;
      ///////////////////////////
      p.type = "poche";
      ///////////////////////////
      Poche.create(p).done(function(err,c){
        if(err) return res.send({err:err});
        req.socket.broadcast.to(c.project).emit("poche:create", c);
        News.createNews(req,c.project, c.id);
        res.send(c);
      });
    }
  });
},

destroy : function(req,res){
  //console.log('destroying poche')
  Poche.findOne(req.body.params.id).done(function(err,poche){
    if(err) return res.send({err:err});
    req.socket.broadcast.to(poche.project).emit("poche:remove2", poche);   
    poche.destroy(function(err){
      if(err) return res.send({err:err});
      res.send({msg:"destroyed"})
    });
  });
},


};
