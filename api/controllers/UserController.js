/**
 * UserController
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
		User.findOne(req.body.id).done(function(err,user){
			if (user){
					User.update({
						id : req.body.id
					},req.body).done(function(err,u){
						if(err) res.send({err:err});
						res.send(u);
					})
			}
			else{
				User.create(req.body).done(function(err, u){
					res.send(u)
				})
			}
		})
	},
};
