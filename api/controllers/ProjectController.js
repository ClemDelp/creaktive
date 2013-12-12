/**
 * ProjectController
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
		Project.findOne(req.body.id).done(function(err,project){
			if (project){
					Project.update({
						id : req.body.id
					},req.body).done(function(err,p){
						if(err) res.send({err:err});
						res.send(p);
					})
			}
			else{
				Project.create(req.body).done(function(err, p){
					res.send(p)
				})
			}
		})
	},

};
