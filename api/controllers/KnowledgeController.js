/**
 * KnowledgeController
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
		Knowledge.findOne(req.body.id).done(function(err,knowledge){
			if (knowledge){
					Knowledge.update({
						id : req.body.id
					},req.body).done(function(err,k){
						if(err) res.send({err:err});
						res.send(k);
					})
			}
			else{
				Knowledge.create(req.body).done(function(err, k){
					res.send(k)
				})
			}
		})
	},
};
