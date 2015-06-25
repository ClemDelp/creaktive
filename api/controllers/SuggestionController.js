/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	get_normalisations : function(req,res){
		CK_normalisation.get_normalisations(req.body.elements,function(normalisations){
			res.send(normalisations);
		});
	},
	get_evaluations : function(req,res){
		// evaluation
		CK_evaluation.get_evaluation_eval(req.body.elements, req.body.links, function(evaluations){
			CK_evaluation.get_all_evaluation_suggestions(req.body.elements, req.body.links, function(suggestions){
				res.send({"evaluations":evaluations,"suggestions":suggestions});
			});
		});
	},
};

