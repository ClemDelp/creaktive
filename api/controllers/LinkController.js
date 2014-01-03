/**
 * LinkController
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
    Link.find({
      project : req.session.currentProject
    }).done(function(err,links){
      if(err) res.send(err)
      res.send(links)
    });

  },

  create : function (req,res){
    var l = req.body;
    l.project = req.session.currentProject
    Link.create(l).done(function(err, link){
      if(err) res.send(err);
      res.send(link);
    });
  },


    update : function(req, res){
  	Link.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Link.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
            var l = req.body;
    l.project = req.session.currentProject
  			Link.create(l).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
  

};
