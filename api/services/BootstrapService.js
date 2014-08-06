module.exports = {

  bootstrapmanager : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    ///////////////////////////////////////////////////
    unread_notifications = [];
    read_notifications = [];
    
    Notification.find()
    .where({read : {'!' :req.session.user.id}})
    .done(function(err,unotifications){
      if(err) console.log(err);
      unread_notifications = unotifications;
      Notification.find()
      .where({read : req.session.user.id})
      .sort('comparator DESC')
      .limit(10)
      .done(function(err,rnotifications){
        if(err) res.send(err);
        read_notifications = _.groupBy(rnotifications, "project_id");

      });

    });
    ///////////////////////////////////////////////////
    User.find().done(function(err,users){
      Knowledge.find({project : req.session.allowedProjects}).done(function(err,knowledges){
        Poche.find({project : req.session.allowedProjects}).done(function(err,poches){
          Project.find({id : req.session.allowedProjects}).done(function(err,projects){
            Concept.find({project : req.session.allowedProjects}).done(function(err,concepts){
              Link.find({project : req.session.allowedProjects}).done(function(err,links){
                
                  Permission.find().done(function(err, permissions){
                    res.view({
                      currentUser : JSON.stringify(req.session.user),
                      users : JSON.stringify(users),
                      knowledges : JSON.stringify(knowledges),
                      poches : JSON.stringify(poches),
                      projects : JSON.stringify(projects),
                      concepts : JSON.stringify(concepts),
                      links : JSON.stringify(links),
                      notifications : JSON.stringify(unread_notifications),
                      activityLog : JSON.stringify(read_notifications),
                      permissions : JSON.stringify(permissions)

                    });
                  
                });
              })
            })
          })
        })
      })
    })

  },

	bootstrapdata : function(req,res){
		req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    
    if(_.contains(req.session.allowedProjects, req.query.projectId)){
      Project.findOne(req.query.projectId).done(function(err, project){
        req.session.currentProject = project;
        ///////////////////////////////////////////////////
        // Notifications
        unread_notifications = [];

        Notification.find({project_id : project.id}).done(function(err,notifications){
          notifications.forEach(function(notif){
            if((_.indexOf(notif.read, req.session.user.id) == -1)){
              unread_notifications.unshift(notif);
            }
          });
        });

        
        
        ///////////////////////////////////////////////////
        // Backups
        backups_truncated = [];
        Backup.find({project_id:project.id}).done(function(err, backups){
          backups.forEach(function(backup){
            var truncated = {"id":backup.id,"date":backup.date,"date2":backup.date2,"createdAt":backup.createdAt}
            backups_truncated.push(truncated);   
          });
        });
        ///////////////////////////////////////////////////
        User.find().done(function(err,users){
          Knowledge.find({project:project.id}).done(function(err,knowledges){
            Poche.find({project:project.id}).done(function(err,poches){
              Project.find().done(function(err,projects){
                Concept.find({project:project.id}).done(function(err,concepts){
                  Link.find({project:project.id}).done(function(err,links){
                    Permission.find().done(function(err, permissions){
                      Screenshot.find({project_id:project.id}).done(function(err, screenshots){
                          Presentation.find({project_id:project.id}).done(function(err, presentations){
                            res.view({
                              currentUser : JSON.stringify(req.session.user),
                              projectTitle : req.session.currentProject.title,
                              projectId : req.session.currentProject.id,
                              currentProject : JSON.stringify(req.session.currentProject),
                              users : JSON.stringify(users),
                              knowledges : JSON.stringify(knowledges),
                              poches : JSON.stringify(poches),
                              projects : JSON.stringify(projects),
                              concepts : JSON.stringify(concepts),
                              links : JSON.stringify(links),
                              notifications : JSON.stringify(unread_notifications),
                              permissions : JSON.stringify(permissions),
                              backups : JSON.stringify(backups_truncated),
                              screenshots : JSON.stringify(screenshots),
                              presentations : JSON.stringify(presentations),

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
    
	}


}