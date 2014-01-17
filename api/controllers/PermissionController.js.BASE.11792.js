/**
 * PermissionController
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
		Tag.findOne(req.body.id).done(function(err,tag){
			if (tag){
					Tag.update({
						id : req.body.id
					},req.body).done(function(err,t){
						if(err) res.send({err:err});
						res.send(t);
					})
			}
			else{
				Tag.create(req.body).done(function(err, t){
					res.send(t)
				})
			}
		})
	},

};
