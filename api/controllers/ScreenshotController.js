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
    console.log("Fetch screenshot")
    if(req.body.params.projectId){
      Screenshot.find({
       project : req.body.params.projectId
     }).done(function(err,screenshots){
      if(err) return res.send({err:err});
        res.send(screenshots)
    });
   }else{
    Screenshot.find({}).done(function(err,screenshots){
      if(err) return res.send({err:err});
        res.send(screenshots)
    });
  }

},
  /**
   * Action blueprints:
   *    `/screenshot/create`
   */

  create : function (req,res){
    console.log("Create screenshot")
  var s = req.body.params;
  Screenshot.create(s).done(function(err, screnshot){
    if(err) return res.send({err:err});
    Notification.objectCreated(req,res,"Screenshot", screenshot, function(notification){
      res.send(notification);
    });
    res.send(screenshot);

  });
},


update : function(req, res){
  console.log("Update screenshot")
 Screenshot.findOne(req.body.params.id).done(function(err, screenshot){
    if(err) return res.send({err:err});
    ///////////////////////
    // Udpate
    if(screenshot){
     Screenshot.update({id: req.body.params.id}, req.body.params).done(function(err,s){
      if(err) return res.send({err:err});
      Notification.objectUpdated(req,res,"Screenshot", s[0], function(notification){
        res.send(notification);
      });

      res.send(s[0]);   


    });
    ///////////////////////
    // Create
    }else{
      var screenshot = req.body.params;
      Screenshot.create(screenshot).done(function(err,s){
        if(err) return res.send({err:err});      
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
  console.log("destroy screenshot")
  Screenshot.findOne(req.body.params.id).done(function(err,screenshot){
    if(err) return res.send({err:err});
    screenshot.destroy(function(err){
      if(err) return res.send({err:err});
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
