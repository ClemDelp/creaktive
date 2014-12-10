module.exports = {

  bootstrapmanager : function(req,res){
    console.log("Bootstraping manager data")
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
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
          Knowledge.find({project : req.session.allowedProjects}).done(function(err,knowledges){
            Poche.find({project : req.session.allowedProjects}).done(function(err,poches){
              Project.find({id : req.session.allowedProjects, backup : false}).done(function(err,projects){
                Concept.find({project : req.session.allowedProjects}).done(function(err,concepts){
                  Link.find({project : req.session.allowedProjects}).done(function(err,links){
                    Presentation.find().done(function(err,presentations){
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
                          presentations : JSON.stringify(presentations),
                          permissions : JSON.stringify(permissions)
                        });
                      });
                    });
                  })
                })
              })
            })
          })
        });
      });
    });
    ///////////////////////////////////////////////////


  },

  bootstrapPublicMap : function(req,res){
    console.log("Bootstraping manager data")
    req.session.user = req.session.user || {
      "_id" : "4dc99f7e-55d4-f66c-3fcc-d5a5e49e8260",
      "color" : "",
      "confirmed" : true,
      "createdAt" : "2014-04-08T12:47:44.278Z",
      "email" : "delpuech.clement@gmail.com",
      "img" : "img/profiles/3.png",
      "left" : 69,
      "location" : "/publicVisu",
      "name" : "Guess",
      "pw" : "tutu",
      "status" : "",
      "tags" : [],
      "top" : 68,
      "updatedAt" : "2014-11-04T09:28:29.081Z"
    }
    ///////////////////////////////////////////////////    
    Knowledge.find({project : req.session.publicProjects}).done(function(err,knowledges){
      Poche.find({project : req.session.publicProjects}).done(function(err,poches){
        Project.find({id : req.session.publicProjects, backup : false}).done(function(err,projects){
          Concept.find({project : req.session.publicProjects}).done(function(err,concepts){
            Link.find({project : req.session.publicProjects}).done(function(err,links){
              res.view({
                currentUser : JSON.stringify(req.session.user),
                knowledges : JSON.stringify(knowledges),
                poches : JSON.stringify(poches),
                projects : JSON.stringify(projects),
                concepts : JSON.stringify(concepts),
                links : JSON.stringify(links),
              });
            });
          });
        });
      });
    });
    ///////////////////////////////////////////////////


  },

	bootstrapdata : function(req,res){
    console.log("Bootstraping data")
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    
    if(_.contains(req.session.allowedProjects, req.query.projectId)){
      Project.findOne(req.query.projectId).done(function(err, project){
        req.session.currentProject = project;
        ///////////////////////////////////////////////////
        // Notifications

        all_notifications = [];

        Notification.find({project_id : project.id}).done(function(err,notifications){
          if(err) res.send({err:err});
          all_notifications = notifications;
        });
        ///////////////////////////////////////////////////
        var presentationId = "none";
        if(req.query.presentationId) presentationId = req.query.presentationId;
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
        Comment.find({project:project.id}).done(function(err,comments){
          Knowledge.find({project:project.id}).done(function(err,knowledges){
            Poche.find({project:project.id}).done(function(err,poches){
              Project.find({id : req.session.allowedProjects, backup : false}).done(function(err,projects){
                Concept.find({project:project.id}).done(function(err,concepts){
                  Link.find({project:project.id}).done(function(err,links){
                    User.find().done(function(err,users){
                      Screenshot.find({project_id:project.id}).done(function(err, screenshots){
                          Presentation.find({project_id:project.id}).done(function(err, presentations){
                            res.view({
                              comments : JSON.stringify(comments),
                              currentUser : JSON.stringify(req.session.user),
                              projectTitle : req.session.currentProject.title,
                              projectId : req.session.currentProject.id,
                              currentProject : JSON.stringify(req.session.currentProject),
                              project_users : JSON.stringify(project_users),
                              users : JSON.stringify(users),
                              knowledges : JSON.stringify(knowledges),
                              poches : JSON.stringify(poches),
                              projects : JSON.stringify(projects),
                              concepts : JSON.stringify(concepts),
                              links : JSON.stringify(links),
                              notifications : JSON.stringify(all_notifications),
                              permissions : JSON.stringify(permissions),
                              backups : JSON.stringify(backups_truncated),
                              screenshots : JSON.stringify(screenshots),
                              presentations : JSON.stringify(presentations),
                              presentationId : JSON.stringify(presentationId)

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
    
  },

  bootstrapPublicData : function(req,res){
    console.log("Bootstraping public data")
    req.session.user = req.session.user || {
      "_id" : "4dc99f7e-55d4-f66c-3fcc-d5a5e49e8260",
      "color" : "",
      "confirmed" : true,
      "createdAt" : "2014-04-08T12:47:44.278Z",
      "email" : "delpuech.clement@gmail.com",
      "img" : "img/profiles/3.png",
      "left" : 69,
      "location" : "/publicVisu",
      "name" : "Guess",
      "pw" : "tutu",
      "status" : "",
      "tags" : [],
      "top" : 68,
      "updatedAt" : "2014-11-04T09:28:29.081Z"
    }
    
    //if(_.contains(req.session.allowedProjects, req.query.projectId)){
    Project.findOne(req.query.projectId).done(function(err, project){
      try{
        if(project.status == "public"){
          req.session.currentProject = project;
            ///////////////////////////////////////////////////
            // Notifications

            all_notifications = [];

            Notification.find({project_id : project.id}).done(function(err,notifications){
              if(err) res.send({err:err});
              all_notifications = notifications;
            });
            ///////////////////////////////////////////////////
            var presentationId = "none";
            if(req.query.presentationId) presentationId = req.query.presentationId;
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
            
            Knowledge.find({project:project.id}).done(function(err,knowledges){
              Poche.find({project:project.id}).done(function(err,poches){
                Project.find({backup : false}).done(function(err,projects){
                  Concept.find({project:project.id}).done(function(err,concepts){
                    Link.find({project:project.id}).done(function(err,links){
                      User.find().done(function(err,users){
                        Screenshot.find({project_id:project.id}).done(function(err, screenshots){
                            Presentation.find({project_id:project.id}).done(function(err, presentations){
                              res.view({
                                currentUser : JSON.stringify(req.session.user),
                                projectTitle : req.session.currentProject.title,
                                projectId : req.session.currentProject.id,
                                currentProject : JSON.stringify(req.session.currentProject),
                                project_users : JSON.stringify(project_users),
                                users : JSON.stringify(users),
                                knowledges : JSON.stringify(knowledges),
                                poches : JSON.stringify(poches),
                                projects : JSON.stringify(projects),
                                concepts : JSON.stringify(concepts),
                                links : JSON.stringify(links),
                                notifications : JSON.stringify(all_notifications),
                                permissions : JSON.stringify(permissions),
                                backups : JSON.stringify(backups_truncated),
                                screenshots : JSON.stringify(screenshots),
                                presentations : JSON.stringify(presentations),
                                presentationId : JSON.stringify(presentationId)

                              });
                            });
                        });
                      });
                    });
                  });
                });
              });
            });

        }
        else{
          res.send({err : "You have no permission on this project"});
        } 
      }catch(err){
        res.send({err : "Found no project"});
      }
    }); 
  }


}