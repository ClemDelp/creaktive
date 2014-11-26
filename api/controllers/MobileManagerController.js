/**
 * MobileManagerController
 *
 * @description :: Server-side logic for managing mobilemanagers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	mobileManagerview : function(req,res){
	    console.log("Loading mobileManager view")
	    BootstrapService.bootstrapmanager(req,res);
	},
};

