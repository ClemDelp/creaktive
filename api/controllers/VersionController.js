/**
 * VersionController
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
		Version.findOne(req.body.id).done(function(err,version){
			if (version){
					Version.update({
						id : req.body.id
					},req.body).done(function(err,v){
						if(err) res.send({err:err});
						res.send(v);
					})
			}
			else{
				Version.create(req.body).done(function(err, v){
					res.send(v)
				})
			}
		})
	},
};
