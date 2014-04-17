/**
 * CategoryController
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
  
  categoryview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    // Project.findOne(req.query.projectId).done(function(err, project){
    //   req.session.currentProject = project;
    //   res.view({
    //     currentUser : JSON.stringify(req.session.user),
    //     projectId : req.session.currentProject.id,
    //     currentProject : JSON.stringify(req.session.currentProject)
    //   });
    // })
        Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      
      User.find().done(function(err,users){
        Knowledge.find({project:project.id}).done(function(err,knowledges){
          Poche.find({project:project.id}).done(function(err,poches){
            Project.find().done(function(err,projects){
              Concept.find({project:project.id}).done(function(err,concepts){
                Link.find({project:project.id}).done(function(err,links){
                  Notification.find().done(function(err,notifications){
                    Permission.find().done(function(err, permissions){
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
                        notifications : JSON.stringify(notifications),
                        permissions : JSON.stringify(permissions)
                      });
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
    
  }

};
