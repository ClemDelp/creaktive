/**
 * AppController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  appview : function(req,res){
  	req.session.user = req.session.user || {id:"999999999", name : "invité", img:"img/default-user-icon-profile.png"}
  	req.session.currentProject = req.query.projectId;
  	res.view();
  },

  manager : function (req,res){
  	req.session.user = req.session.user || {id:"999999999", name : "invité", img:"img/default-user-icon-profile.png"}
   	res.view({currentUser:req.session.user.id});
  },

  getCurrentUser : function (req,res){
  	res.send(req.session.user);
  }
  

};
