//var CK_normalisation = {
module.exports = {
  //////////////////////////////////////////
  // STATUT
  ////////////////////////////////////////// 
  get_normalisations : function(elements,cb){
    var suggestions = [];
    elements.forEach(function(el){
      var new_suggestion = CK_normalisation.get_normalisation(el);
      suggestions.push(new_suggestion);
    });


    
    if(cb) cb(suggestions);
    else return suggestions;
  },
  get_normalisation : function(element,cb){
    var suggestion = {};
    var normalized = false;

    if(element.type == "concept"){
      if(!element.css_manu) suggestion = CK_text.suggestions().s00;
      else if(element.css_manu == "") suggestion = CK_text.suggestions().s00;
      else{
        suggestion = CK_text.suggestions().s02;
        normalized = true;
      }
      suggestion.normalized = normalized;
    }else if(element.type == "knowledge"){
      if(!element.css_manu) suggestion = CK_text.suggestions().s01;
      else if(element.css_manu == "") suggestion = CK_text.suggestions().s01;
      else{
        suggestion = CK_text.suggestions().s03;
        normalized = true;
      }
      suggestion.normalized = normalized;
      suggestion.localisation = this.get_localisation(element);
    }
    suggestion.element = element;

    if(cb) cb(suggestion);
    else return suggestion;
  },
  get_localisation : function(element,cb){
    var suggestions = {};

    if(!element.indside) suggestion = CK_text.suggestions().s04;
    else if(element.inside == "") suggestion = CK_text.suggestions().s04;
    else if(element.inside == true) suggestion = CK_text.suggestions().s05;
    else if(element.inside == false) suggestion = CK_text.suggestions().s06;

    if(cb) cb(suggestion);
    else return suggestion;
  },
  //////////////////////////////////////////
}