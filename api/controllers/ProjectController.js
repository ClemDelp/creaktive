/**
 * ProjectController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}



module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  find : function(req,res){
    Project.find().done(function (err,projects){   
      Permission.find().done(function (err, permissions){
        User.find().done(function (err, users){
          _.each(projects, function(project){
            project.permissions = [];
            perms = _.where(permissions, {project_id : project.id});
            _.each(perms, function (p){
              p.user = _.findWhere(users,{id:p.user_id});
              delete p.user_id;
              delete p.project_id;
              project.permissions.push(p)
            });           
          });
          res.send(projects);
        })
      })
    })

  },

  update : function(req,res){
  	Project.findOne(req.body.id).done(function(err, project){
  		if(err) res.send(err);
  		if(project){
  			Project.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Project.create(req.body).done(function(err,p){
  				if(err) res.send(err)
  				res.send(p);
  			})
  		}
  	})
  },

  
  update : function(req,res){
		Project.findOne(req.body.id).done(function(err,project){
			if (project){
					Project.update({
						id : req.body.id
					},req.body).done(function(err,p){
						if(err) res.send({err:err});
						res.send(p);
					})
			}
			else{
				Project.create(req.body).done(function(err, p){
					res.send(p)
				})
			}
		})
	},



/*
* Creates permission for each member of a group
* @param : group_id
* @param : project_id
*/
createPermission : function (req,res){
  UserGroup.find({
    group_id : req.body.group_id
  }).done(function (err, usergroups){
    users_id = _.pluck(usergroups, "user_id");
    _.each(users_id, function(user_id){
      Permission.create({
        id : guid(),
        user_id : user_id,
        project_id : req.body.project_id,
        right : req.body.right,
        group_id : req.body.group_id

      }).done(function (err, p){
        if(err) console.log(err);
      })
      res.send({msg:"Permissions granted"});
    })
  })

},


/*
* Remove a permission for a user
* @param : user_id
* @param : project_id
*/
removePermission : function (req,res){
  Permission.find({
    user_id : req.body.user_id,
    project_id : req.body.project_id
  }).done(function (err, permissions){
    _.each(permissions, function(perm){
      perm.destroy(function (err){
        if(err) console.log(err);
      })
    })
    res.send({msg:"Permission removed"})
  })

}

};
