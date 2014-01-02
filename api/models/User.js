/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

	autoPK : false,


  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  },

  beforeDestroy : function (values, cb){
  	UserGroup.find({
  		user_id : values.where.id
  	}).done(function (err, userGroups){
  		if(err) console.log(err);
  		_.each(userGroups, function (userGroup){
  			userGroup.destroy(function(err){
  				if(err) console.log(err)
  			})
  		})
  	})

  	cb();
  }

};
