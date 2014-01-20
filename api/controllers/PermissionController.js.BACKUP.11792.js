/**
 * PermissionController
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

<<<<<<< HEAD
update : function(req,res){
  	Permission.findOne(req.body.id).done(function(err, permission){
  		if(err) res.send(err);
  		if(permission){
  			Permission.update({id: req.body.id}, req.body).done(function(err,c){
=======
    update : function(req, res){
  	Permission.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Permission.update({
          id: req.body.id
        }, req.body).done(function(err,c){
>>>>>>> concept
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
<<<<<<< HEAD
  			Permission.create(req.body).done(function(err,p){
  				if(err) res.send(err)
  				res.send(p);
  			})
  		}
  	})
  },
=======
  			Permission.create(req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }
>>>>>>> concept
  

};
