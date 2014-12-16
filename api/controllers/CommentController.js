/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find : function (req,res){
	    console.log("Fetch comments");
	    if(req.body.params.project){
	    Comment.find({
	      project : req.body.params.project
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
    
    Comment.findOne(req.body.params.id).done(function(err, comment){
      if(err) return res.send({err:err});
      if(comment){
        console.log("Updating comment")
        Comment.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          //req.socket.broadcast.to(c.project).emit("comment:update", c[0]);
          //if(req.body.notification) Notification.objectUpdated(req,res,"Comment", c[0], comment);

          res.send(c[0]);

      });

      }else{
      	console.log("Creating comment")
        var comment = req.body.params;
        Comment.create(comment).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.project).emit("comment:create", c);
          //Notification.objectCreated(req,res,"Comment", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting comment')
    Comment.findOne(req.body.params.id).done(function(err,comment){
      if(err) return res.send({err:err});
      else{
        //req.socket.broadcast.to(comment.project).emit("comment:remove2", comment);
        //Notification.objectRemoved(req,res,"Comment", comment);
        comment.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },
};

