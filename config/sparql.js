var sparql = require('sparql');

module.exports.sparql = {
    query : function(category,callback){
        var client = new sparql.Client('http://fr.dbpedia.org/sparql');
        client.query('SELECT * WHERE { <http://fr.dbpedia.org/resource/'+category+'> ?r ?p } LIMIT 1000', function(err, res){
          console.log(res);
          callback(res);
        });
    }
}
