module.exports = {

  alfred : function(user, callback){
    var json = {};

    var json_news={
    el: "browserTestModal",
    news:[
      { 
        title:{
          fr: "Bienvenue",
          en: "Welcome"
        },
        contenu:{
          fr: "Je suis Edgar votre serviteur.",
          en: "I am your servant Edgar."
        },
        date:{
          fr: "16 Juin 2015 - ",
          en: "June 16, 2015 - "
        }
      },
      { 
        title:{
          fr: "Ajout d'Edgar",
          en: "Add Edgar"
        },
        contenu:{
          fr: "Maintenant Edgar est présent dans le système CreaKtive, prêt à combler tous vos désir !",
          en: "Now Edgar is present in the system CreaKtive, ready to fulfill your every desire !"
        },
        date:{
          fr: "16 Juin 2015 - ",
          en: "June 16, 2015 - "
        }

      },
      {
        title:{
          fr: "&Eacute;dition d&rsquo;une cartographie",
          en: "Editing a mapping"
        },
        contenu:{
          fr: '<ul class="panel"><li>- interface éditeur allégée</li><li>- application plus rapide</li><li>- pour éditer une bulle : <b>double click</b> dessus</li><li>- multi-sélection : maintenir la touche <b>SHIFT</b></li><li>- pour supprimer une ou plusieurs bulles : <b>sélectionner</b> + touche <b>DELETE</b></li><li>- possibilitité de dupliquer une ou plusieurs bulles : <b>sélection</b> + <b>CTRL</b> + <b>C</b></li></ul><p>voir la vidéo pour plus d\'informations</p><center><iframe width="560" height="315" src="https://www.youtube.com/embed/SE3GmYUHSmk" frameborder="0" allowfullscreen></iframe></center>',
          en: '<center><iframe width="560" height="315" src="https://www.youtube.com/embed/SE3GmYUHSmk" frameborder="0" allowfullscreen></iframe></center>'
        },
        date:{
          fr: "20 Juin 2015 - ",
          en: "June 20, 2015 - "
        }
      }
    ]
  }

    var alfred={
    bonjour:{
              fr:"Bonjour "
    },
    first_connexion:{
              fr:" bienvenu sur l'application CreaKtive. Je suis Alfred mon but rendre votre utilisation de l'éditeur Creaktive plus facile et instinctif. Dans un premier temps je vous conseil de créer un nouveau projet."
          },
    other_connexion:{
              fr:" Voici toutes vos notification depuis votre derniere connection le "
    },
    notification:{
              fr:{
                vous_avez:" Vous avez ",
                notification:" notification :",
                notifications:" notifications :"
              }
    },
    project:{
              fr:{
                projet :"projet",
                projets :"projets",
                createProjets: "on été crées",
                createProjet: "à été crée"
              }
    }


    }
    var private_projects, public_projects, example_project, last_connection;
    Project.find().done(function(err,projects){
      if(err) callback(err);
        //TRIER LES PROJETS
        User.findOne(user.id).done(function(err,user){
          if(err) callback(err);
          //Mettre à jour le user last connection
          //user.lastConnection.push(lfsljflksjd)
          User.update(user.id, user).done(function(err,u){
          // json.lastConnection = ....
          // json.projects
          json.alfred = alfred;
          json.news = json_news;
        
        callback(null,json);
          });
        })
    });
  },

  bootstrapmanager : function(req,res){
    //console.log("Bootstraping manager data")
    //console.log('user bootstrapmanager : ',req.session.user)
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    
    

    PermissionsService.checkPermissions(req,function(err){
      if(err) return res.send({err:err});
      ///////////////////////////////////////////////////

      

          User.find().done(function(err,users){
            News.find({user: req.session.user.id}).done(function(err,news){
              Project.find({id : req.session.permissions.all, backup : false}).done(function(err,projects){
                Permission.find().done(function(err, permissions){
                  
                  BootstrapService.alfred(req.session.user, function(err,alfred){
                    if(err) console.log(err)
                    res.view({ 
                      news : JSON.stringify(news),
                      currentUser : JSON.stringify(req.session.user),
                      users : JSON.stringify(users),
                      projects : JSON.stringify(projects),
                      permissions : JSON.stringify(permissions),
                      alfred : JSON.stringify(alfred)
                    });

                    // mettre à jour user last connexion

                  });

                  


                });
              });
            });
          });
      
    });
  },

  bootstrapdata : function(req,res){
    //console.log("Bootstraping data")
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    PermissionsService.checkPermissions(req,function(err){
      if(err) return res.send({err:err});
      if(_.contains(req.session.permissions.all, req.query.projectId)){
        ////////////////////////////////////////////////////////////
        Project.findOne(req.query.projectId).done(function(err, project){
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

              ////////////////////
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
                              permissions : JSON.stringify(permissions),
                            });

                            project_users.length = 0;
                            permissions.length = 0;
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