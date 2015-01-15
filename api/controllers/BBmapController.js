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

var webshot = require('webshot');
var fs = require('fs');
var rimraf = require('rimraf');

module.exports = {

  webshot : function(req,res){
    var url = "";
    var domain =  "";
    /////////////////////////
    // var params = "";
    // var sizeScreen = '3840x2160'; //Déf 4k
    // var multW = 3840/parseFloat(req.query.window_w);
    // var multH = 2160/parseFloat(req.query.window_h);
    // var multiplier = (req.query.window_h*multW > 2160) ? multH : multW;
    // if(req.query.zoom) params += "#visu/"+(parseFloat(req.query.zoom)*multiplier);
    // if(req.query.left) params += "/"+(parseFloat(req.query.left)*multiplier);
    // if(req.query.top) params += "/"+(parseFloat(req.query.top)*multiplier);
    // if(req.query.top) params += "/1";// invisibility
    // if(req.query.window_w) sizeScreen = (~~(parseFloat(req.query.window_w)*multiplier))+"x"+(~~(parseFloat(req.query.window_h)*multiplier));

    var currentProjectId = req.query.currentProject;

    var params = "";
    if(req.query.zoom) params += "#visu/"+req.query.zoom;
    if(req.query.left) params += "/"+req.query.left;
    if(req.query.top) params += "/"+req.query.top;
    if(req.query.top) params += "/1";// invisibility


    /////////////////////////
    if(req.get('host') == "localhost:1337"){
      url = req.baseUrl + "/bbmap?projectId="+currentProjectId+params;
      domain = "localhost"
    }else{
       url = "http://"+req.get("host")+ "/bbmap?projectId="+currentProjectId+params;
       domain = req.get("host")
    }
    // var cookie = "sails.sid="+req.signedCookies["sails.sid"]+";domain="+domain+";path=/";

    var cookie = {
      name:     'sails.sid',
      value:    req.signedCookies["sails.sid"],
      domain:   domain,
      path:     '/'
    };

    var file = ".tmp/"+currentProjectId+".png"

    var options = {
      windowSize : {
        width: req.query.window_w,
        height: req.query.window_h
      },
      cookies : [cookie],
      // renderDelay : 10
      takeShotOnCallback : true
    };

    console.log("**** Taking Screenshot", url)


    webshot(url,file,options, function(err, data) {
      if(err) return res.send(err);
      res.download(file);
    });


  },

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

  //////////////////////////////////////
  // IMPORT DATA SERVICE
  //////////////////////////////////////
  importElementsFromProject : function(req, res){
    Project.findOne(req.query.project_id).done(function(err, project){
      Element.find({project : project.id}).done(function(err, elements){
        return res.send(elements);
      });
    });
  },
  importLinksFromProject : function(req, res){
    Project.findOne(req.query.project_id).done(function(err, project){
      Link.find({project : project.id}).done(function(err, links){
        return res.send(links);
      });
    });
  },
  //////////////////////////////////////
  //////////////////////////////////////

  bbmapview : function(req,res){
    console.log("Loading bbmap view")
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
