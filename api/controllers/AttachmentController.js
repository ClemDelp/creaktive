/**
 * AttachmentController
 *
 * @description :: Server-side logic for managing attachments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find : function (req,res){
	    console.log("Fetch attachments");
	    if(req.body.params.project){
	    Attachment.find({
	      project : req.body.params.project
	    }).done(function(err,attachments){
	      if(err) return res.send({err:err});
	        res.send(attachments)
	    });
	  }else{
	        Attachment.find({
	    }).done(function(err,attachments){
	      if(err) return res.send({err:err});
	       res.send(attachments)
	    });
	  }
  },

  update : function(req, res){
    
    Attachment.findOne(req.body.params.id).done(function(err, attachment){
      if(err) return res.send({err:err});
      if(attachment){
        console.log("Updating attachment")
        Attachment.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          //req.socket.broadcast.to(c.project).emit("attachment:update", c[0]);
          //if(req.body.notification) Notification.objectUpdated(req,res,"Attachment", c[0], attachment);

          res.send(c[0]);

      });

      }else{
      	console.log("Creating attachment")
        var attachment = req.body.params;
        Attachment.create(attachment).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.project).emit("attachment:create", c);
          //Notification.objectCreated(req,res,"Attachment", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting attachment')
    Attachment.findOne(req.body.params.id).done(function(err,attachment){
      if(err) return res.send({err:err});
      else{
        req.socket.broadcast.to(attachment.project).emit("attachment:remove2", attachment);
        attachment.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },
  
};

