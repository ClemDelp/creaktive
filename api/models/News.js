/**
* News.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoPK : false,
 	attributes: {

  	/* e.g.
  	nickname: 'string'
  	*/
  },

  createNews : function(req,project_id,attachedTo){
    Permission.find({project_id:project_id}).done(function(err, ps){
      User.find().done(function(err,us){
        us.forEach(function(u){
          ps.forEach(function(perm){
            if((perm.user_id == u.id)&&(perm.user_id != req.session.user.id)){
              News.create({
                id          : IdService.guid(),
                project     : project_id,
                user        : u.id,
                attachedTo  : attachedTo,
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

