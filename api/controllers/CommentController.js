/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find : function (req,res){
	    console.log("Fetch comments");
	    if(req.session.currentProject){
	    Comment.find({
	      project : req.session.currentProject.id
	    }).done(function(err,comments){
	      if(err) return res.send({err:err});
	        res.send(comments)
	    });
	  }else{
	        Comment.find({
	    }).done(function(err,comments){
	      if(err) return res.send({err:err});
	       res.send(comments)
	    });
	  }

  },

  update : function(req, res){
    console.log("Updating comment")
    Comment.findOne(req.body.params.id).done(function(err, comment){
      if(err) return res.send({err:err});
      if(comment){
        Comment.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          //req.socket.broadcast.to(req.session.currentProject.id).emit("comment:update", c[0]);
          //if(req.body.notification) Notification.objectUpdated(req,res,"Comment", c[0], comment);

          res.send(c[0]);

      });

      }else{
        var comment = req.body.params;
        ///////////////////////////
        comment.project = req.session.currentProject.id;
        Comment.create(comment).done(function(err,c){
          if(err) return res.send({err:err});
          //req.socket.broadcast.to(req.session.currentProject.id).emit("comment:create", c);
          Notification.objectCreated(req,res,"Comment", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting comment')
    Comment.findOne(req.body.params.id).done(function(err,comment){
      if(err) return res.send({err:err});
      if(comment.position == 0) res.send({err : "You can't remove c0"})
      else{
        //req.socket.broadcast.to(req.session.currentProject.id).emit("comment:remove2", comment);
        //Notification.objectRemoved(req,res,"Comment", comment);
        comment.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },
};

