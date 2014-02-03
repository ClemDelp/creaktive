/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

 var bcrypt = require('bcrypt');

module.exports = {
  autoPK : false,

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

    pw: {
      type: 'string',
      required: true
    },

    confirmed : {
      type : 'boolean',
      required : true,
      defaultsTo : false
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.pw;
      return obj;
    }
    
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
  },

beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.pw, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        }else{
          user.pw = hash;
          cb(null, user);
        }
      });
    });
  }


};
