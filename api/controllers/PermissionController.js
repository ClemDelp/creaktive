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
find : function (req,res){
  console.log("fetching permission")
    Permission.find({

    }).done(function(err,permissions){
      if(err) res.send(err)
      res.send(permissions)
    });

  },

destroy : function(req,res){
  console.log("destroying permission")
    Permission.findOne(req.body.params.id).done(function(err,permission){
      if(err) console.log(err);
      permission.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"permission destroyed"})
      })
    });
  },

update : function(req,res){
  console.log('updating permission')
    Permission.findOne(req.body.params.id).done(function(err, permission){
      if(err) res.send(err);
      if(permission){
        Permission.update({id: req.body.params.id}, req.body.params).done(function(err,c){
          if(err) res.send(err)
          res.send(c);
        });
      }else{
        Permission.create(req.body.params).done(function(err,p){
          if(err) res.send(err)
          res.send(p);
        })
      }
    })
  },

};
