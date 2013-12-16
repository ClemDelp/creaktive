/**
 * UserGroupController
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

      update : function(req,res){
  	UserGroup.findOne(req.body.id).done(function(err, user){
  		if(err) res.send(err);
  		if(user){
  			UserGroup.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			UserGroup.create(req.body).done(function(err,p){
  				if(err) res.send(err)
  				res.send(p);
  			})
  		}
  	})
  },
  

};
