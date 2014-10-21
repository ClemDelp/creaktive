/**
 * BBmapController
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

  screenshot : function(req,res){
    console.log("Processing take screenshot")
    ScreenshotService.screenshot(req,res,"upload");
    res.send("Screenshot added");
  },

  downloadScreenshot : function(req,res){
    console.log("Processing downloading screenshot")
    ScreenshotService.screenshot(req,res,"download", function(err, file){
      if(err) return res.send({err:err});
      res.download(file.path);
    });
  },
  

  bbmapview : function(req,res){
    console.log("Loading bbmap view")
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
