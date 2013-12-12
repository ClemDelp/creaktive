/**
 * LinkController
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
		Link.findOne(req.body.id).done(function(err,link){
			if (link){
					Link.update({
						id : req.body.id
					},req.body).done(function(err,l){
						if(err) res.send({err:err});
						res.send(l);
					})
			}
			else{
				Link.create(req.body).done(function(err, l){
					res.send(l)
				})
			}
		})
	},
};
