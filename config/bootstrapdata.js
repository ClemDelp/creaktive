module.exports.bootstrapdata = {

  bootstrapmanager : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    ///////////////////////////////////////////////////
    news_notifications = [];
    Notification.find({project_id : req.session.allowedProjects}).done(function(err,notifications){
      notifications.forEach(function(notif){
        if((_.indexOf(notif.read, req.session.user.id) == -1)){
          news_notifications.unshift(notif);
        }
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
                      notifications : JSON.stringify(news_notifications),
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
        news_notifications = [];
        Notification.find({project_id : project.id}).done(function(err,notifications){
          notifications.forEach(function(notif){
            if((_.indexOf(notif.read, req.session.user.id) == -1)){
              news_notifications.unshift(notif);
            }
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
                        Backup.find({project_id:project.id}).done(function(err, backups){
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
                            notifications : JSON.stringify(news_notifications),
                            permissions : JSON.stringify(permissions),
                            backups : JSON.stringify(backups)
                          });
                        });
                      })
                  })
                })
              })
            })
          })
        })
      })
    }
    else{
      res.send({err : "You have no permission on this project"})
    }
    
	}


}