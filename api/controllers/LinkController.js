/**
 * LinkController
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
    console.log("Fetching links")
    if(req.session.currentProject){
      Link.find({
      project : req.session.currentProject.id
    }).done(function(err,links){
      if(err) return res.send({err:err});
        res.send(links)
    });
  }else{
          Link.find({
    }).done(function(err,links){
      if(err) return res.send({err:err});
        res.send(links)
    });
  }

  },

  update : function(req, res){
    console.log("updating links")
  	Link.findOne(req.body.params.id).done(function(err, concept){
  		if(err) return res.send({err:err});
  		if(concept){
  			Link.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(req.session.currentProject.id).emit("link:update", c[0]);
          Notification.objectUpdated(req,res,"Link", c[0]);
          res.send(c[0]);   
        });
      }else{
        var l = req.body.params;
        l.project = req.session.currentProject.id
        Link.create(l).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(req.session.currentProject.id).emit("link:create", c);
          Notification.objectCreated(req,res,"Link", c);
          res.send(c);
       })
      }
    })
  },

  destroy : function(req,res){
    console.log('destroying link')
    Link.findOne(req.body.params.id).done(function(err,link){
      if(err) return res.send({err:err});
      req.socket.broadcast.to(req.session.currentProject.id).emit("link:remove2", link);
      Notification.objectRemoved(req,res,"Link", link);
      if(link) {
          link.destroy(function(err){
            if(err) return res.send({err:err});
            res.send({msg:"destroyed"})
          })
       }
    });
  },

};


