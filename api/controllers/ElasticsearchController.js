/**
 * ElasticsearchController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var elasticsearch = require('elasticsearch');

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  /**
   * /elasticsearch/index
   */ 
  index: function (req,res) {
    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
      host: 'https://x6m7jy5h:iynnxxbn54x3ip8o@pine-2612821.us-east-1.bonsai.io/',
      log: 'trace'
    });

    // var client = new elasticsearch.Client({
    //   host: 'https://x6m7jy5h:iynnxxbn54x3ip8o@pine-2612821.us-east-1.bonsai.io/',
    //   sniffOnStart: true,
    //   sniffInterval: 60000,
    // });

    client.ping({
      requestTimeout: 1000,
      // undocumented params are appended to the query string
      hello: "elasticsearch!"
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });


    // client.cluster.health(function (err, resp) {
    //   if (err) {
    //     console.error("err cluster health",err.message);
    //   } else {
    //     console.dir("cluster health",resp);
    //   }
    // });

    // index a document
    // client.index({
    //   index: 'blog',
    //   type: 'post',
    //   id: 1,
    //   body: {
    //     title: 'JavaScript Everywhere!',
    //     content: 'It all started when...',
    //     date: '2013-12-17'
    //   }
    // }, function (err, resp) {
    //   if (err) {
    //     console.error("lalala",err.message);
    //   } else {
    //     console.dir(resp);
    //   }
    // });
    // This will render the view: 
    // /home/barth/creaktive/views/elasticsearch/index.ejs
    

  },


  /**
   * /elasticsearch/query
   */ 
  query: function (req,res) {

    // This will render the view: 
    // /home/barth/creaktive/views/elasticsearch/query.ejs
    res.view();

  }

};
