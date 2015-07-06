var CK_normalisation = {
  //////////////////////////////////////////
  // STATUT
  ////////////////////////////////////////// 
  get_normalisations : function(elements,cb){
    var normalisations = {};
    // Color / statut
    normalisations.statuts = [];
    elements.forEach(function(el){
      if((el.type == "concept")||(el.type == "knowledge")) normalisations.statuts.push(CK_normalisation.get_normalisation(el));
    });
    // Knowledge localisation
    normalisations.localisations = [];
    elements.forEach(function(el){
      if(el.type == "knowledge") normalisations.localisations.push(CK_normalisation.get_localisation(el));
    });

    if(cb) cb(normalisations);
    else return normalisations;
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
    }
    suggestion.element = element;

    if(cb) cb(suggestion);
    else return suggestion;
  },
  get_localisation : function(element,cb){
    var suggestion = {};

    if(!element.inside) suggestion = CK_text.suggestions().s04;
    else if(element.inside == "inside") suggestion = CK_text.suggestions().s05;
    else if(element.inside == "outside") suggestion = CK_text.suggestions().s06;
    else suggestion = CK_text.suggestions().s04;

    suggestion.element = element;
    
    if(cb) cb(suggestion);
    else return suggestion;
  },
  //////////////////////////////////////////
}

module.exports = Object.create(CK_normalisation);