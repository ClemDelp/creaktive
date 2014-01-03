/**
 * KnowledgeController
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
    Knowledge.find({
      project : req.session.currentProject
    }).done(function(err,knowledges){
      if(err) res.send(err)
      res.send(knowledges)
    });

  },

  create : function (req,res){
    var k = req.body;
    k.project = req.session.currentProject
    Knowledge.create(k).done(function(err, knowledge){
      if(err) res.send(err);
      res.send(knowledge);
    });
  },

  
  update : function(req, res){
  	Knowledge.findOne(req.body.id).done(function(err, knowledge){
  		if(err) res.send(err);
  		if(knowledge){
  			Knowledge.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
            var k = req.body;
    k.project = req.session.currentProject
  			Knowledge.create(k).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }

};
