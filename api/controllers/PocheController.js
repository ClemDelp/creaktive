/**
 * PocheController
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

      Poche.find({
       project : req.session.currentProject.id
      }).done(function(err,poches){
        if(err) res.send(err)
          res.send(poches)
      });
    }else{
            Poche.find({

      }).done(function(err,poches){
        if(err) res.send(err)
          res.send(poches)
      });
    }

  },

  create : function (req,res){
    var p = req.body.params;
    p.project = req.session.currentProject.id
    Poche.create(p).done(function(err, poche){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Poche", poche.id, function(notification){
        res.send(notification);
      });
      res.send(poche);
      
    });
  },


  update : function(req, res){
  	Poche.findOne(req.body.params.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Poche.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err);
          Notification.objectUpdated(req,res,"Poche", c[0].id, function(notification){
            res.send(notification);
          });

          res.send(c[0]);   
          
          
        });
  		}else{
        var p = req.body.params;
        p.project = req.session.currentProject.id
        Poche.create(p).done(function(err,c){
          if(err) res.send(err);
          Notification.objectCreated(req,res,"Poche", c.id, function(notification){
            res.send(notification);
          });
          res.send(c);
          
        })
      }
    })
  },

      destroy : function(req,res){
    Poche.findOne(req.body.params.id).done(function(err,poche){
      if(err) console.log(err);
      poche.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },
  

};
