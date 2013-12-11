/**
 * GroupController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  

  update : function(req,res){
  	Group.findOne(req.body.id).done(function(err, group){
  		if(err) res.send(err);
  		if(group){
  			Group.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Group.create(req.body).done(function(err,g){
  				if(err) res.send(err)
  				res.send(g);
  			})
  		}
  	})
  },


};
