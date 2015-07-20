var underscore = require("underscore");

var CK_analyse = {
  //////////////////////////////////////////
  checkAttributElementDefine : function(prefix,attribut,element){
    var check = false;
    // si l'element a le tag en attribut
    if(_.has(element, prefix+attribut)){
      // si la valeur du tag/attribut n'est pas vide
      if(underscore.propertyOf(element)(prefix+attribut) == attribut) check = true;
    }
    return check
  },
  keywordsDefine : function(words,elements,element){
    var keywords = [];
    words.forEach(function(word){
      var prefix = word.prefix;
      // Si le mot clef doit etre associé à un element
      if(element) prefix = prefix+element.id+"_";
      elements.forEach(function(element){
        if(CK_analyse.checkAttributElementDefine(prefix,word.tag,element)){
          // on ajoute lelement comme deja taggé
          if(element.type != "poche") word.tagged.push(element);
          else word.poche = element;
        }
      });
      keywords.push(word)
    });
    return keywords;
  },
  //////////////////////////////////////////
  analyse_dd_keywords : function(elements,cb){
    // Cadrage
    var dd_per_keyword = [];
    elements.forEach(function(element){
      // si on trouve des mots clef on associe un DD par mot clef
      if((CK_analyse.checkAttributElementDefine("tag_","keyword",element))&&(element.type != "poche")){
        var new_dd = {element : element, dd : CK_analyse.keywordsDefine(_.values(CK_text.define_dd()),elements,element)}
        dd_per_keyword.push(new_dd);
      }
    });
    if(cb) cb(dd_per_keyword);
    else return dd_per_keyword;
  },
  //////////////////////////////////////////
  analyse_cadrage_keywords : function(elements,cb){
    var keywords = CK_analyse.keywordsDefine(_.values(CK_text.cadrage()),elements);
    if(cb) cb(keywords);
    else return keywords;
  },
  ////////////////////////////////////////// 
  get_localisations : function(elements,cb){
    var localisations = {
      auto : [], // l'algo deduit la localisation
      manu : [] // se sera à l'utilisateur de définir la localisation de sa connaissance
    };
    elements.forEach(function(el){
      // controle if element is a knowledge
      if(el.type == "knowledge"){
        // Si une K est indéssidable sa localisaiton est ni interne ni externe
        if((el.css_manu == "k_indesidable")&&(el.inside != "")) localisations.auto.push({knowledge : el, inside : ""});
        // Si une K est manque elle est forcement externe
        else if((el.css_manu == "k_manquante")&&(el.inside != "outside")) localisations.auto.push({knowledge : el, inside : "outside"});
        // Si une K est en cours elle est interne ou externe
        else if((el.css_manu == "k_encours")||(el.css_manu == "k_validees")){
          var suggestion = {};
          if(!el.inside) suggestion = CK_text.localisations().interne_ou_externe;
          else if(el.inside == "inside") suggestion = CK_text.localisations().externe;
          else if(el.inside == "outside") suggestion = CK_text.localisations().interne;
          else suggestion = CK_text.localisations().interne_ou_externe;
          suggestion.knowledge = el;
          localisations.manu.push(suggestion);
        }
      }
    });

    if(cb) cb(localisations);
    else return localisations;
  },
  ////////////////////////////////////////// 
  get_statuts : function(elements,cb){
    var normalisations = [];
    // Color / statut
    elements.forEach(function(element){
      if((element.type == "concept")||(element.type == "knowledge")){
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
        normalisations.push(suggestion);
      } 
    });
    if(cb) cb(normalisations);
    else return normalisations;
  },
  //////////////////////////////////////////
  //////////////////////////////////////////
  get_exploration_suggestions : function(elements,cb){
    var analyses = [];
    var tree = _.where(elements,{type:"concept"});
    var exploration = api.findExplorationWay(tree);
    for(var i=0;i<exploration.evaluations.length;i++){
      var eval = exploration.evaluations[i];
      var analyse = {};
      if(eval<=1) analyse = CK_text.explorations().risk_small;
      else if((eval>1)&&(eval<=2)) analyse = CK_text.explorations().risk_medium;
      else if((eval>2)&&(eval<=3)) analyse = CK_text.explorations().risk_important;
      else analyse = CK_text.explorations().risk_undefined;
      // on rajoute les branches
      analyse.branche = exploration.branches[i];
      // on rajoute la valeur
      analyse.value = exploration.evaluations[i];
      // on l'ajoute à la liste des analyses
      analyses.push(analyse);
    }
    if(cb) cb(analyses);
    else return analyses;
  },
  //////////////////////////////////////////
  get_v2or_values : function(elements,links,cb){
    var evaluation = {
      "originality" : CK_analyse.get_originality_eval(elements),
      "variety" : CK_analyse.get_variete_eval(elements),
      "strength" : CK_analyse.get_robustesse_eval(elements),
      "value" : CK_analyse.get_valeur_eval(elements,links) 
    }
    if(cb) cb(evaluation);
    else return evaluation;
  },
  //////////////////////////////////////////
  get_v2or_analyse : function(elements,links,cb){
    ////////////////////////////////////
    // Init
    var suggestions = [];
    var knowledges = api.get_knowledge_by_statut(elements);
    var concepts = api.get_concept_by_statut(elements);
    var originality = CK_analyse.get_originality_eval(elements);
    var variety = CK_analyse.get_variete_eval(elements);
    var strength = CK_analyse.get_robustesse_eval(elements);
    var value = CK_analyse.get_valeur_eval(elements,links);
    var partitions_expansives = api.get_partitions_expansives(concepts);
    var partitions_restrictives = api.get_partitions_restrictives(concepts);
    // ORIGINALITY
    suggestions.push(CK_analyse.get_originality_suggestions(originality.options[0].value,concepts.c_connu.length));
    // LOCALISATION
    suggestions.push(CK_analyse.get_localisation_suggestions(_.where(elements,{type:"knowledge"})));
    // PARTITIONS
    suggestions.push(CK_analyse.get_partitions_expansives_suggestions(partitions_expansives));
    suggestions.push(CK_analyse.get_partitions_restrictives_suggestions(partitions_restrictives));
    // MISS CONCEPT COLOR
    suggestions.push(CK_analyse.get_miss_color_suggestions(concepts));
    // MISS ELEMENT TYPE
    suggestions.push(CK_analyse.get_miss_element_type_suggestions(elements));
    // SPECIFIC C CONFIGURATION
    suggestions.push(CK_analyse.get_specific_confirguration_suggestions(concepts,knowledges));
    // VARIETE
    suggestions.push(CK_analyse.get_variety_suggestions(variety.options[0].value));
    // VALUE
    suggestions.push(CK_analyse.get_value_suggestions(value.options[0].value));
    // STRENGTH
    suggestions.push(CK_analyse.get_strength_suggestions(strength.options[0].value));
    
    ////////////////////////////////////
    suggestions = _.union(_.compact(_.flatten(suggestions)));
    if(cb) cb(suggestions);
    else return suggestions;
  },
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  ////////////////////////////
  // SUGGESTION DETAIL
  ////////////////////////////
  get_strength_suggestions : function(strength){
    var suggestions = [];
    if(strength < 2) suggestions.push(CK_text.suggestions().strength_low);
    if(strength > 2) suggestions.push(CK_text.suggestions().strength_strength);
    //if(strength == 2) suggestions.push(CK_text.suggestions().);
    return suggestions;
  },
  get_variety_suggestions : function(variety){
    var suggestions = [];
    // Variete faible
    if(variety < 2) suggestions.push(CK_text.suggestions().variety_low);
    // variete forte
    if(variety == 4) suggestions.push(CK_text.suggestions().variety_strength);

    return suggestions;
  },
  get_value_suggestions : function(value){
    var suggestions = [];
    // Variete faible
    if(value < 2) suggestions.push(CK_text.suggestions().value_low);
    // variete forte
    if(value == 4) suggestions.push(CK_text.suggestions().value_strength);

    return suggestions;
  },
  get_specific_confirguration_suggestions : function(concepts,knowledges){
    var suggestions = [];
    // aucun c connu
    if(concepts.c_connu.length == 0) suggestions.push(CK_text.suggestions().work_in_k)
    // aucun c atteignable
    if(concepts.c_atteignable.length == 0) suggestions.push(CK_text.suggestions().s5)
    // aucun c alternatif
    if(concepts.c_alternatif.length == 0) suggestions.push(CK_text.suggestions().s6)
    // aucun c hamecon
    if(concepts.c_hamecon.length == 0) suggestions.push(CK_text.suggestions().s8)
    // que des c atteignable + c alternatif
    if((concepts.c_connu.length == 0)&&(concepts.c_atteignable.length > 0)&&(concepts.c_alternatif.length > 0)&&(concepts.c_hamecon.length == 0)) suggestions.push(CK_text.suggestions().s9)
    // que des c alternatif + hamecon
    if((concepts.c_connu.length == 0)&&(concepts.c_atteignable.length == 0)&&(concepts.c_alternatif.length > 0)&&(concepts.c_hamecon.length > 0)) suggestions.push(CK_text.suggestions().s10)
    // que des k indecidable + c hamecon
    if((concepts.c_connu.length == 0)&&(concepts.c_atteignable.length == 0)&&(concepts.c_alternatif.length == 0)&&(concepts.c_hamecon.length > 0)){
      if((knowledges.k_encours.length == 0)&&(knowledges.k_manquante.length == 0)&&(knowledges.k_indesidable.length > 0)&&(knowledges.k_validees.length == 0)){
        suggestions.push(CK_text.suggestions().s48)
      }
    }
    // Aucune K validee
    if(knowledges.k_validees.length == 0) suggestions.push(CK_text.suggestions().no_k_validee)
    // Aucune K en cours
    if(knowledges.k_encours.length == 0) suggestions.push(CK_text.suggestions().no_k_encours);
    // Aucune K manquante
    if(knowledges.k_manquante.length == 0) suggestions.push(CK_text.suggestions().no_k_manquante, CK_text.suggestions().gdc_pdk, CK_text.suggestions().fast_innov, CK_text.suggestions().risk_less);
    // Aucune K indecidable
    if(knowledges.k_indesidable.length == 0) suggestions.push(CK_text.suggestions().no_k_indecidable);
    // que des K manquante + indecidable
    if((knowledges.k_encours.length == 0)&&(knowledges.k_manquante.length > 0)&&(knowledges.k_indesidable.length > 0)&&(knowledges.k_validees.length == 0)){
      suggestions.push(CK_text.suggestions().risk_up, CK_text.suggestions().only_k_manq_indec);
    }
    // que des en cours + valiées
    if((knowledges.k_encours.length > 0)&&(knowledges.k_manquante.length == 0)&&(knowledges.k_indesidable.length == 0)&&(knowledges.k_validees.length > 0)){
      suggestions.push(CK_text.suggestions().gdc_pdk,CK_text.suggestions().risk_less,CK_text.suggestions().roadmap_cmt);
    }
    return suggestions;
  },
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
    if(concepts.c_connu.length == 0) suggestions.push(CK_text.suggestions().work_in_k); 
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
  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////
  
  // partitions expansive/partitions restrictives = (alternative + hamecon)/(dominante design + C atteignable)
  get_originality_eval : function(elements){
      var concepts = api.get_concept_by_statut(elements);
      var originality = CK_text.suggestions().s_originality;
      var option = originality.options[0];
      // Eval Patrick
      var originality_P = api.get_c_colors_number(concepts);
      originality_P = api.cross_product(4,4,originality_P);
      // Eval Mines
      var originality_M = 0;
      var partitions_expansives = api.get_partitions_expansives(concepts);
      var partitions_restrictives = api.get_partitions_restrictives(concepts);
      if((partitions_restrictives == undefined)&&(partitions_restrictives == 0)) originality_M = 0; 
      else if((partitions_restrictives == 0)&&(partitions_restrictives == 0)) originality_M = 0; 
      else if((partitions_restrictives > 0)&&(partitions_restrictives == 0)) originality_M = 0;
      else originality_M = api.cross_product(4,(partitions_expansives+partitions_restrictives),(partitions_expansives/partitions_restrictives));
      // Moyenne des originalities
      option.value = Math.round(((originality_M+originality_P)/2)*100)/100;

      return originality;
  },
  // valeur = (new K / all K)*(new C generee par les new K / all C)
  get_valeur_eval : function(elements,links){
      var valeur = CK_text.suggestions().s_value;
      var option = valeur.options[0];

      var knowledges = api.get_knowledge_by_statut(elements);
      var concepts = api.get_concept_by_statut(elements);

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
      else option.value = api.cross_product(4,1,((new_k.length * concepts_generated.length) / (all_k * all_c)));

      return valeur;
  },
  // robustess = k interne / (k externe + k qui n'ont pas de statut)
  get_robustesse_eval : function(elements){
      var strength = CK_text.suggestions().s_strength;
      var option = strength.options[0];

      var k_inside = _.where(elements,{type: "knowledge", inside : "inside"});
      var k_outside = _.union(_.where(elements,{type: "knowledge", inside : "outside"}),_.where(elements,{type: "knowledge", inside : ""}));
      if((k_inside.length == 0)&&(k_outside.length == 0)) option.value = 0;
      else if(k_outside.length == 0) option.value = 0;
      else option.value = api.cross_product(4,(k_inside.length + k_outside.length),(k_inside.length / k_outside.length));
  
      return strength;
  },
  // Variété = nombre de branches & sous-branches par rapport au dominant design
  get_variete_eval : function(elements){
      var concepts = api.get_concept_by_statut(elements);
      
      var variete = CK_text.suggestions().s_variety;
      var option = variete.options[0];

      var no_dd = (concepts.c_hamecon.length + concepts.c_alternatif.length + concepts.c_atteignable.length);
      var dd = concepts.c_connu.length;
      // calculs
      if(concepts.length == 0) option.value = 0;
      else if(dd == 0) option.value = 0;
      else if(no_dd == 0) option.value = 0;
      else option.value = api.cross_product(4,(no_dd+dd),no_dd/dd);
      
      return variete;
  },
  get_equilibre_eval : function(elements){
      var equilibre = _.where(elements,{type : "concept"}).length / _.where(elements,{type : "knowledge"}).length;
      return equilibre;
  },
  //////////////////////////////////////////
  // RISQUE
  get_risque_suggest : function(elements){
      var risque = this.get_risque_eval(elements);
      var evaluations = [];
      return evaluations;
  },
}

module.exports = Object.create(CK_analyse);


