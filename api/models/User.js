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
  	
  	email : {
      type : 'email',
      required : true,
    },
    pw: {
      type: 'string',
      required: true
    },

    confirmed : {
      type : 'boolean',
      required : true,
      defaultsTo : false
    },

    super : {
      type : 'boolean',
      required : true,
      defaultsTo : false
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.pw;
      if(obj.super) delete obj.super;
      return obj;
    },

    hashPassword : function(user, cb){
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
      },
    
  },

  beforeDestroy : function (values, cb){
  	Permission.find({
      user_id : values.id
    }).done(function(err, perms){
      _.each(perms, function(p){
        p.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

  	cb();
  },

beforeCreate: function(user, cb) {
  User.find({
    email : user.email
  }).done(function(err, users){
    if(err) return cb(err);
    if(users.length==0){
      console.log("SAVE")
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
    }else{
      cb(new Error("Email already registered"));
    }


  });
  
  },



};
