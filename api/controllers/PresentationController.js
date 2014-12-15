/**
 * PresentationController
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
    console.log("fetching presentation")
    if(req.body.params.projectId){
      Presentation.find({
       project : req.session.currentProject.id
      }).done(function(err,presentations){
        if(err) return res.send({err:err});
        res.send(presentations)
      });
    }else{
      Presentation.find({}).done(function(err,presentations){
        if(err) return res.send({err:err});
        res.send(presentations)
      });
    }
  },
  
  /**
   * Action blueprints:
   *    `/presentation/create`
   */

  create : function (req,res){
    console.log("creating presentation")
  var s = req.body.params;

  Presentation.create(s).done(function(err, presentation){
    if(err) return res.send({err:err});
    Notification.objectCreated(req,res,"Presentation", presentation, function(notification){
      res.send(notification);
    });
    res.send(presentation);

    });
  },

  update : function(req, res){
    console.log('updating presentation')
    Presentation.findOne(req.body.params.id).done(function(err, presentation){
      if(err) return res.send({err:err});
      ///////////////////////
      // Udpate
      if(presentation){
      Presentation.update({id: req.body.params.id}, req.body.params).done(function(err,s){
        if(err) return res.send({err:err});
        // Notification.objectUpdated(req,res,"Presentation", s[0], function(notification){
        //   res.send(notification);
        // });
        res.send(s[0]);   
        });
      ///////////////////////
      // Create
      }else{
        var presentation = req.body.params;
        Presentation.create(presentation).done(function(err,s){
          if(err) return res.send({err:err});       
          ////////////////////////////////////////
          // Notification
          Notification.objectCreated(req,res,"Presentation", s, function(notification){
            res.send(notification);
          });
          res.send(s);

        });
      }
    });
  },

  destroy : function(req,res){
    console.log("destroying presentation")
    Presentation.findOne(req.body.params.id).done(function(err,presentation){
      if(err) return res.send({err:err});
      presentation.destroy(function(err){
        if(err) return res.send({err:err});
          res.send({msg:"destroyed"})
      })
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PresentationController)
   */
  _config: {}

  
};
