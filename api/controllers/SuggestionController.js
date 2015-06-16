/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getNormalized : function(req,res){
		// statut
		CK_normalisation.get_normalized(req.body.elements, req.body.links, function(json){
			res.send(json);
		});
	},
	getNotNormalized : function(req,res){
		// normalisation
		CK_normalisation.get_not_normalized(req.body.elements, req.body.links, function(json){
			res.send(json);
		});
	},
	getEvaluations : function(req,res){
		// evaluation
		CK_evaluation.get_evaluations_notes(req.body.elements, req.body.links, function(notes){
			CK_evaluation.get_all_evaluations(req.body.elements, req.body.links, function(evaluations){
				res.send({"notes":notes,"evaluations":evaluations});
			});
		});
	},
};

