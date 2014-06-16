/**
 * SparqlController
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
  
  /**
   * /sparql/query
   */ 
  query: function (req,res) {
    sails.config.sparql.query(req.param('category'),function(json){
      res.send(json);
    });
  }

};
