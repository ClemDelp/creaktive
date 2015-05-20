var ckSuggest = {
	//////////////////////////////////////////
    init : function(){
        this.links = global.collections.Links;
        this.elements = global.collections.Elements;
    },
	//////////////////////////////////////////
    // UTILITIES
    //////////////////////////////////////////
    getKnowledgeByStatus : function(){
        var k_validees = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_validees"});
        var k_encours = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_encours"});
        var k_manquante = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_manquante"});
        var k_indesidable = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_indesidable"});
        return {"k_validees" : k_validees, "k_encours" : k_encours, "k_manquante" : k_manquante, "k_indesidable" : k_indesidable};
    },
    getConceptByStatus : function(){
        var c_connu = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_connu"});
        var c_atteignable = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_atteignable"});
        var c_alternatif = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_alternatif"});
        var c_hamecon = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_hamecon"});
        return {"c_connu" : c_connu, "c_atteignable" : c_atteignable, "c_alternatif" : c_alternatif, "c_hamecon" : c_hamecon};
    },
    //////////////////////////////////////////
    // MODULE EVALUATION
    //////////////////////////////////////////
    // Originalité = si il y a 4 couleurs en C
    get_originality_eval : function(){
        var concepts = ckSuggest.getConceptByStatus();
        // si il y a 4 couleurs en C
        var originality = concepts.c_connu.length + concepts.c_atteignable.length + concepts.c_alternatif.length + concepts.c_hamecon.length
        return originality;
    },
    // calcul de la valeur (nbre de new K*concepts generated) / K validees
    get_valeur_eval : function(){
        var knowledges = ckSuggest.getKnowledgeByStatus();
        // nouvelles connaissances = toutes sauf les validees
        var new_k = _.union(knowledges.k_encours, knowledges.k_manquante, knowledges.k_indesidable);
        // nombre de concepts générés par les nouvelles K
        var concepts_generated = [];
        new_k.forEach(function(k){
            concepts_generated = _.union(concepts_generated, api.getTypeLinkedToModel(ckSuggest.links,ckSuggest.elements,k,"concept"));
        });
        //
        var valeur = (new_k.length * concepts_generated.length) / knowledges.k_validees.length;
        return valeur;
    },
    // robustess = k interne / k externe
    get_robustesse_eval : function(){
        var knowledges = ckSuggest.getKnowledgeByStatus();
        var k_interne = knowledges.k_validees
        var k_externe = _.union(knowledges.k_indesidable, knowledges.k_manquante, knowledges.k_encours)
        //
        var robustess = k_interne.length / k_externe.length;
        return robustess;
    },
    // Variété = nombre de branches & sous-branches par rapport au dominant design
    get_variete_eval : function(){
        var concepts = ckSuggest.getConceptByStatus();
        //
        var variete = (concepts.c_hamecon.length + concepts.c_alternatif.length + concepts.c_atteignable.length) / concepts.c_connu.length;
        return variete;
    },
    get_equilibre_eval : function(){
        var equilibre = ckSuggest.elements.where({type : "concept"}).length / ckSuggest.elements.where({type : "knowledge"}).length;
        return equilibre;
    },
    get_risque_eval : function(){

    },
    //////////////////////////////////////////
    // MODULE SUGGESTION
    //////////////////////////////////////////
    get_originality_suggest : function(){
        var originality = ckSuggest.get_originality_eval();
        var suggestions = [];
        if(originality < 4){
            suggestions.unshift(suggestion.originality_0.fr,suggestion.originality_1.fr);
            // faire des suggestions avec du contenu web

        }else{

        }
        // 
        return suggestions;
    },
    get_valeur_suggest : function(){
        var valeur = ckSuggest.get_valeur_eval();
        var suggestions = [];
        if(valeur < 10){ // ???
            // ???
        }else{ // ???
            // ???
        }
    },
    get_robustesse_suggest : function(){
        var robustess = ckSuggest.get_robustesse_eval();
        var suggestions = [];
        if(robustess > 1){ // robust
            suggestions.unshift(suggestion.robustess_7.fr,suggestion.robustess_8.fr)
        }else{ // not robust enought
            suggestions.unshift(suggestion.robustess_5.fr,suggestion.robustess_4.fr)
        }
        return suggestions;
    },
    get_variete_suggest : function(){
        var variete = ckSuggest.get_variete_eval()
        var suggestions = [];
        // ???
        return suggestions;
    },
    get_equilibre_suggest : function(){
        var equilibre = ckSuggest.get_equilibre_eval();
        // !!!! inclure par default un pourcentage de l'équilibre en suggestion !!!!!!!!!!!!!!!
        var suggestions = [];
        if(equilibre > 1){ // plus de C que de K
        	//vérifier avec les liens !!! Car il peut y avoir un équilibre mais pas de lien
            suggestions.unshift(suggestion.equilibre_2.fr)
        }else if(equilibre < 1){ // plus de K que de C
            suggestions.unshift(suggestion.equilibre_3.fr)
        }else if(equilibre == 1){ // equilibre parfait

        }
        return suggestions;
    },
    get_risque_suggest : function(){
        var risque = ckSuggest.get_risque_eval();
        var suggestions = [];
        return suggestions;
    },
}

var suggestion = {
    ///////////////////////////////////////////////////////
    // TEXTUAL SUGGESTION
    ///////////////////////////////////////////////////////
	originality_0 : { 
		"fr" : "Suggérer plus d'expansion", 
		"en" : ""
	},
	originality_1 : { 
		"fr" : "Vous restez trop dans une logique de dominante design", 
		"en" : ""
	},
	equilibre_2 : { 
		"fr" : "A chaque concept doit correspondre une connaissance", 
		"en" : ""
	},
	equilibre_3 : { 
		"fr" : "A chaque connaissance doit correspondre un concept", 
		"en" : ""
	},
	robustess_4 : { 
		"fr" : "Le risque est plus important", 
		"en" : ""
	},
	robustess_5 : { 
		"fr" : "Il faut monter des partenariats", 
		"en" : ""
	},
	s6 : { 
		"fr" : "Il faut aller chercher des compétences extérieurs", 
		"en" : ""
	},
	robustess_7 : { 
		"fr" : "Votre base de connaissance est robuste", 
		"en" : ""
	},
	robustess_8 : { 
		"fr" : "Le risque est plus faible", 
		"en" : ""
	},
	s9 : { 
		"fr" : "", 
		"en" : ""
	},
}