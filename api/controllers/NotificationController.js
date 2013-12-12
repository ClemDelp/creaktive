/**
 * NotificationController
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
		Notification.findOne(req.body.id).done(function(err,notification){
			if (notification){
					Notification.update({
						id : req.body.id
					},req.body).done(function(err,n){
						if(err) res.send({err:err});
						res.send(n);
					})
			}
			else{
				Notification.create(req.body).done(function(err, n){
					res.send(n)
				})
			}
		})
	},

};
