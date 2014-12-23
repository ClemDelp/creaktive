/**
 * TimelaController
 *
 * @description :: Server-side logic for managing timelas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	timelaview : function(req,res){
		console.log("Loading timela view")
		BootstrapService.bootstrapdata(req,res);
	},
};

