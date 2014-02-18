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

  userview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    Project.findOne(req.query.projectId).done(function (err,project){   
      req.session.currentProject = project;
      Permission.find().done(function (err, permissions){
        User.find().done(function (err, users){        
          
          req.session.currentProject.permissions = [];
          perms = _.where(permissions, {project_id : project.id});
          _.each(perms, function (p){
            p.user = _.findWhere(users,{id:p.user_id});
            delete p.user_id;
            delete p.project_id;
            req.session.currentProject.permissions.push(p)
          });           
          console.log("lalala",req.session.currentProject)
          res.view({
            currentUser : JSON.stringify(req.session.user),
            //projectTitle : req.session.currentProject.title,
            projectId : req.session.currentProject.id,
            currentProject : JSON.stringify(req.session.currentProject),
          });
        });        
      });
    }); 
  },
};
