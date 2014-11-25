/**
 * Notification
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */


 module.exports = {

 	autoPK : false,
 	attributes: {

  	/* e.g.
  	nickname: 'string'
  	*/
  },

  objectCreated : function(req,res, object, to){
    console.log("Notifications object created")
    if(req.body.action.length == 0) return;
    Notification.create({
  		id : IdService.guid(),
  		type : "create"+object,
  		content : object + " created",
  		to : to,
      attr   : ['create'],
      object : object,
      action : "create",
  		date : IdService.getDate(),
  		read : [req.session.user.id],
  		project_id : req.session.currentProject.id,
  		from : req.session.user,
      comparator : new Date().getTime()
  	}).done(function(err,n){
  		if(err) console.log(err);
  		req.socket.in(req.session.currentProject.id).emit("notification:create", n);
      req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);

  	})
  },

  objectUpdated : function(req,res, object, to, old){
    console.log("Notification object updated")
    var content ="";

    if(req.body.action.length == 0) return;
    if(_.indexOf(req.body.action, "css") > -1) content = object + " template updated: " + req.body.params.title;
    //if(_.indexOf(req.body.action, "top") > -1 || _.indexOf(req.body.action, "left") >-1) return;
    if(_.indexOf(req.body.action, "title") > -1) content = object + " title updated: " + req.body.params.title;
    if(_.indexOf(req.body.action, "attachment") > -1) content = "New document attached to : "+object + ": " + req.body.params.title
    if(_.indexOf(req.body.action, "content") > -1) content = object + ": "+req.body.params.title + " content updated"
    if(_.indexOf(req.body.action, "comments") > -1) if(req.body.params.comments[0]) if(req.body.params.comments[0].content != "")content = "Added a comment: " + req.body.params.comments[0].content

    Notification.create({
      id : IdService.guid(),
      type : "update" + object,
      object : object,
      action : "update",
      attr   : req.body.action,
      content : content,
      to : to,
      old : old,
      date : IdService.getDate(),
      read : [req.session.user.id],
      project_id : req.session.currentProject.id,
      from : req.session.user,
      comparator : new Date().getTime()
    }).done(function(err,n){
      if(err) console.log(err);
      req.socket.in(req.session.currentProject.id).emit("notification:create", n);
      req.socket.broadcast.to(req.session.currentProject.id).emit("notification:create", n);

    });
  },

  objectRemoved : function(req,res, object, to){
    var content = "model removed";

  	Notification.create({
  		id : IdService.guid(),
  		type : "remove" + object,
      object : object,
      action : "remove",
      attr   : ['remove'],
  		content : content,
  		to : to,
  		date : IdService.getDate(),
  		read : [req.session.user.id],
  		project_id : req.session.currentProject.id,
  		from : req.session.user,
      comparator : new Date().getTime()
  	}).done(function(err,n){
  		if(err) console.log(err);
  		req.socket.in(req.session.currentProject.id).emit("notification:create", n);
  	});
  },

};
