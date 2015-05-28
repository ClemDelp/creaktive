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
  createNews : function(req,json){
    Permission.find({project_id:json.project}).done(function(err, ps){
      User.find().done(function(err,us){
        us.forEach(function(u){
          ps.forEach(function(perm){
            if((perm.user_id == u.id)&&(perm.user_id != req.session.user.id)){
              News.create({
                id          : IdService.guid(),
                project     : json.project,
                user        : u.id,
                attachedTo  : json.attachedTo,
              }).done(function(err,n){
                if(err) cb(err);
                //console.log("news successfully created!!!!")
                // req.socket.in(req.body.params.project).emit("notification:create", n);
                // req.socket.broadcast.to(req.body.params.project).emit("notification:create", n);
              });
            }  
          });
        });
      });
    });
  },

  newNotification : function(req,json){
    Notification.create({
      id          : IdService.guid(),
      type        : json.type,
      content     : json.content,
      to          : json.to,
      old         : json.old,
      attr        : json.attr,
      object      : json.object,
      action      : json.action,
      date        : IdService.getDate(),
      read        : false,
      project     : json.project,
      user        : req.session.user.id,
      comparator  : new Date().getTime(),
      attachedTo  : json.attachedTo,
    }).done(function(err,n){
      if(err) //console.log(err);
      req.socket.in(req.body.params.project).emit("notification:create", n);
      req.socket.broadcast.to(req.body.params.project).emit("notification:create", n);
    });

    this.createNews(req,json);
  },

  objectCreated : function(req,res, object, to){
    //console.log("Notifications object created")
    if(req.body.action.length == 0) return;
    
    var json = {
      type        : "create"+object,
      content     : object + " created",
      to          : to,
      old         : "",
      attr        : ['create'],
      object      : object,
      action      : "create",
      project     : req.body.params.project,
      attachedTo  : to.id,
    }
    this.newNotification(req,json);

  },

  objectUpdated : function(req,res, object, to, old){
    //console.log("Notification object updated")
    var content ="";

    if(req.body.action.length == 0) return;
    if(_.indexOf(req.body.action, "css") > -1) content = object + " template updated: " + req.body.params.title;
    if(_.indexOf(req.body.action, "title") > -1) content = object + " title updated: " + req.body.params.title;
    if(_.indexOf(req.body.action, "attachment") > -1) content = "New document attached to : "+object + ": " + req.body.params.title
    if(_.indexOf(req.body.action, "content") > -1) content = object + ": "+req.body.params.title + " content updated"
    if(_.indexOf(req.body.action, "comments") > -1) if(req.body.params.comments[0]) if(req.body.params.comments[0].content != "")content = "Added a comment: " + req.body.params.comments[0].content

    var json = {
      type        : "update"+object,
      content     : content,
      to          : to,
      old         : old,
      attr        : req.body.action,
      object      : object,
      action      : "update",
      project     : req.body.params.project,
      attachedTo  : to.id,
    }
    this.newNotification(req,json);
  },

  objectRemoved : function(req,res, object, to){
    //console.log("Notification object removed")
    var json = {
      type        : "remove"+object,
      content     : "model removed",
      to          : to,
      old         : "",
      attr        : ['remove'],
      object      : object,
      action      : "remove",
      project     : req.body.params.project,
      attachedTo  : to.id,
    }
    this.newNotification(req,json);
  },

};
