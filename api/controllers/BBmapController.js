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
    var Pageres = require('pageres');

module.exports = {
    
  
   /**
   * true : upload a new image for the project
   * false : do not upload image
   */
   image : function(req,res){
   		Project.findOne(req.session.currentProject.id).done(function(err,project){
   			var last_update = new Date(project.updatedAt);
   			var now = new Date();
   			var diff = now-last_update;
   			if(diff > 3600000){
   				res.send(true)
   			}
   			else{
   				res.send(false)
   			}
   		})

	},

  screenshot : function(req,res){

    var url = req.baseUrl + "/bbmap?projectId="+req.session.currentProject.id;
    var cookie = {
      key: "sails.sid",
      value: req.signedCookies["sails.sid"],
      domain: "localhost",
      path:"/"
    };

   console.log(cookie)

    var pageres = new Pageres({
        delay: 5, 
        cookies : [JSON.stringify(cookie)],
        selector : ".bulle",
        filename : req.session.currentProject.id + ".png"
      })
      .src(url, ['1920x1080'])
      .dest("img");

    pageres.run(function (err, items) {
        if (err) {
            res.send(err)
        }
        res.send(items);
    });

  },
  

  bbmapview : function(req,res){
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
