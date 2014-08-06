/**
 * ProjectController
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


};
