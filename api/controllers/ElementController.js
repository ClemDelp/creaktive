/**
 * ElementController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
  find : function (req,res){
    console.log("Fetch elements");
    if(req.body.params.project){
    Element.find({
      project : req.body.params.project
    }).done(function(err,elements){
      if(err) return res.send({err:err});
      this.elements = elements;
      c0 = _.findWhere(elements, {position : 0});
     
        res.send(elements)
    });
  }else{
        Element.find({
    }).done(function(err,elements){
      if(err) return res.send({err:err});
      this.elements = elements;
      c0 = _.findWhere(elements, {position : 0});
     
        res.send(elements)
    });
  }

  },

  update : function(req, res){
    console.log("Updating element",req.body.notification)
    Element.findOne(req.body.params.id).done(function(err, element){
      if(err) return res.send({err:err});
      if(element){
        Element.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(c.id).emit("element:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Element", c[0], element);

          res.send(c[0]);

      });

      }else{
        var element = req.body.params;
        ///////////////////////////
        if((element.top)&&(element.top == 0))element.top = 550;
        if((element.left)&&(element.left == 0))element.left = 550;
        ///////////////////////////
        Element.create(element).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.id).emit("element:create", c);
          Notification.objectCreated(req,res,"Element", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting element')
    Element.findOne(req.body.params.id).done(function(err,element){
      if(err) return res.send({err:err});
      if(element.position == 0) res.send({err : "You can't remove c0"})
      else{
        req.socket.broadcast.to(element.id).emit("element:remove2", element);
        Notification.objectRemoved(req,res,"Element", element);
        element.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },

  
};
