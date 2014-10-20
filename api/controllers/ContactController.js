/**
 * ContactController
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
  contactview : function(req,res){
  	console.log("Loading contact view")
   	BootstrapService.bootstrapmanager(req,res);
  }

};
