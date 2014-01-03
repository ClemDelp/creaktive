/**
 * ConceptController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {


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
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
        var concept = req.body;
        concept.project = req.session.currentProject;
  			Concept.create(concept).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }

};
