/**
 * ProjectController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 var async = require('async')

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  find : function(req,res){
    Permission.find({
      user_id : req.session.user.id
    }).done(function (err, permissions){
      var authorized_projects = _.pluck(permissions, 'project_id');
      Project.find({
        id : authorized_projects
      }).done(function(err, projects){
        res.send(projects);
      })
    })

  },

  create : function (req,res){
    Project.create(req.body.params).done(function(err, project){
      if(err) res.send(err)
      res.send(project)

        Concept.create({
      id : IdService.guid(),
      title : "c0 : "+values.title,

      content :"",
      date : IdService.getDate(),
      position : 0,
      project : values.id,
      comments : [],
      members:[],
      attachment:[],
      type : "concept",
      id_father: "none",
      top : 750,
      left: 750


    }).done(function(err, c0){
      if(err) console.log(err);
      Presentation.create({
        id : IdService.guid(),
        title : values.title,
        data : "",
        project_id : values.id,
      }).done(function(err){
        if(err) console.log(err);
        cb();
      });
    });
      Permission.create({
        id: IdService.guid(),
        user_id : req.session.user.id,
        project_id : project.id,
        right : "admin"
      }).done(function(err, perm){
        if(err) res.send(err)
        res.send(project)
      })
    })

  },

  update : function(req,res){
  	Project.findOne(req.body.params.id).done(function(err, project){
  		if(err) res.send(err);
  		if(project){
  			Project.update({id: req.body.params.id}, req.body.params).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c[0]);
  			});
  		}else{
  			Project.create(req.body.params).done(function(err,project){
  				if(err) res.send(err)

                Concept.create({
      id : IdService.guid(),
      title : "c0 : "+values.title,

      content :"",
      date : IdService.getDate(),
      position : 0,
      project : values.id,
      comments : [],
      members:[],
      attachment:[],
      type : "concept",
      id_father: "none",
      top : 750,
      left: 750


    }).done(function(err, c0){
      if(err) console.log(err);
      Presentation.create({
        id : IdService.guid(),
        title : values.title,
        data : "",
        project_id : values.id,
      }).done(function(err){
        if(err) console.log(err);
        cb();
      });
    });

  				Permission.create({
            id: IdService.guid(),
            user_id : req.session.user.id,
            project_id : project.id,
            right : "admin"
          }).done(function(err, perm){
            if(err) res.send(err)
              res.send(project)
          })
  			})
  		}
  	})
  },

  
  destroy : function(req,res){

		Project.findOne(req.body.params.id).done(function(err,project){
		  if(err) console.log(err);
      project.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
	},



  /**
  * Charge un noeud de sauvegarde du projet
  * @node_id : Id du node à charger
  */
  loadNode : function(req,res){
    var node_id = req.body.node_id;

    Project.findOne(node_id).done(function(err, project){
      if(err) return res.send(err);
      req.session.currentProject = project;
      res.redirect("/bbmap?projectId="+project.id);
    });
  },

  /**
  * Créé une sauvegarde d'un projet. Une sauvegarde est un nouveau projet.
  * @id_father : id du projet père
  * @author : créateur de la sauvegarde
  * @node_name : nom de la sauvegarde
  * @node_description : description de la sauvegarde
  */ 
  createNode : function(req,res){

    var id_father = req.body.id_father;
    var author = req.session.user;
    var node_name = req.body.node_name;
    var node_description = req.body.node_description

    //On créé un nouveau projet avec comme father_id le projet initial
    var new_Project = req.session.currentProject;
    new_Project.id = IdService.guid();
    new_Project.author = author;
    new_Project.date =  IdService.getDate();
    new_Project.date2 = new Date().getTime();
    new_Project.id_father =  id_father;
    new_Project.backup =  true;
    new_Project.node_name =  node_name;
    
    Project.create(new_Project).done(function(err,project){
      if(err) return res.send(err);

      var all_links = [];
      var all_concepts = [];
      var all_knowledge = [];
      var all_categories = [];

      // On créé en parallèle tous les nouveaux objets
      async.parallel([
        function(callback){ 
          // On créé tous les nouveaux liens dans un tableau
          Link.find({
            project : id_father
          }).done(function(err, links){
            if(err) return res.send(err);       
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
          Concept.find({project:id_father}).done(function(err, concepts){
            if(err) return res.send(err);
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
            if(err) return res.send(err);
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
            if(err) return res.send(err);
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
            if(err) return res.send(err);
        }); 
        //Enregistre toutes les connaissances et poches dans la BDD
        Knowledge.create(_.pluck(all_knowledge,"new")).done(function(err, knowledges){
          if(err) return res.send(err);
        });
        //Enregistre toutes les connaissances et poches dans la BDD
        Poche.create(_.pluck(all_categories,"new")).done(function(err, poches){
          if(err) return res.send(err);
        });
        //Enregistre toutes les connaissances et poches dans la BDD
        Link.create(all_links).done(function(err, links){
          if(err) return res.send(err);
        });
     
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
          if(err) return res.send(err)
        })
      })
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
          if(err) return res.send(err)
        })
      })
    });
    
    res.send(project)

    });
     
  }


};
