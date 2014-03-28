/**
 * LinkController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
 function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
 function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


 module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  find : function (req,res){
    if(req.body.params.projectId){
      Link.find({
      project : req.session.currentProject.id
    }).done(function(err,links){
      if(err) res.send(err)
        res.send(links)
    });
  }else{
          Link.find({
    }).done(function(err,links){
      if(err) res.send(err)
        res.send(links)
    });
  }

  },

  create : function (req,res){
    var l = req.body.params;
    l.project = req.session.currentProject.id
    Link.create(l).done(function(err, link){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Link", link.id, function(notification){
        res.send(notification);
      });
      res.send(link);
      
    });
  },


  update : function(req, res){
  	Link.findOne(req.body.params.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Link.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          Notification.objectUpdated(req,res,"Link", c[0].id, function(notification){
            res.send(notification);
          });

          res.send(c[0]);   
          
        });
      }else{
        var l = req.body.params;
        l.project = req.session.currentProject.id
        Link.create(l).done(function(err,c){
          if(err) res.send(err)
           Notification.objectCreated(req,res,"Link", c.id, function(notification){
            res.send(notification);
          });
         res.send(c);
         
       })
      }
    })
  },

      destroy : function(req,res){
    Link.findOne(req.body.params.id).done(function(err,link){
      if(err) console.log(err);
      link.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

};


