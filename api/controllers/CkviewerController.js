/**
 * CkviewerController
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
   * Action blueprints:
   *    `/ckviewer/create`
   */
   create: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/ckviewer/destroy`
   */
   destroy: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/ckviewer/find`
   */
   find: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },

  ckviewerview : function(req,res){
    project = req.session.currentProject;    
    BackupService.cron(req,res);
    BootstrapService.bootstrapdata(req,res);
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CkviewerController)
   */
  _config: {}

  
};
