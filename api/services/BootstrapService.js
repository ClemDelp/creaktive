module.exports = {

  bootstrapmanager : function(req,res){
    console.log("Bootstraping manager data")
    console.log('user bootstrapmanager : ',req.session.user)
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    PermissionsService.checkPermissions(req,function(err){
      if(err) return res.send({err:err});
      ///////////////////////////////////////////////////
      unread_notifications = [];
      read_notifications = [];
      
      Notification.find({
        read : { "!" : req.session.user.id}
      }).done(function(err,unotifications){
        if(err) console.log(err);
        unread_notifications = unotifications;

        Notification.find({
          where : {
            read : req.session.user.id,
            content : { "!" : ""}
          },
          limit : 100
        }).done(function(err, rnotifications){
          if(err) console.log(err)
          unread_notifications = rnotifications;
          User.find().done(function(err,users){
          News.find({user: req.session.user.id}).done(function(err,news){
            Project.find({id : req.session.permissions.all, backup : false}).done(function(err,projects){
                Permission.find().done(function(err, permissions){
                  res.view({ 
                    news : JSON.stringify(news),
                    currentUser : JSON.stringify(req.session.user),
                    users : JSON.stringify(users),
                    projects : JSON.stringify(projects),
                    notifications : JSON.stringify(unread_notifications),
                    activityLog : JSON.stringify(read_notifications),
                    permissions : JSON.stringify(permissions)
                  });
                });
              });
            });
          });
        });
      });
      ///////////////////////////////////////////////////
    });
  },

	bootstrapdata : function(req,res){
    console.log("Bootstraping data")
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    PermissionsService.checkPermissions(req,function(err){
      if(err) return res.send({err:err});
      if(_.contains(req.session.permissions.all, req.query.projectId)){
        ////////////////////////////////////////////////////////////
        Project.findOne(req.query.projectId).done(function(err, project){
          ///////////////////////////////////////////////////
          // Notifications
          all_notifications = [];
          Notification.find({project_id : project.id}).done(function(err,notifications){
            if(err) res.send({err:err});
            all_notifications = notifications;
          });
          ///////////////////////////////////////////////////
          // Users just those who are permission on project
          var project_users = [];
          var permissions = [];
          Permission.find({project_id:project.id}).done(function(err, ps){
            permissions = ps;
            User.find().done(function(err,us){
              us.forEach(function(u){
                ps.forEach(function(perm){
                  if(perm.user_id == u.id){
                    project_users.push(u);
                  }  
                })
                 
              })
            });
          });
          ///////////////////////////////////////////////////
          News.find({project:project.id, user: req.session.user.id}).done(function(err,news){
            Notification.find({project:project.id}).done(function(err,notifications){
              Attachment.find({project:project.id}).done(function(err,attachments){
                Comment.find({project:project.id}).done(function(err,comments){
                  Element.find({project:project.id}).done(function(err,elements){
                    Project.find({id : req.session.permissions.all, backup : false}).done(function(err,projects){
                      Link.find({project:project.id}).done(function(err,links){
                        User.find().done(function(err,users){
                          rules.apply_rules(elements,links,function(){
                            res.view({
                              news : JSON.stringify(news),
                              comments : JSON.stringify(comments),
                              attachments : JSON.stringify(attachments),
                              elements : JSON.stringify(elements),                    
                              currentUser : JSON.stringify(req.session.user),
                              projectTitle : project.title,
                              projectId : project.id,
                              currentProject : JSON.stringify(project),
                              project_users : JSON.stringify(project_users),
                              users : JSON.stringify(users),
                              projects : JSON.stringify(projects),
                              links : JSON.stringify(links),
                              notifications : JSON.stringify(notifications),
                              permissions : JSON.stringify(permissions),
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }else{
        res.send({err : "You have no permission on this project"});
      }
    });
    
  },

}