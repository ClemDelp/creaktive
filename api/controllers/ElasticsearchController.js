/**
 * ElasticsearchController
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
   * /elasticsearch/ping
   */ 
  pingServer: function (req,res) {
    sails.config.elasticsearch.pingServer();
  },

  searchKnowledge : function(req,res){
    sails.config.elasticsearch.searchKnowledge(req.param('nodeTitle'),function(json){
      res.send(json);
    });
  }

};
