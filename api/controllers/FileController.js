/**
 * FileController
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

  upload : function (req,res){
  	console.log("Received ",req.body)
  	res.send(req.body)
  }
  

};
