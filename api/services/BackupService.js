
module.exports = {

    createProjectFromNode : function(id_father, title, content, cb){
        Project.findOne(id_father).done(function(err, father){
            if(err) return cb(err);
            new_project = _.clone(father);
            new_project.id = IdService.guid();
            new_project.project = new_project.id;
            new_project.backup = false;
            new_project.node_title = "";
            new_project.node_description = "";
            new_project.title = title;
            new_project.content = content;

            BackupService.copyData(new_project, id_father, function(err, project){
                cb(null, project);
            });
        });
    },

    createNode : function(id_father,currentProject,author,node_name, node_description,cb){

        //On créé un nouveau projet avec comme father_id le projet initial
        var new_Project = currentProject;
        new_Project.id = IdService.guid();
        new_Project.author = author;
        new_Project.date =  IdService.getDate();
        new_Project.date2 = new Date().getTime();
        new_Project.id_father =  id_father;
        new_Project.backup =  true;
        new_Project.node_name =  node_name;
        new_Project.node_description = node_description;

        BackupService.copyData(new_Project, id_father, function(err, project){
            cb(null, project);
        });

},

    /*copie tous les concepts, connaissances, catégories, liens, permissions et présentations
    * @new_project : nouveau projet à créer
    * @id_father : id du projet source 
    * cb(err,project) : renvoi le nouveau projet créé ou une erreur
    */
    copyData : function(new_Project,id_father, cb){
       Project.create(new_Project).done(function(err,project){
              if(err) return cb(err);

              var all_links = [];
              var all_concepts = [];
              var all_knowledge = [];
              var all_categories = [];

              // On créé en parallèle tous les nouveaux objets
            async.parallel([
                function(callback){ 
                  // On créé tous les nouveaux liens dans un tableau
                  // Les targets et source seront traité plus bas
                  Link.find({
                    project : id_father
                }).done(function(err, links){
                    if(err) return cb(err);       
                    _.each(links, function(link){
                      var new_link = link;
                      new_link.id = IdService.guid();
                      new_link.project = project.id;
                      all_links.push(new_link);
                  });
                    callback();
                })
            },
                function(callback){
                      // Créé tous les concepts dans un tableau [{newc_oncept,old_concept}]
                      // les id_father seront traités plus bas
                      Concept.find({project:id_father}).done(function(err, concepts){
                        if(err) return cb(err);
                        _.each(concepts, function(concept){
                          var new_concept = _.clone(concept);
                          new_concept.id = IdService.guid();
                          new_concept.project = project.id;
                          all_concepts.push({new : new_concept, old : concept});
                      });
                        callback();
                    }); 
                  },
                  function(callback){ 
                      // Créé toutes les connaissances dans un tableau
                      Knowledge.find({
                        project : id_father
                    }).done(function(err, knowledges){
                        if(err) return cb(err);
                        _.each(knowledges, function(knowledge){
                          var new_knowledge = _.clone(knowledge);
                          new_knowledge.id = IdService.guid();
                          new_knowledge.project = project.id;
                          all_knowledge.push({new : new_knowledge, old : knowledge});
                      });
                        callback();
                    });
                },
                function(callback){ 
                      // Créé toutes les catégories dans un tableau
                      Poche.find({
                        project : id_father
                    }).done(function(err, poches){
                        if(err) return cb(err);
                        _.each(poches, function(poche){
                          var new_poche = _.clone(poche);
                          new_poche.id = IdService.guid();
                          new_poche.project = project.id;
                          all_categories.push({new: new_poche, old : poche});
                      })
                        callback();
                    })
                },
                ], function(err){
                    // Attribut pour chaque concept l'id du nouveau père 
                    _.each(all_concepts, function(concept){
                      if(concept.old.id_father == "none") concept.new.id_father = "none";
                      else {
                        var data = _.find(all_concepts, function(c){
                          if(c.old.id == concept.old.id_father) return c;
                      });
                        concept.new.id_father = data.new.id
                    }
                });

            //Créé tous les liens
            _.each(all_links, function(link){
              // On remplace toutes les sources
              var new_object_source = _.find(all_concepts.concat(all_knowledge, all_categories), function(obj){
                if(obj.old.id == link.source) return obj;
            })
              link.source = new_object_source.new.id;
              // On remplace toutes les target
              var new_object_target = _.find(all_concepts.concat(all_knowledge, all_categories), function(obj){
                if(obj.old.id == link.target) return obj;
            })
              link.target = new_object_target.new.id;
          });


            Concept.create(_.pluck(all_concepts, "new")).done(function(err,c){
                if(err) return cb(err);
            }); 
            //Enregistre toutes les connaissances et poches dans la BDD
            Knowledge.create(_.pluck(all_knowledge,"new")).done(function(err, knowledges){
              if(err) return cb(err);
          });
            //Enregistre toutes les connaissances et poches dans la BDD
            Poche.create(_.pluck(all_categories,"new")).done(function(err, poches){
              if(err) return cb(err);
          });
            //Enregistre toutes les connaissances et poches dans la BDD
            Link.create(all_links).done(function(err, links){
              if(err) return cb(err);
          });

        });




        Presentation.find({
          project_id : id_father
        }).done(function(err, presentations){
          _.each(presentations, function(presentation){
            Presentation.create({
              id : IdService.guid(),
              title : presentation.title,
              data : presentation.data,
              project_id : project.id,
          }).done(function(err, p){
              if(err) return cb(err)
          })
        })
        });

            Permission.find({
          project_id : id_father
        }).done(function(err, permissions){
          _.each(permissions, function(permission){
            Permission.create({
              id : IdService.guid(),
              user_id : permission.user_id,
              project_id : project.id,
              right : permission.right
          }).done(function(err, p){
              if(err) return cb(err);
              cb(null,project)
          })
        })
        });

        

        }); 
    }



    // cron : function(req,res){
    //     if(_.contains(req.session.allowedProjects, req.query.projectId)){
    //         Project.findOne(req.query.projectId).done(function(err, project){
    //             req.session.currentProject = project;
    //             Backup.find({project_id:project.id}).done(function(err,backups){
    //                 Knowledge.find({project:project.id}).done(function(err,knowledges){
    //                     Poche.find({project:project.id}).done(function(err,poches){
    //                         Concept.find({project:project.id}).done(function(err,concepts){
    //                             Link.find({project:project.id}).done(function(err,links){
    //                                 Notification.find({project_id : project.id}).done(function(err,notifications){
    //                                     /////////////////////////////////////
    //                                     // Get the last backup date ref
    //                                     if(backups.length != 0){
    //                                         var last_backup = 0;
    //                                         backups.forEach(function(b){
    //                                             if(b.date2 > last_backup) last_backup = b.date2;
    //                                         });
    //                                         // Get the last notification date ref
    //                                         var last_notif = 0;
    //                                         notifications.forEach(function(notif){
    //                                             if(notif.comparator > last_notif) last_notif = notif.comparator;
    //                                         });
    //                                         // Get the actual timestamp
    //                                         var actual_timestamp = new Date().getTime();
    //                                         // recuperer la difference en seconde 
    //                                         var diff = (actual_timestamp - last_backup)/1000;
    //                                         // comparrer à une journée en seconde
    //                                         var compare = diff/86400
    //                                         // Si la comparaison est > 1 on a plus d'une journée et que la derniere notif est > au dernier backup...
    //                                         if((compare >= 1)&&(last_notif>last_backup)){
    //                                             Backup.create({
    //                                                 id : IdService.guid(),
    //                                                 knowledges_collection : knowledges,
    //                                                 concepts_collection : concepts,
    //                                                 categories_collection : poches,
    //                                                 cklinks_collection : links,
    //                                                 date: IdService.getDate(),
    //                                                 date2:new Date().getTime(),
    //                                                 project_id : project.id
    //                                             }).done(function(err,b){
    //                                                 if(err) cb(err);
    //                                                 console.log("new backup created!");
    //                                             });
    //                                         }
    //                                     }else{
    //                                         Backup.create({
    //                                             id : IdService.guid(),
    //                                             knowledges_collection : knowledges,
    //                                             concepts_collection : concepts,
    //                                             categories_collection : poches,
    //                                             cklinks_collection : links,
    //                                             date: IdService.getDate(),
    //                                             date2:new Date().getTime(),
    //                                             project_id : project.id
    //                                         }).done(function(err,b){
    //                                             if(err) cb(err);
    //                                             console.log("first backup created!");
    //                                         });
    //                                     }
    //                                     /////////////////////////////////////
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         });

    //     }
    // }

}