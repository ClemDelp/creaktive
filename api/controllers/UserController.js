/**
 * UserController
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
    User.find({

    }).done(function(err,users){
      if(err) res.send(err)
      res.send(users)
    });

  },

  
    update : function(req,res){
  	User.findOne(req.body.id).done(function(err, user){
  		if(err) res.send(err);
  		if(user){
  			User.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			User.create(req.body).done(function(err,p){
  				if(err) res.send(err)
  				res.send(p);
  			})
  		}
  	})
  },

};
