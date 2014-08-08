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
  

  bbmapview : function(req,res){
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
