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
    console.log("fetching project")
    var node0 = req.body.params.project;
    
    // On fetch les projets qui ne sont que des nodes
    if(node0){
      Permission.find({
        user_id : req.session.user.id
      }).done(function (err, permissions){
        var authorized_projects = _.pluck(permissions, 'project_id');
        Project.find({
          id : authorized_projects,
          project : node0
        }).done(function(err, projects){
          res.send(projects);
        })
      }) 
    }else{
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
    }



  },

  create : function (req,res){
    console.log("creating project")
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
    console.log("updating project")
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
            title : "c0 : "+project.title,
            content :"",
            date : IdService.getDate(),
            position : 0,
            project : project.id,
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
              title : project.title,
              data : "",
              project_id : project.id,
            }).done(function(err){
              if(err) console.log(err);
              Permission.create({
                id: IdService.guid(),
                user_id : req.session.user.id,
                project_id : project.id,
                right : "admin"
              }).done(function(err, perm){
                if(err) res.send(err)
                  res.send(project)
              })
            });
          });
  			})
  		}
  	})
  },

  
  destroy : function(req,res){
    console.log('destroying project')
    var project_id = req.body.params.id
		Project.findOne(project_id).done(function(err,project){
		  if(err) console.log(err);
      project.destroy(function(err){
        if(err) console.log(err)
        Project.find({
          project : project_id
        }).done(function(err, nodes){
          if(err) res.send(err);
          _.each(nodes, function(node){
            node.destroy(function(err){
              if(err) console.log(err)
            })
          })
        })
        res.send({msg:"destroyed"})
      })
    });
	},



  /**
  * Créé un nouveau projet à partir d'un noeud
  * @node_id : Id du node à charger
  */
  createFromNode : function(req,res){
    console.log("Creating project from a backup")
    var node_id = req.body.node_id;
    var title = req.body.title;
    var content = req.body.content; 
    BackupService.createProjectFromNode(node_id, title, content, function(err, proj){
      if(err) return res.send(err);
      res.send(proj);
    })
  },

  /**
  * Charge un noeud de sauvegarde du projet et créé une nouvelle branche
  * @node_id : Id du node à charger
  */
  loadNode : function(req,res){
    console.log('Loading backup from node')
    var node_id = req.body.node_id;

    Project.findOne(req.session.currentProject.id).done(function(err, currentProject){
      if(err) res.send(err);    
      Project.findOne(node_id).done(function(err, project){
        if(err) return res.send(err);
          res.send(project)
      });
    })
  },


  /** Supprime une branche
  * @node_id : Id du node à supprimer
  */
  deleteBranch : function(req,res){
    console.log("deleting backup")
    var node_id = req.body.node_id;
    Project.findOne(node_id).done(function(err, project){
      if(err) return res.send(err);
      project.destroy(function(err){
        res.send("destroyed")
      });
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
    console.log("creating backup");
    var id_father = req.body.id_father;
    var author = req.session.user;
    var node_name = req.body.node_name;
    var node_description = req.body.node_description;
    var currentProject = _.clone(req.session.currentProject);

    BackupService.createNode(id_father, currentProject, author,node_name, node_description, function(err,node){
      if(err) return res.send(err);
      res.send(node);
    });
  }



};
