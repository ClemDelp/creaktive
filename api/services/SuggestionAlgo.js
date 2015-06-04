//SuggestionAlgo = {
module.exports = {
  //////////////////////////////////////////
  get_all_suggestions : function(elements,links,cb){
    var suggestions = {
      "level_1" : SuggestionAlgo.get_not_normalize(elements),
      "level_2" : _.union(SuggestionAlgo.get_originality_suggest(elements),[]),
    };
    cb(suggestions);
  },
  //////////////////////////////////////////
  // STATUT
  getKnowledgeByStatus : function(elements){
      var k_validees = _.where(elements,{"type" : "knowledge", "css_manu" : "k_validees"});
      var k_encours = _.where(elements,{"type" : "knowledge", "css_manu" : "k_encours"});
      var k_manquante = _.where(elements,{"type" : "knowledge", "css_manu" : "k_manquante"});
      var k_indesidable = _.where(elements,{"type" : "knowledge", "css_manu" : "k_indesidable"});
      return {"k_validees" : k_validees, "k_encours" : k_encours, "k_manquante" : k_manquante, "k_indesidable" : k_indesidable};
  },
  getConceptByStatus : function(elements){
      var c_connu = _.where(elements,{"type" : "concept", "css_manu" : "c_connu"});
      var c_atteignable = _.where(elements,{"type" : "concept", "css_manu" : "c_atteignable"});
      var c_alternatif = _.where(elements,{"type" : "concept", "css_manu" : "c_alternatif"});
      var c_hamecon = _.where(elements,{"type" : "concept", "css_manu" : "c_hamecon"});
      return {"c_connu" : c_connu, "c_atteignable" : c_atteignable, "c_alternatif" : c_alternatif, "c_hamecon" : c_hamecon};
  },  
  get_not_normalize : function(elements){
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
      "suggestions" : SuggestionText.s00.fr,
      "propositions" : SuggestionText.s00.propositions,
    };
    var knowledges = {  
      "elements" : k,
      "suggestions" : SuggestionText.s01.fr,
      "propositions" : SuggestionText.s01.propositions,
    };
    return {"concepts" : concepts, "knowledges" : knowledges};
  },
  //////////////////////////////////////////
  // ORIGINALITY EVALUATION & SUGGESTION
  get_originality_eval_patrick : function(elements){
      var concepts = SuggestionAlgo.getConceptByStatus(elements);
      // si il y a 4 couleurs en C
      var originality = concepts.c_connu.length + concepts.c_atteignable.length + concepts.c_alternatif.length + concepts.c_hamecon.length
      return originality;
  },
  get_originality_eval_mines : function(elements){
      var concepts = SuggestionAlgo.getConceptByStatus(elements);
      // partitions expansive/partitions restrictives = (alternative + hamecon)/(dominante design + K atteignable)
      var originality = (concepts.c_alternatif.length + concepts.c_hamecon.length)/(concepts.c_connu.length + concepts.c_atteignable.length)
      return originality;
  },
  get_originality_suggest : function(elements){
    var suggestions = []; 
    suggestions = _.union(suggestions, SuggestionAlgo.get_originality_patrick_suggest(elements));
    suggestions = _.union(suggestions, SuggestionAlgo.get_originality_mines_suggest(elements));
    return suggestions;
  },
  get_originality_patrick_suggest : function(elements){
    var suggestions = [];  
    var concepts = SuggestionAlgo.getConceptByStatus(elements);
    // Originality Patrick
    var originality_patrick = SuggestionAlgo.get_originality_eval_patrick(elements);
    if(originality_patrick < 4){
      if(concepts.c_connu.length>0) suggestions.unshift(SuggestionText.s0.fr,SuggestionText.s1.fr);
      // faire des suggestions avec du contenu web ???
    }else if(originality_patrick == 4){
      suggestions.unshift(SuggestionText.s2.fr,SuggestionText.s3.fr);
    }
    // Si il n'y a aucun C connu
    if(concepts.c_connu.length == 0) suggestions.unshift(SuggestionText.s4.fr); 
    // Si il n'y a aucun C atteignable
    if(concepts.c_atteignable.length == 0) suggestions.unshift(SuggestionText.s5.fr); 
    // Si il n'y a aucun C alternatif
    if(concepts.c_alternatif.length == 0) suggestions.unshift(SuggestionText.s6.fr); 
    // Si il n'y a aucun C hamecon
    if(concepts.c_hamecon.length == 0) suggestions.unshift(SuggestionText.s8.fr); 
    // Si il n'y a que des atteignable + alternatif
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length == 0)&&(concepts.c_atteignable.length > 0)&&(concepts.c_alternatif.length > 0)) suggestions.unshift(SuggestionText.s9.fr); 
    // Si il n'y a que des alternatif + hamecon
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length > 0)&&(concepts.c_atteignable.length == 0)&&(concepts.c_alternatif.length > 0)) suggestions.unshift(SuggestionText.s10.fr); 

    return suggestions;
  },
  get_originality_mines_suggest : function(elements){
    var suggestions = [];  
    var concepts = SuggestionAlgo.getConceptByStatus(elements);
    // Origianlity des Mines
    var originality_mines = SuggestionAlgo.get_originality_eval_mines(elements);
    if(originality_mines > 1){
      suggestions.unshift(SuggestionText.s11.fr);
    }else if(originality_mines < 1){
      suggestions.unshift(SuggestionText.s12.fr);
    }else{
      // ???
    }
    return suggestions;
  },
  //////////////////////////////////////////
  // VALEUR SUGGESTION
  // calcul de la valeur (nbre de new K*concepts generated) / K validees
  get_valeur_eval : function(elements,links){
      var knowledges = SuggestionAlgo.getKnowledgeByStatus(elements);
      // nouvelles connaissances = toutes sauf les validees
      var new_k = _.union(knowledges.k_encours, knowledges.k_manquante, knowledges.k_indesidable);
      // nombre de concepts générés par les nouvelles K
      var concepts_generated = [];
      new_k.forEach(function(k){
          concepts_generated = _.union(concepts_generated, api.getTypeLinkedToModel(links,elements,k,"concept"));
      });
      //
      var valeur = (new_k.length * concepts_generated.length) / knowledges.k_validees.length;
      return valeur;
  },
  get_valeur_suggest : function(elements){
      var valeur = SuggestionAlgo.get_valeur_eval(elements);
      var suggestions = [];
      if(valeur < 10){ // ???
          // ???
      }else{
          // ???
      }
  },
  //////////////////////////////////////////
  // ROBUSTESS
  // robustess = k interne / k externe
  get_robustesse_eval : function(elements){
      var knowledges = SuggestionAlgo.getKnowledgeByStatus(elements);
      var k_interne = knowledges.k_validees
      var k_externe = _.union(knowledges.k_indesidable, knowledges.k_manquante, knowledges.k_encours)
      //
      var robustess = k_interne.length / k_externe.length;
      return robustess;
  },
  get_robustesse_suggest : function(elements){
      var robustess = SuggestionAlgo.get_robustesse_eval(elements);
      var suggestions = [];
      if(robustess > 1){ // robust
          suggestions.unshift(SuggestionText.s7.fr,SuggestionText.s8.fr)
      }else{ // not robust enought
          suggestions.unshift(SuggestionText.s5.fr,SuggestionText.s4.fr)
      }
      return suggestions;
  },
  //////////////////////////////////////////
  // Variété = nombre de branches & sous-branches par rapport au dominant design
  get_variete_eval : function(elements){
      var concepts = SuggestionAlgo.getConceptByStatus(elements);
      //
      var variete = (concepts.c_hamecon.length + concepts.c_alternatif.length + concepts.c_atteignable.length) / concepts.c_connu.length;
      return variete;
  },
  get_variete_suggest : function(elements){
      var variete = SuggestionAlgo.get_variete_eval(elements)
      var suggestions = [];
      // ???
      return suggestions;
  },
  //////////////////////////////////////////
  // EQUILIBRE
  get_equilibre_eval : function(elements){
      var equilibre = elements.where({type : "concept"}).length / elements.where({type : "knowledge"}).length;
      return equilibre;
  },
  get_equilibre_suggest : function(elements){
      var equilibre = SuggestionAlgo.get_equilibre_eval(elements);
      // !!!! inclure par default un pourcentage de l'équilibre en suggestion !!!!!!!!!!!!!!!
      var suggestions = [];
      if(equilibre > 1){ // plus de C que de K
        //vérifier avec les liens !!! Car il peut y avoir un équilibre mais pas de lien
          suggestions.unshift(SuggestionText.s2.fr)
      }else if(equilibre < 1){ // plus de K que de C
          suggestions.unshift(SuggestionText.s3.fr)
      }else if(equilibre == 1){ // equilibre parfait

      }
      return suggestions;
  },
  //////////////////////////////////////////
  // RISQUE
  get_risque_suggest : function(elements){
      var risque = SuggestionAlgo.get_risque_eval(elements);
      var suggestions = [];
      return suggestions;
  },
}