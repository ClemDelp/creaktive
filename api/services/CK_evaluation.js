var CK_evaluation = {
//module.exports = {
  //////////////////////////////////////////
  get_evaluation_suggest : function(elements,links,cb){
    var evaluation = this.get_originality_suggest(elements);
    cb(evaluation);
  },
  get_evaluation_eval : function(elements,links,cb){
    
    var evaluation = {
      "originality" : CK_evaluation.get_originality_eval_mines(elements),
      "variety" : CK_evaluation.get_variete_eval(elements),
      "strength" : CK_evaluation.get_robustesse_eval(elements),
      "value" : CK_evaluation.get_valeur_eval(elements,links) 
    }

    if(cb) cb(evaluation);
    else return evaluation;
  },
  //////////////////////////////////////////
  // EVALUATION EVAL

  // partitions expansive/partitions restrictives = (alternative + hamecon)/(dominante design + C atteignable)
  get_originality_eval_mines : function(elements){
      var concepts = this.getConceptByStatus(elements);
      var originality = CK_text.suggestions().s_originality;
      var option = originality.options[0];

      var partitions_expansives = concepts.c_alternatif.length + concepts.c_hamecon.length;
      var partitions_restrictives = concepts.c_connu.length + concepts.c_atteignable.length;

      if((partitions_restrictives == 0)&&(partitions_restrictives == 0)) option.value = 0; 
      else if((partitions_restrictives > 0)&&(partitions_restrictives == 0)) option.value = 0;
      else option.value = Math.round((partitions_expansives/partitions_restrictives)*100)/100;

      return originality;
  },
  // valeur = (new K / all K)*(new C generee par les new K / all C)
  get_valeur_eval : function(elements,links){
      var valeur = CK_text.suggestions().s_value;
      var option = valeur.options[0];

      var knowledges = this.getKnowledgeByStatus(elements);
      var concepts = this.getConceptByStatus(elements);

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
      var concepts = this.getConceptByStatus(elements);
      
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
  //////////////////////////////////////////
  // STATUT
  getKnowledgeByStatus : function(elements){
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
  getConceptByStatus : function(elements){
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
  // SUGGESTION
  get_originality_mines_suggest : function(elements){
    var evaluations = [];  
    var concepts = this.getConceptByStatus(elements);
    // Origianlity des Mines
    var originality_mines = this.get_originality_eval_mines(elements);
    if(originality_mines > 1){
      evaluations.unshift(CK_text.suggestions().s11.fr);
    }else if(originality_mines < 1){
      evaluations.unshift(CK_text.suggestions().s12.fr);
    }else{
      // ???
    }
    ///////
    var partitions_expansives = concepts.c_alternatif.length + concepts.c_hamecon.length;
    var partitions_restrictives = concepts.c_connu.length + concepts.c_atteignable.length;
    if(partitions_expansives == 0) evaluations.unshift(CK_text.suggestions().s78.fr);
    if(partitions_restrictives == 0) evaluations.unshift(CK_text.suggestions().s77.fr);

    return evaluations;
  },

  get_originality_suggest : function(elements){
    var evaluations = [];
    evaluations = _.union(evaluations, this.get_originality_patrick_suggest(elements));
    evaluations = _.union(evaluations, this.get_originality_mines_suggest(elements));
    
    return evaluations;
  },
  // VALEUR 
  get_valeur_suggest : function(elements,links){
      var valeur = this.get_valeur_eval(elements,links);
      var evaluations = [];
      if(valeur < 10){ // ???
          // ???
      }else{
          // ???
      }
  },
  // ROBUSTESS
  get_robustesse_suggest : function(elements){
      var robustess = this.get_robustesse_eval(elements).options[0].value;
      var evaluations = [];
      if(robustess > 1){ // robust
          evaluations.unshift(CK_text.suggestions().s7.fr,CK_text.suggestions().s8.fr)
      }else{ // not robust enought
          evaluations.unshift(CK_text.suggestions().s5.fr,CK_text.suggestions().s4.fr)
      }
      return evaluations;
  },
  // VARIETE
  get_variete_suggest : function(elements){
      var variete = this.get_variete_eval(elements)
      var evaluations = [];
      // ???
      return evaluations;
  },
  //////////////////////////////////////////
  // Originality patrick
  get_originality_eval_patrick : function(elements){
      var concepts = this.getConceptByStatus(elements);
      // si il y a 4 couleurs en C
      var originality = concepts.c_connu.length + concepts.c_atteignable.length + concepts.c_alternatif.length + concepts.c_hamecon.length
      
      return originality;
  },
  get_originality_patrick_suggest : function(elements){
    var evaluations = [];
    var concepts = this.getConceptByStatus(elements);
    // Originality Patrick
    var originality_patrick = this.get_originality_eval_patrick(elements);
    if(originality_patrick < 4){
      if(concepts.c_connu.length>0) evaluations.unshift(CK_text.suggestions().s0.fr,CK_text.suggestions().s1.fr);
      // faire des evaluations avec du contenu web ???
    }else if(originality_patrick == 4){
      evaluations.unshift(CK_text.suggestions().s2.fr,CK_text.suggestions().s3.fr);
    }
    // Si il n'y a aucun C connu
    if(concepts.c_connu.length == 0) evaluations.unshift(CK_text.suggestions().s4.fr); 
    // Si il n'y a aucun C atteignable
    if(concepts.c_atteignable.length == 0) evaluations.unshift(CK_text.suggestions().s5.fr); 
    // Si il n'y a aucun C alternatif
    if(concepts.c_alternatif.length == 0) evaluations.unshift(CK_text.suggestions().s6.fr); 
    // Si il n'y a aucun C hamecon
    if(concepts.c_hamecon.length == 0) evaluations.unshift(CK_text.suggestions().s8.fr); 
    // Si il n'y a que des atteignable + alternatif
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length == 0)&&(concepts.c_atteignable.length > 0)&&(concepts.c_alternatif.length > 0)) evaluations.unshift(CK_text.suggestions().s9.fr); 
    // Si il n'y a que des alternatif + hamecon
    if((concepts.c_connu.length == 0)&&(concepts.c_hamecon.length > 0)&&(concepts.c_atteignable.length == 0)&&(concepts.c_alternatif.length > 0)) evaluations.unshift(CK_text.suggestions().s10.fr); 

    return evaluations;
  },
  //////////////////////////////////////////
  // EQUILIBRE
  get_equilibre_eval : function(elements){
      var equilibre = elements.where({type : "concept"}).length / elements.where({type : "knowledge"}).length;
      return equilibre;
  },
  get_equilibre_suggest : function(elements){
      var equilibre = this.get_equilibre_eval(elements);
      // !!!! inclure par default un pourcentage de l'équilibre en suggestion !!!!!!!!!!!!!!!
      var evaluations = [];
      if(equilibre > 1){ // plus de C que de K
        //vérifier avec les liens !!! Car il peut y avoir un équilibre mais pas de lien
          evaluations.unshift(CK_text.suggestions().s2.fr)
      }else if(equilibre < 1){ // plus de K que de C
          evaluations.unshift(CK_text.suggestions().s3.fr)
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