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
  }

  

};
