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
    var k = req.body;
    k.project = req.session.currentProject.id
    Knowledge.create(k).done(function(err, knowledge){
      if(err) res.send(err);
       Notification.create({
          id : guid(),
          type : "createKnowledge",
          content : req.session.user.name + " added a new knowledge",
          to : knowledge.id,
          date : getDate(),
          read : [],
          project_id : req.session.currentProject.id,
          from : req.session.user
        }).done(function(err,n){
          if(err) console.log(err)
req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
              res.send(c);
            })
          
    });
  },

  update : function(req, res){
  	Knowledge.findOne(req.body.id).done(function(err, knowledge){
  		if(err) res.send(err);
  		if(knowledge){
  			Knowledge.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err);
          Notification.create({
            id : guid(),
            type : "updateKnowledge",
            content : req.session.user.name + " updated a knowledge",
            to : c.id,
            date : getDate(),
            read : [],
          project_id : req.session.currentProject.id,
          from : req.session.user
          }).done(function(err,n){
            if(err) console.log(err)
req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
              res.send(c);
            })
          
  			});
  		}else{
            var k = req.body;
    k.project = req.session.currentProject.id
  			Knowledge.create(k).done(function(err,k){
  				if(err) res.send(err);
          Notification.create({
            id : guid(),
            type : "createKnowledge",
            content : "Project : " + req.session.currentProject.title  + " - New knowledge",
            to : k.id,
            date : getDate(),
            read : [],
          project_id : req.session.currentProject.id,
          from : req.session.user
          }).done(function(err,n){
            if(err) console.log(err);
//req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
req.socket.in(req.session.currentProject.id).emit('notification:create', n);
              res.send(k);
            })
          
  			})
  		}
  	})
  }

};
