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
  ping: function (req,res) {
    // This will render the view: 
    // /home/clem/creaktive/views/elasticsearch/ping.ejs
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    sails.config.elasticsearch.indexKnowledge();
    res.view({currentUser:JSON.stringify(req.session.user)});

  },


  /**
   * /elasticsearch/index
   */ 
  index: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/elasticsearch/index.ejs
    res.view();

  },


  /**
   * /elasticsearch/udupdate
   */ 
  udupdate: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/elasticsearch/udupdate.ejs
    res.view();

  },


  /**
   * /elasticsearch/remove
   */ 
  remove: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/elasticsearch/remove.ejs
    res.view();

  }

};
