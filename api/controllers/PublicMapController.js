/**
 * PublicMapController
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
  
  publicmapview : function (req,res){
   	console.log('Loading public map view')
   	BootstrapService.bootstrapPublicMap(req,res);
   
	  

  },

};
