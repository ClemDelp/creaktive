/**
 * ConceptController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


module.exports = {


/*
concept.notificate(concept, function(notification){
        req.socket.broadcast.to(req.session.currentProject).emit("notification", notification);
        res.send(null,concept);
      });
      */

  find : function (req,res){
    Concept.find({
      project : req.session.currentProject
    }).done(function(err,concepts){
      if(err) res.send(err)
      res.send(concepts)
    });

  },

  create : function (req,res){
    var c = req.body;
    c.project = req.session.currentProject;
    console.log(c)
    Concept.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.create({
        id : guid(),
        type : "createConcept",
        content : req.session.user.name + " added a new concept",
        to : concept.id,
        date : getDate(),
        read : false
      }).done(function(err,n){
        if(err) console.log(err)
      })
      res.send(concept);
    });
  },

  update : function(req, res){
  	Concept.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Concept.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err);
          Notification.create({
            id : guid(),
            type : "updateConcept",
            content : req.session.user.name + " updated a concept",
            to : concept.id,
            date : getDate(),
            read : false
          }).done(function(err,n){
            if(err) console.log(err)
          })
  				res.send(c);
  			});
  		}else{
        var concept = req.body;
        concept.project = req.session.currentProject;
  			Concept.create(concept).done(function(err,c){
  				if(err) res.send(err)
            Notification.create({
              id : guid(),
              type : "createConcept",
              content : req.session.user.name + " added a new concept",
              to : concept.id,
              date : getDate(),
              read : false
            }).done(function(err,n){
              if(err) console.log(err)
            })
  				res.send(c);
  			})
  		}
  	})
  }

};
