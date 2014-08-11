/**
 * ScreenshotController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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
    if(req.body.params.projectId){
      Screenshot.find({
       project : req.session.currentProject.id
     }).done(function(err,screenshots){
      if(err) res.send(err)
        res.send(screenshots)
    });
   }else{
    Screenshot.find({}).done(function(err,screenshots){
      if(err) res.send(err)
        res.send(screenshots)
    });
  }

},
  /**
   * Action blueprints:
   *    `/screenshot/create`
   */

  create : function (req,res){
  var s = req.body.params;
  s.project = req.session.currentProject.id
  Screenshot.create(s).done(function(err, screnshot){
    if(err) res.send(err);
    Notification.objectCreated(req,res,"Screenshot", screenshot, function(notification){
      res.send(notification);
    });
    res.send(screenshot);

  });
},


update : function(req, res){
 Screenshot.findOne(req.body.params.id).done(function(err, screenshot){
    if(err) res.send(err);
    ///////////////////////
    // Udpate
    if(screenshot){
     Screenshot.update({id: req.body.params.id}, req.body.params).done(function(err,s){
      if(err) res.send(err);
      Notification.objectUpdated(req,res,"Screenshot", s[0], function(notification){
        res.send(notification);
      });

      res.send(s[0]);   


    });
    ///////////////////////
    // Create
    }else{
      var screenshot = req.body.params;
      screenshot.project = req.session.currentProject.id
      Screenshot.create(screenshot).done(function(err,s){
        if(err) res.send(err);       
        ////////////////////////////////////////
        // Notification
        Notification.objectCreated(req,res,"Screenshot", s, function(notification){
          res.send(notification);
        });
        res.send(s);

      });
    }
  });
},

destroy : function(req,res){
  Screenshot.findOne(req.body.params.id).done(function(err,screenshot){
    if(err) console.log(err);
    screenshot.destroy(function(err){
      if(err) console.log(err)
        res.send({msg:"destroyed"})
    })
  });
},



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ScreenshotController)
   */
  _config: {}

  

};
