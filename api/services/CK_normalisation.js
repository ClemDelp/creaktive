//var CK_normalisation = {
module.exports = {
  //////////////////////////////////////////
  // STATUT
  ////////////////////////////////////////// 
  get_normalized : function(elements,links,cb){
    var c = [];
    var k = [];
    elements.forEach(function(el){
      if(el.type == "concept"){
        if(el.css_manu) c.unshift(el)
        else if(el.css_manu != "") c.unshift(el)
      }
      else if(el.type == "knowledge"){
        if(el.css_manu) k.unshift(el)
        else if(el.css_manu != "") k.unshift(el)
      }
    });
    var concepts = {
      "elements" : c,
      "suggestions" : CK_text.normalisation.s02.fr,
      "propositions" : CK_text.normalisation.s02.propositions,
    };
    var knowledges = {  
      "elements" : k,
      "suggestions" : CK_text.normalisation.s03.fr,
      "propositions" : CK_text.normalisation.s03.propositions,
    };

    var normalized = {"concepts" : concepts, "knowledges" : knowledges};
    if(cb) cb(normalized);
    else return normalized;
  },
  get_not_normalized : function(elements,links,cb){
    var c = [];
    var k = [];
    elements.forEach(function(el){
      if(el.type == "concept"){
        if(!el.css_manu) c.unshift(el)
        else if(el.css_manu == "") c.unshift(el)
      }
      else if(el.type == "knowledge"){
        if(!el.css_manu) k.unshift(el)
        else if(el.css_manu == "") k.unshift(el)
      }
    });
    var concepts = {
      "elements" : c,
      "suggestions" : CK_text.normalisation.s00.fr,
      "propositions" : CK_text.normalisation.s00.propositions,
    };
    var knowledges = {  
      "elements" : k,
      "suggestions" : CK_text.normalisation.s01.fr,
      "propositions" : CK_text.normalisation.s01.propositions,
    };

    var not_normalized = {"concepts" : concepts, "knowledges" : knowledges};
    if(cb) cb(not_normalized);
    else return not_normalized;
  },
  //////////////////////////////////////////
}