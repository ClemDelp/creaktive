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

    if(req.body.action.length == 0)return;
    Notification.create({
  		id : guid(),
  		type : "create"+object,
      //content : "Project : " + req.session.currentProject.title  + " - New " + object,
  		content : object + " created",
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

  	
    var content ="";

    if(req.body.action.length == 0 || _.indexOf(req.body.action, "css") > -1) {
      return
    }

    if(_.indexOf(req.body.action, "top") > -1 || _.indexOf(req.body.action, "left") >-1) {
      return;
    } 

  	if(_.indexOf(req.body.action, "title") > -1) content = object + " title updated: " + req.body.params.title;
  	//if(_.indexOf(req.body.action, "css") > -1) content = object + " :"+req.params.body.title + " template updated";
  	if(_.indexOf(req.body.action, "attachment") > -1) content = "New document attached to : "+object + ": " + req.body.params.title
    if(_.indexOf(req.body.action, "content") > -1) content = object + ": "+req.body.params.title + " content updated"
  	if(_.indexOf(req.body.action, "comments") > -1) if(req.body.params.comments[0]) if(req.body.params.comments[0].content != "")content = "Added a comment: " + req.body.params.comments[0].content


  	Notification.create({
  		id : guid(),
  		type : "update" + object,
      object : object,
      //content : "Project : " + req.session.currentProject.title  + " - " + object + " " + action + " updated",
  		content : content,
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
