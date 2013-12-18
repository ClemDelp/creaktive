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
    
  },

  // beforeCreate: function(values, next) {
  //   bcrypt.hash(values.password, 10, function(err, hash) {
  //     if(err) return next(err);
  //     values.password = hash;
  //     next();
  //   });
  // }

};
