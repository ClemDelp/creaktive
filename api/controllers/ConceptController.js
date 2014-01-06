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


  find : function (req,res){
    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err)
      res.send(concepts)
    });

  },

  create : function (req,res){
    var c = req.body;
    c.project = req.session.currentProject.id;
    console.log(c)
    Concept.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.create({
        id : guid(),
        type : "createConcept",
        content : req.session.user.name + " added a new concept",
        to : concept.id,
        date : getDate(),
        read : false,
          project_id : req.session.currentProject.id,
          from : req.session.user
      }).done(function(err,n){
        if(err) console.log(err)
        req.socket.emit.in(req.session.currentProject.id).emit("notification", notification);
      })
      res.send(concept);
    });
  },

  update : function(req, res){
    console.log(req.body.id);
  	Concept.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
        console.log("Concept found");
  			Concept.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err);
          // Notification.create({
          //   id : guid(),
          //   type : "updateConcept",
          //   content : req.session.user.name + " updated a concept",
          //   to : concept.id,
          //   date : getDate(),
          //   read : false,
          // project_id : req.session.currentProject.id,
          // from : req.session.user
          // }).done(function(err,n){
          //   if(err) console.log(err)
          // })
  				res.send(c);
  			});
  		}else{
        console.log("Concept not found creating it")
        var concept = req.body;
        concept.project = req.session.currentProject.id;
  			Concept.create(concept).done(function(err,c){
  				if(err) res.send(err);
            Notification.create({
              id : guid(),
              type : "createConcept",
              content : "Project : " + req.session.currentProject.title  + " - New concept",
              to : concept.id,
              date : getDate(),
              read : [],
          project_id : req.session.currentProject.id,
          from : req.session.user
            }).done(function(err,n){
              if(err) console.log(err);
              //req.socket.in(req.session.currentProject.id).emit("notification:create", n);
              req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
              res.send(c);
            })
  				
  			});
  		}
  	})
  }

};
