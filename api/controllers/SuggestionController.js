/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	get_normalisations : function(req,res){
		CK_normalisation.get_normalisations(req.body.elements, function(array){
			res.send(array);
		});
	},
	get_evaluations : function(req,res){
		// evaluation
		CK_evaluation.get_evaluations_notes(req.body.elements, req.body.links, function(notes){
			CK_evaluation.get_all_evaluations(req.body.elements, req.body.links, function(evaluations){
				res.send({"notes":notes,"evaluations":evaluations});
			});
		});
	},
};

