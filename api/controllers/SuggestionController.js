/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	get_statuts : function(req,res){
		CK_analyse.get_statuts(req.body.elements,function(statuts){
			res.send(statuts);
		});
	},
	get_localisations : function(req,res){
		CK_analyse.get_localisations(req.body.elements,function(localisations){
			res.send(localisations);
		});
	},
	get_v2or_values : function(req,res){
		CK_analyse.get_v2or_values(req.body.elements, req.body.links, function(v2or_values){
			res.send(v2or_values);
		});

	},
	get_v2or_analyse : function(req,res){
		CK_analyse.get_v2or_analyse(req.body.elements, req.body.links, function(analyses){
			res.send(analyses);
		});

	},
	get_explorations_analyse : function(req,res){
		CK_analyse.get_exploration_suggestions(req.body.elements, function(explorations){
			res.send(explorations);
		});
	},
	analyse_cadrage_keywords : function(req,res){
		CK_analyse.analyse_cadrage_keywords(req.body.elements, function(analyse){
			res.send(analyse);
		});
	},
};

