/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 var bcrypt = require('bcrypt');

 module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */


  find : function (req,res){
    console.log('fetch users')
    User.find().done(function(err,users){
      if(err) return res.send({err:err})
      res.send(users)
    });
  },

  
  update : function(req,res){  	
    console.log("update users")
    User.findOne(req.body.params.id).done(function(err, user){
  		if(err) return res.send({err:err});
  		if(user){
  			User.update({id: req.body.params.id}, req.body.params).done(function(err,u){
  				if(err) return res.send({err:err})
          res.send(u[0]);
        });
  		}else{
  			User.create(req.body.params).done(function(err,p){
  				if(err) return res.send({err:err})
          p.confirmed = true;

          p.save(function(err, u){
            if(err) return res.send({err:err})
            res.send(u[0]);
          })
        })
  		}
  	})
  },

  destroy : function(req,res){
    console.log("destroy user")
    User.findOne(req.body.params.id).done(function(err,user){
      if(err) return res.send({err:err})
      user.destroy(function(err){
        if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
      })
    });
  },

  inviteUser : function(req,res){
    console.log("invite user to a project")
    User.create({
      img : "/img/default-user-icon-profile.png",
      name : req.body.email.substring(0,req.body.email.indexOf("@")),
      email : req.body.email,
      pw : "JKHk!lm3682jhqmfljzdofij654654dfsdf6522dfs#mkldqj$",
      confirmed : false,
      id : IdService.guid(),
      platformAdmin : false,
      invitedBy : req.session.user.id
    }).done(function(err, user){
      if(err) return res.send({err:err});
        var url = "";
      if(req.baseUrl == "http://localhost:1337"){
        url = req.baseUrl + "/register?id=" + user.id;
      } 
      else{
        var u = req.baseUrl
        u = u.slice(0, u.lastIndexOf(":"))
        url = u + "/register?id=" + user.id;
      }
     
      EmailService.sendRegistrationMail(user.email, url,function(err, msg){
        if(err) return res.send({err:err});

      });


      Permission.create({
        id: IdService.guid(),
        right : "rw",
        user_id : user.id,
        project_id : req.body.currentProject
      }).done(function(err, permission){
        if(err) return res.send({err:err});
          res.send({user : user, permission : permission})
      })
    })


  },

  changepassword : function(req,res){
    console.log("processing change password")
    User.findOne(req.session.user.id).done(function(err, user){
      if((req.body.oldpassword != "")&&(req.body.password != "")&&(req.body.confirmPassword != "")){
        bcrypt.compare(req.body.oldpassword, user.pw, function (err, bcrypt_res) {
          if(err) return res.send({err:err});
          if(!bcrypt_res) res.send("Invalid password");
            if(req.body.password == req.body.confirmPassword){
              user.pw = req.body.password
              user.hashPassword(user, function(err, user){
                user.save(function(err, user){
                  if(err) return res.send({err:err});
                  req.session.user = user;
                  //res.redirect("/editprofile") 
                  res.send("Password updated");
                });
              });
            }else{
              res.send("Password must match");
            }
          });
      }else{
        res.send("No information find");
      }
    });
  },

  editprofile : function(req,res){
    console.log('processing edit profile')
    User.findOne(req.session.user.id).done(function(err, user){
      if(err) return res.send({err:err});
      user.email = req.body.email;
      user.name = req.body.username;
      user.img = req.body.image;
      user.save(function(err, user){
        if(err) return res.send({err:err});
        req.session.user = user;
        res.redirect("/editprofile")     
      })
    })


  },

  editprofileview : function(req,res){
    console.log("Loading edit profile view")
    BootstrapService.bootstrapmanager(req,res);
    //res.view({user : req.session.user});
  },


  userview : function(req,res){
    console.log('procesing users manager view')
    BootstrapService.bootstrapdata(req,res);
  },
};
