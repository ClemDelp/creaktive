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
    Link.find({
      project : req.session.currentProject.id
    }).done(function(err,links){
      if(err) res.send(err)
      res.send(links)
    });

  },

  create : function (req,res){
    var l = req.body;
    l.project = req.session.currentProject.id
    Link.create(l).done(function(err, link){
      if(err) res.send(err);
        Notification.create({
          id : guid(),
          type : "createLink",
          content : "Project : " + req.session.currentProject.title  + " - New Link",
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
  },


    update : function(req, res){
  	Link.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Link.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err);
              Notification.create({
                id : guid(),
                type : "updateLink",
                content : req.session.user.name + " midified a link",
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
            var l = req.body;
    l.project = req.session.currentProject.id
  			Link.create(l).done(function(err,c){
  				if(err) res.send(err)
            Notification.create({
              id : guid(),
              type : "createLink",
              content : req.session.user.name + " linked a knowledge to a concept",
              to : c.id,
              date : getDate(),
              read : [],
          project_id : req.session.currentProject.id,
          from : req.session.user
            }).done(function(err,n){
              if(err) console.log(err)
//req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
req.socket.in(req.session.currentProject.id).emit('notification:create', n);
              res.send(c);
            })
          
  			})
  		}
  	})
  }

};
  

