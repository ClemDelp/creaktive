
// var elasticsearch = require('elasticsearch');

// module.exports.elasticsearch = {
//     /////////////////////////////////////
//     // Utilities PART
//     /////////////////////////////////////
//     client : elasticsearch.Client({
//       host: 'https://4peanmep:29jdygzgbu8viq9g@redwood-73726.us-east-1.bonsai.io/',
//       log: 'trace'
//     }),
//     pingServer : function(){
//         this.client.ping({
//           requestTimeout: 1000,
//           // undocumented params are appended to the query string
//           hello: "elasticsearch!"
//         }, function (error) {
//           if (error) {
//             console.error('elasticsearch cluster is down!');
//           } else {
//             console.log('All is well');
//           }
//         });
//     },
//     /////////////////////////////////////
//     // Knowledge PART
//     /////////////////////////////////////
//     indexKnowledge : function(json){
//         this.client.index({
//           index: 'creaktive',
//           type: 'knowledge',
//           id: json.id,
//           body: json
//         }, function (error) {
//             if (error) {
//               console.error('error impossible to index knwoledge!',error);
//             } else {
//               console.log('Knowledge indexed!');
//             }
//         });
//     },
//     searchKnowledge : function(val,callback){
//       this.client.search({
//         index: 'creaktive',
//         type: 'knowledge',
//         q: val
//       }, function (error, response) {
//         callback(response);
//       });
//     },
//     removeKnowledge : function(){},
//     /////////////////////////////////////
//     // Concept PART
//     /////////////////////////////////////
//     indexConcept : function(json,callback){
//         this.client.index({
//           index: 'creaktive',
//           type: 'concept',
//           id: json.id,
//           body: json
//         }, function (error) {
//             if (error) {
//               console.error('error impossible to index concept!',error);
//               callBack({response:"error",json:error});
//             } else {
//               console.log('Concept indexed!');
//               callback({response:"success"});
//             }
//         });
//     },
//     searchConcept : function(){},
//     removeConcept : function(){},
//     /////////////////////////////////////
//     // Attachement PART
//     /////////////////////////////////////
//     indexAttachement : function(){

//     }
//     /////////////////////////////////////
// }

