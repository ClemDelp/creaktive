/**
 * MobileInterfaceController
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
  mobileInterfaceview : function(req,res){
    console.log("Loading mobileInterface view")
    BootstrapService.bootstrapmanager(req,res);
  },

};
