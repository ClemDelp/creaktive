/**
 * KnowledgeController
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
    Knowledge.find({
      project : req.session.currentProject.id
    }).done(function(err,knowledges){
      if(err) res.send(err)
        res.send(knowledges)
    });

  },

  create : function (req,res){
    var k = req.body.params;
    k.project = req.session.currentProject.id
    Knowledge.create(k).done(function(err, knowledge){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Knowledge", knowledge.id, function(notification){
        res.send(notification);
      });
      res.send(knowledge);
    });
  },

  update : function(req, res){
  	Knowledge.findOne(req.body.params.id).done(function(err, knowledge){
  		if(err) res.send(err);
  		if(knowledge){
  			Knowledge.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err);
         Notification.objectUpdated(req,res,"Knowledge", c[0].id, function(notification){
          res.send(notification);
        });

         res.send(c[0]);

       });
  		}else{
        var k = req.body.params;
        k.project = req.session.currentProject.id
        Knowledge.create(k).done(function(err,k){
          if(err) res.send(err);
          Notification.objectCreated(req,res,"Knowledge", k.id, function(notification){
            res.send(notification);
          });
          res.send(k);
          
        })
      }
    })
  }

};
