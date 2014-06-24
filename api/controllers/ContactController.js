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
   	sails.config.bootstrapdata.bootstrapmanager(req,res);
  }

};
