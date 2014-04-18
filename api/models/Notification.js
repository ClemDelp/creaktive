/**
 * Notification
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
 function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
 function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


 module.exports = {

 	autoPK : false,
 	attributes: {

  	/* e.g.
  	nickname: 'string'
  	*/

  },

  objectCreated : function(req,res, object, to, cb){
  	Notification.create({
  		id : guid(),
  		type : "create"+object,
      //content : "Project : " + req.session.currentProject.title  + " - New " + object,
  		content : " create " + object,
  		to : to,
      object : object,
  		date : getDate(),
  		read : [req.session.user.id],
  		project_id : req.session.currentProject.id,
  		from : req.session.user,
      comparator : new Date().getTime()
  	}).done(function(err,n){
  		if(err) console.log(err);
  		req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
  		cb(n);
  	})
  },

  objectUpdated : function(req,res, object, to, cb){
  	console.log(req.body.action);
  	var action ="";
  	if(req.body.action.title) action = "Title";
  	if(req.body.action.color) action = "state";
  	if(req.body.action.content) action = "Content";
  	if(req.body.action.members) action = "Members";
  	if(req.body.action.comments) action = "Comments";

  	Notification.create({
  		id : guid(),
  		type : "update" + object+action,
      object : object,
      //content : "Project : " + req.session.currentProject.title  + " - " + object + " " + action + " updated",
  		content : object + " " + action + " updated",
  		to : to,
  		date : getDate(),
  		read : [req.session.user.id],
  		project_id : req.session.currentProject.id,
  		from : req.session.user,
      comparator : new Date().getTime()
  	}).done(function(err,n){
  		if(err) console.log(err);
  		req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);
  		cb(n);
  	})
  },


};
