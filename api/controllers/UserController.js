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
    User.find().done(function(err,users){
      if(err) res.send({err:err})
      res.send(users)
    });

  },

  
  update : function(req,res){
  	User.findOne(req.body.params.id).done(function(err, user){
  		if(err) res.send({err:err});
  		if(user){
  			User.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send({err:err})
            req.session.user = c[0];
            res.send(c[0]);
        });
  		}else{
  			User.create(req.body.params).done(function(err,p){
  				if(err) return res.send({err:err})
            p.confirmed = true;
          p.save(function(err, u){
            if(err) res.send({err:err})
            res.send(u);
          })
          
        })
  		}
  	})
  },

  destroy : function(req,res){
    User.findOne(req.body.params.id).done(function(err,user){
      if(err) console.log(err);
      user.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  inviteUser : function(req,res){
    console.log(req.body)
    //Create an empty user
    User.create({
      img : "/img/default-user-icon-profile.png",
      name : req.body.email.substring(0,req.body.email.indexOf("@")),
      email : req.body.email,
      pw : "JKHk!lm3682jhqmfljzdofij654654dfsdf6522dfs#mkldqj$",
      confirmed : false,
      id : IdService.guid()
    }).done(function(err, user){
      if(err) res.send({err:err});
      //Send email to the user with the link
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
        if(err) console.log(err)
      });
      //Create the user
      Permission.create({
        id: IdService.guid(),
        right : "r",
        user_id : user.id,
        project_id : req.session.currentProject.id
      }).done(function(err, permission){
        if(err) res.send({err:err});
        //Mark all notifications as read
        Notification.update({
          project_id : req.session.currentProject.id
        },{
          $push : {read : user.id}
        }).done(function(err, notifications){
          if(err) res.send(({err:err}))
        })
        //Send the user and permission to the server
        res.send({user : user, permission : permission})
      });
    })


  },

  changepassword : function(req,res){
    User.findOne(req.session.user.id).done(function(err, user){
      bcrypt.compare(req.body.oldpassword, user.pw, function (err, bcrypt_res) {
      if (!bcrypt_res) res.send("Invalid password")
        if(req.body.password == req.body.confirmPassword){
          user.pw = req.body.password
          user.hashPassword(user, function(err, user){
            user.save(function(err, user){
              req.session.user = user;
              res.redirect("/editprofile") 
            });
          });
        }else{
          res.send("Password must match")
        }
      });
    });



  },

  editprofile : function(req,res){
    User.findOne(req.session.user.id).done(function(err, user){
      user.email = req.body.email;
      user.name = req.body.username;
      user.img = req.body.image;
      user.save(function(err, user){
        req.session.user = user;
        res.redirect("/editprofile")     
      })
    })


  },

  editprofileview : function(req,res){
    BootstrapService.bootstrapmanager(req,res);
    //res.view({user : req.session.user});
  },


  userview : function(req,res){
    BootstrapService.bootstrapdata(req,res);
  },
};
