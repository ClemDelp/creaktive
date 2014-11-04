/**
 * PublicVisuController
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
  publicvisuview : function(req,res){
    console.log("Loading public visu view")
    BootstrapService.bootstrapPublicData(req,res);
  },

};
