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
    console.log("Fetch Elements");
    if(req.body.params.project){
    Element.find({
      project : req.body.params.project
    }).done(function(err,Elements){
      if(err) return res.send({err:err});
      this.Elements = Elements;
      c0 = _.findWhere(Elements, {position : 0});
     
        res.send(Elements)
    });
  }else{
        Element.find({
    }).done(function(err,Elements){
      if(err) return res.send({err:err});
      this.Elements = Elements;
      c0 = _.findWhere(Elements, {position : 0});
     
        res.send(Elements)
    });
  }

  },

  update : function(req, res){
    console.log("Updating Element",req.body.notification)
    Element.findOne(req.body.params.id).done(function(err, Element){
      if(err) return res.send({err:err});
      if(Element){
        Element.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(c.id).emit("Element:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Element", c[0], Element);

          res.send(c[0]);

      });

      }else{
        var Element = req.body.params;
        ///////////////////////////
        Element.create(Element).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.id).emit("Element:create", c);
          Notification.objectCreated(req,res,"Element", c);
          res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting Element')
    Element.findOne(req.body.params.id).done(function(err,Element){
      if(err) return res.send({err:err});
      if(Element.position == 0) res.send({err : "You can't remove c0"})
      else{
        req.socket.broadcast.to(Element.id).emit("Element:remove2", Element);
        Notification.objectRemoved(req,res,"Element", Element);
        Element.destroy(function(err){
          if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
        });
      };
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ElementController)
   */
  _config: {}

  
};
