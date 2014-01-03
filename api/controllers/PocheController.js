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
      res.send(poche);
    });
  },


  update : function(req, res){
  	Poche.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Poche.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
            var p = req.body;
    p.project = req.session.currentProject
  			Poche.create(p).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
  

};
