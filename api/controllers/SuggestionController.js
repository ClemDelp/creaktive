/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getSuggestions : function(req,res){
		SuggestionAlgo.get_all_suggestions(req.body.elements, req.body.links, function(json){
			res.send(json);
		});
	}
};

