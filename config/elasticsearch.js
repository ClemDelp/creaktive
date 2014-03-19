var elasticsearch = require('elasticsearch');

module.exports.elasticsearch = {
    
    client : elasticsearch.Client({
      host: 'https://4peanmep:29jdygzgbu8viq9g@redwood-73726.us-east-1.bonsai.io/',
      log: 'trace'
    }),
    
    pingServer : function(){
        this.client.ping({
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
    },
    
    indexKnowledge : function(){
        this.client.index({
          index: 'acme-production',
          type: 'mytype',
          id: '3',
          body: {
            title: 'Test 1',
            tags: ['y', 'z'],
            published: true,
          }
        }, function (error) {
            if (error) {
                console.error('error impossible to index!',error);
              } else {
                console.log('Knowledge indexed!');
              }
        });
    },

    updateKnowledge : function(){

    },

    query : function(){

    },

    remove : function(){

    }

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
}
