/**
 * AppController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  appview : function(req,res){
  	req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
  	Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      res.view({
        currentUser : JSON.stringify(req.session.user),
        currentProject : req.session.currentProject.title
      });
    })

  },

  managerview : function (req,res){
  	req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
   	res.view({currentUser:JSON.stringify(req.session.user)});
  },

  getCurrentUser : function (req,res){
  	res.send(req.session.user);
  }
  

};
