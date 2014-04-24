/**
 * ManagerController
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
    
  
   managerview : function (req,res){
   	Permission.find({user_id:req.session.user.id}).done(function(err,permissions){
   		if(err) res.send(err);
   		allowed_projects = _.pluck(permissions,"project_id");
   		User.find().done(function(err,users){
		    Knowledge.find({project : allowed_projects}).done(function(err,knowledges){
		      Poche.find({project : allowed_projects}).done(function(err,poches){
		        Project.find({id : allowed_projects}).done(function(err,projects){
		          Concept.find({project : allowed_projects}).done(function(err,concepts){
		            Link.find({project : allowed_projects}).done(function(err,links){
		              Notification.find({project_id : allowed_projects}).done(function(err,notifications){
		                  res.view({
		                    currentUser : JSON.stringify(req.session.user),
		                    users : JSON.stringify(users),
		                    knowledges : JSON.stringify(knowledges),
		                    poches : JSON.stringify(poches),
		                    projects : JSON.stringify(projects),
		                    concepts : JSON.stringify(concepts),
		                    links : JSON.stringify(links),
		                    notifications : JSON.stringify(notifications)
		                  });
		              })
		            })
		          })
		        })
		      })
		    })
		  })
   	})
   
	  

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ManagerController)
   */
  _config: {}

  
};
