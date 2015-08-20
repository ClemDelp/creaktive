module.exports = {
    /////////////////////////////////
    // For Variety
    
    /////////////////////////////////
    // For Originality
    plus_dexpansion : { 
    	title : {fr:"Manque d'expansions",en:""},
		desc : {"fr" : "Suggérer plus d'expansion", "en" : ""},
		value : 0
	},
	trop_de_c_connu : { 
		title : {fr:"Trop de C connu",en:""},
		desc : {"fr" : "Il y a trop de concepts connu, vous restez trop dans une logique de dominante design, il faut diverger d'avantage et s'éloigner du connu", "en" : ""},
		value : 0
	},
	bon_partage : { 
		title : {fr:"Bon partage",en:""},
		suggestion : {"fr" : "Il y a un bon partage entre les concepts de rupture et incrémentale", "en" : ""},
		value : 0
	},
	//////////////////////
    // Satut Concept
    statut_empty : {
		"value" : "",
		title : {"fr" : "Vide", "en" : "Empty"},
		"desc" : {"fr" : "L'élément n'a pas de statut","en" : ""},
	},
	c_connu : {
		"value" : "c_connu",
		title : {"fr" : "Connu", "en" : ""},
		"desc" : {"fr" : "Le concept renvoie à un ensemble de solutions techniques connues, dont la performance est également connue","en" : ""},
	},
    c_atteignable : {
		"value" : "c_atteignable",
		title : {"fr" : "Atteignable", "en" : ""},
		"desc" : {"fr" : "Le concept est à approfondir ou atteignable","en" : ""},
	},
	c_alternatif : {
		"value" : "c_alternatif",
		title : {"fr" : "Alternatif", "en" : ""},
		"desc" : {"fr" : "Le concept est éloigné du dominant design et peut faire l'objet d'une démarche de conception dédiée","en" : ""},
	},
	c_hamecon : {
		"value" : "c_hamecon",
		title : {"fr" : "Hameçon", "en" : ""},
		"desc" : {"fr" : "Le concept est lié à une rupture de règles et devient un point d'accroche pour de nouvelles connaissances en émergence/expansion pure","en" : ""},
	},
	no_c_connu : { 
		title : {fr:"Aucun C Connu",en:""},
		desc : {"fr" : "Aucun concept connu n'a été trouvé : il faut d’avantage travailler en K pour stimuler votre créativité", "en" : ""},
		value : 0
	},
	no_c_atteignable : { 
		title : {fr:"Aucun C Atteignable",en:""},
		desc : {"fr" : "Aucun concept atteignable n'a été trouvé : on est dans une volonté de rupture, il faut reprendre le travail en divergence et renforcer le travail en expansion", "en" : ""},
		value : 0
	},
	no_c_alternatif : { 
		title : {fr:"Aucun C Alternatif",en:""},
		desc : {"fr" : "Aucun concept alternatif n'a été trouvé : reprendre le travail d’expansion et de divergence", "en" : ""},
		value : 0
	},
	no_c_hamecon : { 
		title : {fr:"Aucun C Hameçon",en:""},
		desc : {"fr" : "Aucun concept hameçon n'a été trouvé : reprendre le travail d’expansion et de divergence mais avec un travail sur les K encore plus fort notamment avec le lien sur les K indécidables", "en" : ""},
		value : 0
	},
	no_concept : { 
		title : {"fr" : "Aucun concept", "en" : ""},
		desc : {"fr" : "Aucun concept n'a été trouvé, catégoriser vos concepts. Un travail en divergence est nécessaire", "en" : ""},
		value : 0
	},
	////////////////////////////////////////
	// For Strength	

	////////////////////////////////////////
	// For Valeur
	search_new_competence : { 
		title : {fr:"Compétences extérieurs",en:""},
		desc : {fr : "Il faut aller chercher des compétences extérieurs", en : ""},
		value : 0
	},
	k_c_generator : { 
		title : {fr:"Générer du C à partir de vos K",en:""},
		desc : {fr : "Reprendre l'ensemble de vos connaissances pour stimuler votre créativité et générer de nouveaux concepts", en : ""},
		value : 0
	},
	k_c_link_missing : { 
		title : {fr:"Lien de K vers C",en:""},
		desc : {fr : "Certaines de vos connaissances ne pointes sur aucun concept, elles n'ont donc pas été utilisée pour la génération de nouveaux concepts", en : ""},
		value : 0
	},
	innov_interest : {
		title : {fr:"Projet innovant",en:""},
		desc : {fr : "Votre valeur confirme l'intérêt du projet innovant et votre capacité à porter cette innovation vis-à-vis de la maitrise de vos connaissances qui diminue le risque", en : ""},
		value : 0
	},
	conjonction_possible : {
		title : {fr:"Conjonction ?",en:""},
		desc : {fr : "Etes vous en mesure de faire une conjonction? Une preuve de concept ?", en : ""},
		value : 0
	},
	////////////////////
	// Statut Knowledge
	k_validees : {
		"value" : "k_validees",
		title : {"fr" : "Validées", "en" : ""},
		"desc" : {"fr" : "La connaissance acquise est validée en interne","en" : ""},
	},	
	k_encours : {
		"value" : "k_encours",
		title : {"fr" : "En cours", "en" : ""},
		"desc" : {"fr" : "La connaissance est en cours d'acquisition","en" : ""},
	},	
	k_manquante : {
		"value" : "k_manquante",
		title : {"fr" : "Manquante", "en" : ""},
		"desc" : {"fr" : "La connaissance est absente ou non actionnable en interne","en" : ""},
	},	
	k_indesidable : {
		"value" : "k_indesidable",
		title : {"fr" : "Indécidable", "en" : ""},
		"desc" : {"fr" : "La connaissance est manquante de surcroit non accessible","en" : ""},
	},
	no_k_validees : {
		title : {"fr" : "Aucune K validée", "en" : ""},
		desc : {"fr" : "Aucune connaissance validée n'a été trouvé :", "en" : ""},
		value : 0
	},
	no_k_encours : {
		title : {"fr" : "Aucune K en cours", "en" : ""},
		desc : {"fr" : "Aucune connaissance en cours n'a été trouvé :", "en" : ""},
		value : 0
	},
	no_k_manquante : {
		title : {"fr" : "Aucune K manquante", "en" : ""},
		desc : {"fr" : "Aucune connaissance manquante n'a été trouvé :", "en" : ""},
		value : 0
	},
	no_k_indesidable : {
		title : {"fr" : "Aucune K indéssidable", "en" : ""},
		desc : {"fr" : "Aucune connaissance indéssidable n'a été trouvé :", "en" : ""},
		value : 0
	},
	no_knowledge : { 
		title : {"fr" : "Aucune connaissance", "en" : ""},
		desc : {"fr" : "Aucune connaissance n'a été trouvé, catégoriser vos connaissances. ", "en" : ""},
		options : [],
		exemples : [],
	},
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	// Localisation
	inside : {
		"value" : "inside",
		title : {"fr" : "Interne", "en" : "Inside"},
		"desc" : {"fr" : "La connaissance est interne à l'entreprise","en" : ""},
	},
	outside : {
		"value" : "outside",
		title : {"fr" : "Externe", "en" : "Outside"},
		"desc" : {"fr" : "La connaissance est externe à l'entreprise","en" : ""},
	},
	localisation_empty : {
		"value" : "",
		title : {"fr" : "", "en" : ""},
		"desc" : {
			"fr" : "",
			"en" : ""
		},
	},
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	// embauche : { 
	// 	title : {"fr":"","en":""},
	// 	desc : {"fr" : "Embaucher un expert", "en" : ""},
	// 	value : 0,
	// },
	// achete_k : { 
	// 	title : {"fr":"","en":""},
	// 	desc : {"fr" : "Achèter de la connaissance en externe", "en" : ""},
	// 	value : 0,
	// },
	// expert_call : { 
	// 	title : {"fr":"","en":""},
	// 	desc : {"fr" : "Faire appel à un expert", "en" : ""},
	// 	value : 0,
	// },
	// k_identification : { 
	// 	title : {"fr":"","en":"If no"},
	// 	desc : {"fr" : "Identifier les connaissances à acquérir et à valider en fonction des concepts", "en" : ""},
	// 	value : 0,
	// },
	// c_generation : {
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Générer de nouveaux concepts pour produire plus de connaissances",en:""},
	// 	value : 0
	// },
	// dev_c_hamecon : {
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Il faut remonter sur les concepts hameçons, développer des concepts hameçons",en:""},
	// 	value : 0
	// },
	// crazy_concept : {
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Proposer des crazy concepts",en:""},
	// 	value : 0
	// },
	// //////////////////////
	// // KSOR
	// ksor_eval : { 
	// 	title : {"fr":"Si non","en":"If no"},
	// 	desc : {"fr" : "Voir évaluation KSOR", "en" : ""},
	// 	value : 0,
	// },
	// ksor_cotation : { 
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Faire une cotation KSOR", en : ""},
	// 	value : 0
	// },
	// /////////////////////
	// w_divergence : { 
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Reprendre le travail de divergence pour forcer l’expansion", en : ""},
	// 	value : 0
	// },
	// search_new_k : { 
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Rechercher de nouvelles connaissances et travailler avec de nouveaux experts", en : ""},
	// 	value : 0
	// },
	// /////////////////////
	// partenariat : {
	// 	title : {fr:"",en:""},
	// 	desc : {fr : "Il faut monter des partenariats", en : ""},
	// 	value : 0	
	// },

	// //////////////////////////////
	// bcp_de_part_exp : {
	// 	type : "element",
	// 	title : {fr:"car",en:""},
	// 	desc : {fr : "il y a de nombreuse partitions expansives", en : ""},
	// 	value : []
	// },




	/////////////////////////////////
	/////////////////////////////////
	// Steps
	// step_1 : {
	// 	title : {fr: "Phase 1", en: "Step 1"},
	// 	desc : {fr: "CADRAGE de la problématique et du projet", en: ""},
	// 	value : 0
	// },

	// step_2 : {
	// 	title : {fr: "Phase 2", en: "Step 2"},
	// 	desc : {fr: "On estime que le C0 et K0 sont validés", en: ""},
	// 	value : 0
	// },

	// step_3 : {
	// 	title : {fr: "Phase 3", en: "Step 3"},
	// 	desc : {fr: "On a déterminé un ou plusieurs DD et des concepts projecteurs", en: ""},
	// 	value : 0
	// },

}