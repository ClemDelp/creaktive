/**
 * Project
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


module.exports = {
autoPK : false,
  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  },

  beforeDestroy : function (values, cb){
    Permission.find({
      project_id : values.id
    }).done(function(err, perms){
      _.each(perms, function(p){
        p.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

    cb();
  },

  beforeCreate : function (values, cb){

    Concept.create({
  		id : guid(),
  		title : "c0",
      content :"",
  		date : getDate(),
  		position : 0,
  		project : values.id,
      comments : [],
      members:[],
      attachment:[]

  	}).done(function(err, c0){
  		if(err) console.log(err);
  		cb();
  	});
  }

};
