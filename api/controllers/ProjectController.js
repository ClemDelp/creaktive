/**
 * ProjectController
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

    update : function(req, res){
  	Project.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Project.update({
          id: req.body.id
        }, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Project.create(req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
  

};