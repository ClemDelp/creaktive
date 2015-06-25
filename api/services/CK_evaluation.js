var CK_evaluation = {
  //////////////////////////////////////////
  get_all_evaluation_suggestions : function(elements,links,cb){
    ////////////////////////////////////
    // Init
    var suggestions = [];
    var knowledges = this.get_knowledge_by_statut(elements);
    var concepts = this.get_concept_by_statut(elements);
    var originality = CK_evaluation.get_originality_eval(elements);
    var variety = CK_evaluation.get_variete_eval(elements);
    var strength = CK_evaluation.get_robustesse_eval(elements);
    var value = CK_evaluation.get_valeur_eval(elements,links);
    var partitions_expansives = CK_evaluation.get_partitions_expansives(concepts);
    var partitions_restrictives = CK_evaluation.get_partitions_restrictives(concepts);
    // ORIGINALITY
    suggestions.push(CK_evaluation.get_originality_suggestions(originality.options[0].value,concepts.c_connu.length));
    // LOCALISATION
    suggestions.push(CK_evaluation.get_localisation_suggestions(_.where(elements,{type:"knowledge"})));
    // PARTITIONS
    suggestions.push(CK_evaluation.get_partitions_expansives_suggestions(partitions_expansives));
    suggestions.push(CK_evaluation.get_partitions_restrictives_suggestions(partitions_restrictives));
    // MISS CONCEPT COLOR
    suggestions.push(CK_evaluation.get_miss_color_suggestions(concepts));
    // MISS ELEMENT TYPE
    suggestions.push(CK_evaluation.get_miss_element_type_suggestions(elements));
    // VALEUR
    if(value < 10){ // ???
        // ???
    }else{
        // ???
    }
    ////////////////////////////////////
    // ROBUSTESSE
    if(strength > 1){ // robust
        suggestions.push(CK_text.suggestions().s7,CK_text.suggestions().s8)
    }else{ // not robust enought
        suggestions.push(CK_text.suggestions().s5,CK_text.suggestions().s4)
    }
    
    suggestions = _.union(_.compact(_.flatten(suggestions)));
    if(cb) cb(suggestions);
    else return suggestions;
  },
  get_evaluation_eval : function(elements,links,cb){
    
    var evaluation = {
      "originality" : CK_evaluation.get_originality_eval(elements),
      "variety" : CK_evaluation.get_variete_eval(elements),
      "strength" : CK_evaluation.get_robustesse_eval(elements),
      "value" : CK_evaluation.get_valeur_eval(elements,links) 
    }

    if(cb) cb(evaluation);
    else return evaluation;
  },
  //////////////////////////////////////////
  // OTHER FUNCTIONS
  get_partitions_expansives : function(concepts){
    return (concepts.c_alternatif.length + concepts.c_hamecon.length);
  },
  get_partitions_restrictives : function(concepts){
    return (concepts.c_connu.length + concepts.c_atteignable.length);
  },
  get_c_colors_number : function(concepts){
    return (concepts.c_connu.length + concepts.c_atteignable.length + concepts.c_alternatif.length + concepts.c_hamecon.length);
  },
  get_knowledge_by_statut : function(elements){
      var k_validees = _.where(elements,{"type" : "knowledge", "css_manu" : "k_validees"});
      var k_encours = _.where(elements,{"type" : "knowledge", "css_manu" : "k_encours"});
      var k_manquante = _.where(elements,{"type" : "knowledge", "css_manu" : "k_manquante"});
      var k_indesidable = _.where(elements,{"type" : "knowledge", "css_manu" : "k_indesidable"});
      var k_empty = _.where(elements,{"type" : "knowledge", "css_manu" : ""});
      _.forEach(elements,function(element){
        if((element.css_manu == undefined)&&(element.type == "knowledge")) k_empty = _.union(k_empty,[element]); 
      })
      return {"k_empty" : k_empty, "k_validees" : k_validees, "k_encours" : k_encours, "k_manquante" : k_manquante, "k_indesidable" : k_indesidable};
  },
  get_concept_by_statut : function(elements){
      var c_connu = _.where(elements,{"type" : "concept", "css_manu" : "c_connu"});
      var c_atteignable = _.where(elements,{"type" : "concept", "css_manu" : "c_atteignable"});
      var c_alternatif = _.where(elements,{"type" : "concept", "css_manu" : "c_alternatif"});
      var c_hamecon = _.where(elements,{"type" : "concept", "css_manu" : "c_hamecon"});
      var c_empty = _.where(elements,{"type" : "concept", "css_manu" : ""});
      _.forEach(elements,function(element){
        if((element.css_manu == undefined)&&(element.type == "concept")) c_empty = _.union(c_empty,[element]);
      })
      return {"c_empty" : c_empty, "c_connu" : c_connu, "c_atteignable" : c_atteignable, "c_alternatif" : c_alternatif, "c_hamecon" : c_hamecon};
  },
  //////////////////////////////////////////
  // EVALUATION EVAL

  // partitions expansive/partitions restrictives = (alternative + hamecon)/(dominante design + C atteignable)
  get_originality_eval : function(elements){
      var concepts = this.get_concept_by_statut(elements);
      var originality = CK_text.suggestions().s_originality;
      var option = originality.options[0];
      // Eval Patrick
      var originality_P = CK_evaluation.get_c_colors_number(concepts);
      // Eval Mines
      var originality_M = 0;
      var partitions_expansives = CK_evaluation.get_partitions_expansives(concepts);
      var partitions_restrictives = CK_evaluation.get_partitions_restrictives(concepts);
      if((partitions_restrictives == 0)&&(partitions_restrictives == 0)) originality_M = 0; 
      else if((partitions_restrictives > 0)&&(partitions_restrictives == 0)) originality_M = 0;
      else originality_M = (partitions_expansives/partitions_restrictives);
      // Moyenne des originalities
      option.value = Math.round(((originality_M+originality_P)/2)*100)/100;

      return originality;
  },
  // valeur = (new K / all K)*(new C generee par les new K / all C)
  get_valeur_eval : function(elements,links){
      var valeur = CK_text.suggestions().s_value;
      var option = valeur.options[0];

      var knowledges = this.get_knowledge_by_statut(elements);
      var concepts = this.get_concept_by_statut(elements);

      var new_k = _.union(knowledges.k_empty, knowledges.k_encours, knowledges.k_manquante, knowledges.k_indesidable);
      var concepts_generated = [];
      new_k.forEach(function(k){
        // nombre de concepts générés par les nouvelles K
        concepts_generated = _.union(concepts_generated, api.getTypeLinkedToModel(links,elements,k,"concept"));
      });
      var all_k = knowledges.k_empty.length + knowledges.k_encours.length + knowledges.k_manquante.length + knowledges.k_indesidable.length + knowledges.k_validees.length ;
      var all_c = concepts.c_empty.length + concepts.c_connu.length + concepts.c_atteignable.length + concepts.c_hamecon.length + concepts.c_alternatif.length;
      // CALCULS
      if(all_k == 0) option.value = 0;
      else if(all_c == 0) option.value = 0;
      else option.value = Math.round(((new_k.length * concepts_generated.length) / (all_k * all_c))*100)/100;

      return valeur;
  },
  // robustess = k interne / k externe
  get_robustesse_eval : function(elements){
      var strength = CK_text.suggestions().s_strength;
      var option = strength.options[0];

      var k_inside = _.where(elements,{type: "knowledge", inside : "inside"});
      var k_outside = _.where(elements,{type: "knowledge", inside : "outside"});
      if((k_inside.length == 0)&&(k_outside.length == 0)) option.value = 0;
      else if(k_outside.length == 0) option.value = 0;
      else option.value = Math.round((k_inside.length / k_outside.length)*100)/100;

      return strength;
  },
  // Variété = nombre de branches & sous-branches par rapport au dominant design
  get_variete_eval : function(elements){
      var concepts = this.get_concept_by_statut(elements);
      
      var variete = CK_text.suggestions().s_variety;
      var option = variete.options[0];

      var no_dd = (concepts.c_hamecon.length + concepts.c_alternatif.length + concepts.c_atteignable.length);
      var dd = concepts.c_connu.length;
      // calculs
      if(concepts.length == 0) option.value = 0;
      else if(dd == 0) option.value = 0;
      else if(no_dd == 0) option.value = 0;
      else option.value =  Math.round((no_dd/dd)*100)/100;

      return variete;
  },
  get_equilibre_eval : function(elements){
      var equilibre = _.where(elements,{type : "concept"}).length / _.where(elements,{type : "knowledge"}).length;
      return equilibre;
  },
  //////////////////////////////////////////
  // SUGGESTION
  get_miss_element_type_suggestions : function(elements){
    var suggestions = [];
    if(_.where(elements,{type:"knowledge"}).length == 0) suggestions.push(CK_text.suggestions().no_knowledge);
    if(_.where(elements,{type:"concept"}).length == 0) suggestions.push(CK_text.suggestions().no_concept);
    return suggestions;
  },
  get_localisation_suggestions : function(knowledges){
    var suggestions = [];
    var inside = [];
    var outside = [];
    knowledges.forEach(function(knowledge){
      if(knowledge.inside == "inside") inside.push(knowledge);
      else if(knowledge.inside == "outside") outside.push(knowledge);
    });
    if(inside.length == 0) suggestions.push(CK_text.suggestions().no_inside)
    if(outside.length == 0) suggestions.push(CK_text.suggestions().no_outside)

    return suggestions;
  },
  get_partitions_expansives_suggestions : function(p_expansives){
    var suggestions = [];
    if(p_expansives == 0) suggestions.push(CK_text.suggestions().no_expansive);
    return suggestions;
  },
  get_partitions_restrictives_suggestions : function(p_restrictives){
    var suggestions = [];
    if(p_restrictives == 0) suggestions.push(CK_text.suggestions().no_restrictive);
    return suggestions;
  },
  get_originality_suggestions : function(originality,c_connu){
    var suggestions = [];
    if(originality < 4){
      suggestions.push(CK_text.suggestions().s12);
      if(c_connu > 0) suggestions.push(CK_text.suggestions().s0,CK_text.suggestions().s1);
      // faire des evaluations avec du contenu web ???
    }
    if(originality > 1){
      suggestions.push(CK_text.suggestions().s11);
    }
    if(originality == 4){
      suggestions.push(CK_text.suggestions().s2,CK_text.suggestions().s3);
    }
    return suggestions;
  },
  get_miss_color_suggestions : function(concepts){
    var suggestions = [];
    // Si il n'y a aucun C connu
    if(concepts.c_connu.length == 0) suggestions.push(CK_text.suggestions().s4); 
    // Si il n'y a aucun C atteignable
    if(concepts.c_atteignable.length == 0) suggestions.push(CK_text.suggestions().s5); 
    // Si il n'y a aucun C alternatif
    if(concepts.c_alternatif.length == 0) suggestions.push(CK_text.suggestions().s6); 
    // Si il n'y a aucun C hamecon
    if(concepts.c_hamecon.length == 0) suggestions.push(CK_text.suggestions().s8); 
    // Si il n'y a que des atteignable + alternatif
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length == 0)&&(concepts.c_atteignable.length > 0)&&(concepts.c_alternatif.length > 0)) evaluations.unshift(CK_text.suggestions().s9); 
    // Si il n'y a que des alternatif + hamecon
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length > 0)&&(concepts.c_atteignable.length == 0)&&(concepts.c_alternatif.length > 0)) evaluations.unshift(CK_text.suggestions().s10);
    
    return suggestions;
  },
  get_equilibre_suggest : function(elements){
      var equilibre = this.get_equilibre_eval(elements);
      // !!!! inclure par default un pourcentage de l'équilibre en suggestion !!!!!!!!!!!!!!!
      var evaluations = [];
      if(equilibre > 1){ // plus de C que de K
        //vérifier avec les liens !!! Car il peut y avoir un équilibre mais pas de lien
          evaluations.unshift(CK_text.suggestions().s2)
      }else if(equilibre < 1){ // plus de K que de C
          evaluations.unshift(CK_text.suggestions().s3)
      }else if(equilibre == 1){ // equilibre parfait

      }
      return evaluations;
  },
  //////////////////////////////////////////
  // RISQUE
  get_risque_suggest : function(elements){
      var risque = this.get_risque_eval(elements);
      var evaluations = [];
      return evaluations;
  },
}

module.exports = Object.create(CK_evaluation);