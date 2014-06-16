/**
 * AnalyseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  analyseview : function(req,res){
   sails.config.bootstrapdata.bootstrapdata(req,res);
  }

};
