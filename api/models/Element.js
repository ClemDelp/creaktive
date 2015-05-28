/**
 * Element
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

    Link.find({
      Element : values.where.id
    }).done(function(err, links){
      _.each(links, function(l){
        l.destroy(function(err){
          if(err) cb(err)
        })
      })
    })

  	cb();
  },



};
