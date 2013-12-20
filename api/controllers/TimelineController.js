/**
 * TimelineController
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
  update : function(req, res){
  	Timeline.findOne(req.body.id).done(function(err, concept){
  		if(err) res.send(err);
  		if(concept){
  			Timeline.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Timeline.create(req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			})
  		}
  	})
  }

};
