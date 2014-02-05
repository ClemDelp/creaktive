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

  register : function (req,res){
    console.log(req.body)

    User.create(req.body.params).done(function(err, user){
      if(err) console.log(err);
      res.send(user);
    })
  },

  find : function (req,res){
    User.find({

    }).done(function(err,users){
      if(err) res.send(err)
      res.send(users)
    });

  },

  
    update : function(req,res){
  	User.findOne(req.body.params.id).done(function(err, user){
  		if(err) res.send(err);
  		if(user){
  			User.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			User.create(req.body.params).done(function(err,p){
  				if(err) res.send(err)
          p.confirmed = true;
        p.save(function(err, u){
          res.send(u);
        })
  				
  			})
  		}
  	})
  },

    destroy : function(req,res){
    User.findOne(req.body.params.id).done(function(err,user){
      if(err) console.log(err);
      UserGroup.find({
        user_id : user.id
      }).done(function (err, usergroups){
        _.each(usergroups, function(ug){
          ug.destroy(function(err){
            if(err) console.log(err);
          });
        })
      })
      user.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

};
