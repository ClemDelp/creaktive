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
    Poche.find({
      project : req.session.currentProject
    }).done(function(err,poches){
      if(err) res.send(err)
      res.send(poches)
    });

  },

  create : function (req,res){
    var p = req.body;
    p.project = req.session.currentProject
    Poche.create(p).done(function(err, poche){
      if(err) res.send(err);
      Notification.create({
        id : guid(),
        type : "createPoche",
        content : req.session.user.name + " added a knowledge tag",
        to : poche.id,
        date : getDate(),
        read : false
      }).done(function(err,n){
        if(err) console.log(err)
      })
      res.send(poche);
    });
  },


  update : function(req, res){
  	Poche.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Poche.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err);
          Notification.create({
            id : guid(),
            type : "updatePoche",
            content : req.session.user.name + " modified a knowledge tag",
            to : poche.id,
            date : getDate(),
            read : false
          }).done(function(err,n){
            if(err) console.log(err)
          })
  				res.send(c);
  			});
  		}else{
            var p = req.body;
    p.project = req.session.currentProject
  			Poche.create(p).done(function(err,c){
  				if(err) res.send(err);
          Notification.create({
            id : guid(),
            type : "createPoche",
            content : req.session.user.name + " added a knowledge tag",
            to : c.id,
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
