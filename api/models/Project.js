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

  beforeCreate : function (values, cb){

    Concept.create({
  		id : guid(),
  		title : "c0",
  		date : getDate(),
  		position : 0,
  		project : values.id
  	}).done(function(err, c0){
  		if(err) console.log(err);
  		cb();
  	});
  }

};
