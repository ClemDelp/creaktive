var exemples = {
	chaines_alcan : {
		exemple : {fr : "voir ex chaine de produit fluidisé ALCAN", en: ""}
	}
	
}


var options = {
    /////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	// Steps
	step_1 : {
		name : {fr: "Phase 1", en: "Step 1"},
		desc : {fr: "CADRAGE de la problématique et du projet", en: ""},
		value : 0
	},

	step_2 : {
		name : {fr: "Phase 2", en: "Step 2"},
		desc : {fr: "On estime que le C0 et K0 sont validés", en: ""},
		value : 0
	},

	step_3 : {
		name : {fr: "Phase 3", en: "Step 3"},
		desc : {fr: "On a déterminé un ou plusieurs DD et des concepts projecteurs", en: ""},
		value : 0
	},
    // Concept
    statut_empty : {
		"value" : "",
		"name" : {"fr" : "Vide", "en" : "Empty"},
		"desc" : {"fr" : "L'élément n'a pas de statut","en" : ""},
	},
	c_connu : {
		"value" : "c_connu",
		"name" : {"fr" : "Connu", "en" : ""},
		"desc" : {"fr" : "Le concept renvoie à un ensemble de solutions techniques connues, dont la performance est également connue","en" : ""},
	},
    c_atteignable : {
		"value" : "c_atteignable",
		"name" : {"fr" : "Atteignable", "en" : ""},
		"desc" : {"fr" : "Le concept est à approfondir ou atteignable","en" : ""},
	},
	c_alternatif : {
		"value" : "c_alternatif",
		"name" : {"fr" : "Alternatif", "en" : ""},
		"desc" : {"fr" : "Le concept est éloigné du dominant design et peut faire l'objet d'une démarche de conception dédiée","en" : ""},
	},
	c_hamecon : {
		"value" : "c_hamecon",
		"name" : {"fr" : "Hameçon", "en" : ""},
		"desc" : {"fr" : "Le concept est lié à une rupture de règles et devient un point d'accroche pour de nouvelles connaissances en émergence/expansion pure","en" : ""},
	},
	// Knowledge
	k_validees : {
		"value" : "k_validees",
		"name" : {"fr" : "Validées", "en" : ""},
		"desc" : {"fr" : "La connaissance acquise est validée en interne","en" : ""},
	},	
	k_encours : {
		"value" : "k_encours",
		"name" : {"fr" : "En cours", "en" : ""},
		"desc" : {"fr" : "La connaissance est en cours d'acquisition","en" : ""},
	},	
	k_manquante : {
		"value" : "k_manquante",
		"name" : {"fr" : "Manquante", "en" : ""},
		"desc" : {"fr" : "La connaissance est absente ou non actionnable en interne","en" : ""},
	},	
	k_indesidable : {
		"value" : "k_indesidable",
		"name" : {"fr" : "Indécidable", "en" : ""},
		"desc" : {"fr" : "La connaissance est manquante de surcroit non accessible","en" : ""},
	},
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	// Localisation
	inside : {
		"value" : "inside",
		"name" : {"fr" : "Interne", "en" : "Inside"},
		"desc" : {"fr" : "La connaissance est interne à l'entreprise","en" : ""},
	},
	outside : {
		"value" : "outside",
		"name" : {"fr" : "Externe", "en" : "Outside"},
		"desc" : {"fr" : "La connaissance est externe à l'entreprise","en" : ""},
	},
	localisation_empty : {
		"value" : "",
		"name" : {"fr" : "", "en" : ""},
		"desc" : {
			"fr" : "",
			"en" : ""
		},
	},
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	// 4 critere d'évaluation
	originality : {
		"value" : 0,
		"name" : {"fr" : "Originalité", "en" : "Originality"},
		"desc" : {
			"fr" : "A quel point les idées proposées sont en rupture par rapport à ce qu’il se fait aujourd’hui",
			"en" : ""
		},
	},
	variety : {
		"value" : 0,
		"name" : {"fr" : "Variété", "en" : "Variety"},
		"desc" : {
			"fr" : "Le nombre de propositions d’idées et d’alternatives",
			"en" : ""
		},
	},
	value : {
		"value" : 0,
		"name" : {"fr" : "Valeur", "en" : "Value"},
		"desc" : {
			"fr" : "L'évolution de la connaissance mobilisée et de son impact sur la génération de nouveaux concepts",
			"en" : ""
		},
	},
	strength : {
		"value" : 0,
		"name" : {"fr" : "Robustesse", "en" : "Strength"},
		"desc" : {
			"fr" : "La capacité de maîtrise des connaissances mobilisées",
			"en" : ""
		},
	},
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	embauche : { 
		name : {"fr":"","en":""},
		desc : {"fr" : "Embaucher un expert", "en" : ""},
		value : 0,
	},
	achete_k : { 
		name : {"fr":"","en":""},
		desc : {"fr" : "Achèter de la connaissance en externe", "en" : ""},
		value : 0,
	},
	expert_call : { 
		name : {"fr":"","en":""},
		desc : {"fr" : "Faire appel à un expert", "en" : ""},
		value : 0,
	},
	k_identification : { 
		name : {"fr":"","en":"If no"},
		desc : {"fr" : "Identifier les connaissances à acquérir et à valider en fonction des concepts", "en" : ""},
		value : 0,
	},
	c_generation : {
		name : {fr:"",en:""},
		desc : {fr : "Générer de nouveaux concepts pour produire plus de connaissances",en:""},
		value : 0
	},
	dev_c_hamecon : {
		name : {fr:"",en:""},
		desc : {fr : "Il faut remonter sur les concepts hameçons, développer des concepts hameçons",en:""},
		value : 0
	},
	crazy_concept : {
		name : {fr:"",en:""},
		desc : {fr : "Proposer des crazy concepts",en:""},
		value : 0
	},
	//////////////////////
	// KSOR
	ksor_eval : { 
		name : {"fr":"Si non","en":"If no"},
		desc : {"fr" : "Voir évaluation KSOR", "en" : ""},
		value : 0,
	},
	ksor_cotation : { 
		name : {fr:"",en:""},
		desc : {fr : "Faire une cotation KSOR", en : ""},
		value : 0
	},
	/////////////////////
	w_divergence : { 
		name : {fr:"",en:""},
		desc : {fr : "Reprendre le travail de divergence pour forcer l’expansion", en : ""},
		value : 0
	},
	search_new_k : { 
		name : {fr:"",en:""},
		desc : {fr : "Rechercher de nouvelles connaissances et travailler avec de nouveaux experts", en : ""},
		value : 0
	},
	/////////////////////
	search_new_competence : { 
		name : {fr:"",en:""},
		desc : {fr : "Il faut aller chercher des compétences extérieurs", en : ""},
		value : 0
	},
	conjonction : {
		name : {fr:"",en:""},
		desc : {fr : "Etes vous en mesure de faire une conjonction ou une preuve de concept ?", en : ""},
		value : 0	
	},
	partenariat : {
		name : {fr:"",en:""},
		desc : {fr : "Il faut monter des partenariats", en : ""},
		value : 0	
	},

	//////////////////////////////
	bcp_de_part_exp : {
		type : "element",
		name : {fr:"car",en:""},
		desc : {fr : "il y a de nombreuse partitions expansives", en : ""},
		value : []
	}
}

var CK_text = {
	localisations : function(){
		return {
			////////////////
			// Localisation
			interne_ou_externe : { 
				suggestion : {"fr" : "Cette connaissance est soit interne, soit externe à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [options.inside, options.outside, options.localisation_empty],
			 	exemples : []
			},
			externe : { 
				suggestion : {"fr" : "Basculer cette connaissance en externe à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [options.inside, options.outside],
			 	exemples : []
			},
			interne : { 
				suggestion : {"fr" : "Basculer cette connaissance en interne à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [options.inside, options.outside],
			 	exemples : []
			},
		};
	},
	cadrage : function(){
		return {
			// CADRAGE de la problématique et du projet
			need : {
				title : {fr:"Le besoin",en:""},
				prefix : "tag_",
				notFound : {fr : "Quel est le besoin ?", en: ""},
				found : {fr : "Ajouter un autre besoin ?", en: ""},
				tag : {fr:['le besoin'],en:['need']},
				exemples : [],	
				v2or : {strength : 2, variety : 0, value : 1, originality : 0},
				tagged : []
			},
			needLess : {
				title : {fr:"Element perturbateur",en:""},
				prefix : "tag_",
				notFound : {fr : "Qu’est ce qui peut faire disparaître le besoin?", en: ""},
				found : {fr : "Définir un autre élément qui pourrait faire disparaître le besoin?", en: ""},
				tag : {fr:[],en:['need_less']},
				exemples : [],	
				v2or : {strength : 1, variety : 0, value : 3, originality : 0},
				tagged : []
			},
			target : {
				title : {fr:"Les cible",en:""},
				prefix : "tag_",
				notFound : {fr : "A qui ça s’adresse? (j’ai pas forcément la réponse au départ)", en: ""},
				found : {fr : "Une nouvelle cible ?", en: ""},
				tag : {fr:[],en:['target']},
				exemples : [],
				v2or : {strength : 0, variety : 1, value : 1, originality : 1},
				tagged : []
			},
			impact : {
				title : {fr:"Les impacts",en:""},
				prefix : "tag_",
				notFound : {fr : "Sur quoi ça agit?", en: ""},
				found : {fr : "Un autre élément sur lequel ça agit ?", en: ""},
				tag : {fr:[],en:['impact_on']},
				exemples : [],	
				v2or : {strength : 0, variety : 1, value : 2, originality : 3},
				tagged : []
			},
			actor : {
				title : {fr:"Les acteurs",en:""},
				prefix : "tag_",
				notFound : {fr : "Quelles sont les parties prenante?", en: ""},
				found : {fr : "Une autre partie prenante ?", en: ""},
				tag : {fr:[],en:['actor']},
				exemples : [],	
				v2or : {strength : 4, variety : 0, value : 3, originality : 0},
				tagged : []
			},
			implantation : {
				title : {fr:"Implantation",en:""},
				prefix : "tag_",
				notFound : {fr : "Comment ça s’intègre avec l’existant?", en: ""},
				found : {fr : "Une autre intégration avec l’existant?", en: ""},
				tag : {fr:['implantation'],en:['implantation']},
				exemples : [],	
				v2or : {strength : 1, variety : 1, value : 1, originality : 1},
				tagged : []
			},
			C0 : {
				title : {fr:"C0 - concept initial",en:""},
				prefix : "tag_",
				notFound : {fr : "Définir C0", en: ""},
				found : {fr : "Définir un autre C0", en: ""},
				tag : {fr:['c0'],en:['c0']},
				exemples : [],	
				v2or : {strength : 0, variety : 4, value : 0, originality : 4},
				tagged : []
			},
			K0 : {
				title : {fr:"K0 - connaissances initiales",en:""},
				prefix : "tag_",
				notFound : {fr : "Définir K0", en: ""},
				found : {fr : "Définir un autre K0", en: ""},
				tag : {fr:['k0'],en:['k0']},
				exemples : [],	
				v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : []
			},
			// iteration : {
			// 	notFound : {fr : "Itérer entre C0 et K0 afin de fixer le/les C0 (l’enlever quand le C0 est fixer et quand le system d’éval définit tous les critère au moins à deux)", en: ""},
			//  Found : {fr : "Itérer entre C0 et K0 afin de fixer le/les C0 (l’enlever quand le C0 est fixer et quand le system d’éval définit tous les critère au moins à deux)", en: ""},
			// 	tag : {fr:['iteration'],en:['iteration']},
			// 	options : [],
			// 	exemples : [],	
			// 	v2or : {strength : 2, variety : 2, value : 2, originality : 2},
			// 	tagged : []
			// },
			
		}
	},
	// On estime que le C0 et K0 sont validés
	c0_k0_validated : function(){
		return {
			analogy : {
				suggestion : {fr : "Faire des recherches par analogies", en: ""},
				tag : {fr:['analogie'],en:['analogy']},
				options : [],
				exemples : [],	
				v2or : {strength : 0, variety : 4, value : 0, originality : 4},
			},
			homonyme : {
				suggestion : {fr : "Faire des recherches par homonyme", en: ""},
				tag : {fr:['homonyme'],en:['homonym']},
				options : [],
				exemples : [],	
				v2or : {strength : 0, variety : 2, value : 0, originality : 2},
			},
			thematic : {
				suggestion : {fr : "Définir les mots clefs associés à un concept, les grandes thématiques, générer ses noms communs", en: ""},
				tag : {fr:['thématique'],en:['thematic']},
				options : [],
				exemples : [],	
				v2or : {strength : 3, variety : 0, value : 3, originality : 0},
			},
			// formaliser le Dominant Design
			// Partenaires possibles? Qui peut nous aider en interne/externe? Parainer les poches K par des experts en interne/externe
			// Quelles valeurs sociales? Quelle valeurs pour un tel projet?
			// suggérer de la K à partir de K, exemple définir "l’open source » par rapport à une liste de modèles économiques
			// Pour chaque poche K identifiée aller chercher des infos automatiquement sur internet et compléter les poches K et idées de concepts
			// les faire travailler sur Google image/moteur de recherche metaphorique/...
			// Pour chaque poche C identifiée aller chercher des infos automatiquement sur internet et compléterles poches K et idées de concepts
			// les faire travailler sur Google image/moteur de recherche metaphorique/...
		}
	},
	// On a déterminer un ou plusieurs DD et des concepts projecteurs
	dd_cp_determinated : function(){
		return {
			// Imposer une recherche d’alternatives, d’identification d’hypothèses différentes : ne pas aller sur une solution = branche restrictive! -> l’outil propose systématiquement une branche « autre »
			// logique de forcing : demander à l’utilisateur de décomposer ses C en fonction de ses caractéristiques et proposer des extrèmes (un chaise avec 3 pied, 4 pieds,...., 1000 pieds, 0 pieds)
			// travailler en retro conception trouver le C macro, travailler en abstraction par rapport au DD
			// demander/proposer l’inverse d’un C (une chaise avec ou sans pieds -> A vs non A)
			// A partir de la génération d’un “autre” quel est l’impact de celui-ci sur le DD? Est ce qu’il amène à remonter sur des niveau du DD supérieur ex: BM, Ecosystem industriel, ...
			// stimuler la créativité/l’imagination de l’utilisateur avec des images, son, vidéos, citations, métaphores, … agir sur les “sens” de l’utilisateur
		}
	},
	suggestions : function(){
		return {
		    ///////////////////////////////////////////////////////
		    // NORMALISATION
		    ///////////////////////////////////////////////////////
			originalite_faible : { 
				suggestion : {"fr" : "Votre originalité est plutôt faible", "en" : ""},
				options : [options.bcp_de_part_exp],
				exemples : []
			},
			"s00" : { 
				suggestion : {"fr" : "Ce concept n'a pas encore de statut", "en" : ""},
				options : [options.statut_empty, options.c_connu, options.c_atteignable, options.c_alternatif, options.c_hamecon],
				exemples : []
			},
			"s01" : { 
				suggestion : {"fr" : "Cette connaissance n'a pas encore de statut", "en" : ""},
				options : [options.statut_empty, options.k_validees, options.k_indesidable, options.k_manquante, options.k_encours],
				exemples : []
			},
			
			"s02" : { 
				suggestion : {"fr" : "Voulez-vous changer le statut de ce concept ?", "en" : ""},
				options : [options.statut_empty, options.c_connu, options.c_atteignable, options.c_alternatif, options.c_hamecon],
				exemples : []
			},
			"s03" : { 
				suggestion : {"fr" : "Voulez-vous changer le statut de cette connaissance ?", "en" : ""},
				options : [options.statut_empty, options.k_validees, options.k_indesidable, options.k_manquante, options.k_encours],
				exemples : []
			},
			///////////////////////////////////////////////////////
			// EVALUATIONS
			///////////////////////////////////////////////////////
			"s_originality" : { 
				suggestion : {"fr" : "Evaluation de l'originalité","en" : ""},
			 	options : [options.originality],
			 	exemples : []
			},
			"s_value" : { 
				suggestion : {"fr" : "Evaluation de la valeur","en" : ""},
			 	options : [options.value],
			 	exemples : []
			},
			"s_strength" : { 
				suggestion : {"fr" : "Evaluation de la robustesse","en" : ""},
			 	options : [options.strength],
			 	exemples : []
			},
			"s_variety" : { 
				suggestion : {"fr" : "Evaluation de la variété","en" : ""},
			 	options : [options.variety],
			 	exemples : []
			},
			"s0" : { 
				suggestion : {"fr" : "Suggérer plus d'expansion", "en" : ""},
				options : [],
				exemples : [],
			},
			"s1" : { 
				suggestion : {"fr" : "Vous restez trop dans une logique de dominante design", "en" : ""},
				options : [],
				exemples : [],
			},
			"s2" : { 
				suggestion : {"fr" : "Il y a un bon partage entre les concepts de rupture et incrémentale", "en" : ""},
				options : [],
				exemples : [],
			},
			"s3" : { 
				suggestion : {"fr" : "Ca va nous aider à structurer les roadMap court, moyen et long terme", "en" : ""},
				options : [],
				exemples : [],
			},
			work_in_k : { 
				suggestion : {"fr" : "Il faut d'avantage travailler en K (cause la plus probable: il n'y a aucun concept connu)", "en" : ""},
				options : [],
				exemples : [],
			},
			"s5" : { 
				suggestion : {"fr" : "On est dans une volonté de rupture: il faut reprendre le travail en divergence et renforcer le travail en expansion (cause la plus probable: il n'y a aucun concept atteignable)", "en" : ""},
				options : [],
				exemples : [],
			},
			"s6" : { 
				suggestion : {"fr" : "Reprendre le travail d'expansion et de divergence (cause la plus probable: il n'y a aucun concept alternatif)", "en" : ""},
				options : [],
				exemples : [],
			},
			"s8" : { 
				suggestion : {"fr" : "Reprendre le travail d’expansion et de divergence mais avec un travail sur les connaissances encore plus fort notamment avec le lien sur les connaissances indécidables (cause la plus probable: il n'y a aucun concept hameçon)", "en" : ""},
				options : [],
				exemples : [],
			},

			"s9" : { 
				suggestion : {"fr" : "On renforce l’originalité de manière forte", "en" : ""},
				options : [],
				exemples : [],
			},
			"s10" : { 
				suggestion : {"fr" : "On renforce l’originalité de manière très forte", "en" : ""},
				options : [],
				exemples : [],
			},
			
			"s11" : { 
				suggestion : {"fr" : "Plus j’ai des partitions expansives plus je vais vers de la rupture", "en" : ""},
				options : [],
				exemples : [],
			},
			"s12" : { 
				suggestion : {"fr" : "Plus j’ai des partitions restrictives plus je vais vers de l’incrémentale ", "en" : ""},
				options : [],
				exemples : [],
			},
			no_k_validee : { 
				suggestion : {"fr" : "Toutes vos connaissances sont manquantes il faut aller les chercher à l’extérieur. Il faut absorber de nouvelles connaissances ?", "en" : ""},
				options : [options.embauche,options.achete_k,options.expert_call,options.ksor_eval],
				exemples : [],
			},
			no_k_encours : { 
				suggestion : {"fr" : "Apparament il n'y a pas de programme de recherche ou d’innovation en cour", "en" : ""},
				options : [options.k_identification],
				exemples : [],
			},
			


			no_k_manquante : { 
				suggestion : {"fr" : "Aucunes connaissances manquantes : j’ai toute les connaissances pour répondre à de nouveaux concepts", "en" : ""},
				options : [],
				exemples : [exemples.chaines_alcan],
			},
			// DELTA_C DELTA_K
			gdc_pdk : { 
				suggestion : {"fr" : "Vous êtes dans une situation de moyen et grand delta C et de petit delta K", "en" : ""},
				options : [],
				exemples : [],
			},


			// ROAD MAP
			roadmap_cmt : { 
				suggestion : {"fr" : "Roadmap cour et moyen terme", "en" : ""},
				options : [],
				exemples : [],
			},
			
			//

			fast_innov : { 
				suggestion : {"fr" : "Vous pouvez aller assez vite pour mettre en place l’innovation", "en" : ""},
				options : [],
				exemples : [],
			},

			risk_less : { 
				suggestion : {"fr" : "Le risque est fortement diminué (cause la plus probable : aucunes connaissances manquantes)", "en" : ""},
				options : [],
				exemples : [],
			},
			risk_up : { 
				suggestion : {"fr" : "Le niveau de risque augmente (cause la plus probable : que des connaissances manquantes et indécidables)", "en" : ""},
				options : [],
				exemples : [],
			},
			risk_strong : { 
				suggestion : {"fr" : "Le risque est plus important", "en" : ""},
				options : [],
				exemples : [],
			},

			only_k_manq_indec :{ 
				suggestion : {"fr" : "Il n'y a que des connaissances manquantes et indécidables", "en" : ""},
				options : [],
				exemples : [options.ksor_cotation],
			},

			no_k_indecidable : { 
				suggestion : {"fr" : "Aucunes connaissances indécidables", "en" : ""},
				options : [options.c_generation,options.dev_c_hamecon,options.crazy_concept],
				exemples : [],
			},
			


			no_inside : { 
				suggestion : {"fr" : "Aucunes connaissances internes à votre entreprise trouvées", "en" : ""},
				options : [],
				exemples : [],
			},
			no_outside : { 
				suggestion : {"fr" : "Aucunes connaissances externe à votre entreprise trouvées", "en" : ""},
				options : [],
				exemples : [],
			},
			no_concept : { 
				suggestion : {"fr" : "Aucuns concepts trouvés", "en" : ""},
				options : [],
				exemples : [],
			},
			no_knowledge : { 
				suggestion : {"fr" : "Aucunes connaissances trouvées", "en" : ""},
				options : [],
				exemples : [],
			},
			
			/////////////////////////
			/////////////////////////
			// VARIETY
			variety_low : { 
				suggestion : {"fr" : "La variété de votre espace de concepts est faible", "en" : ""},
				options : [],
				exemples : [options.w_divergence, options.search_new_k],
			},

			variety_strength : { 
				suggestion : {"fr" : "La variété de votre espace de concepts est forte ce qui est une bonne indication sur les possibilités de structurer des roadmaps pour l’exploration", "en" : ""},
				options : [],
				exemples : [],
			},

			/////////////////////////
			/////////////////////////
			// STRENGTH
			strength_low : {
				suggestion : {fr:"La robustesse de votre base de connaissance est faible, le risque est important",en:""},
				options : [],
				exemples : [options.partenariat]
			},
			strength_strength : {
				suggestion : {fr:"Votre base de connaissances est ronbuste, le risque est faible",en:""},
				options : [],
				exemples : []
			},			
			/////////////////////////
			/////////////////////////
			// VALUE
			value_low : { 
				suggestion : {"fr" : "La valeur de votre espace de connaissances est faible", "en" : ""},
				options : [],
				exemples : [options.search_new_competence],
			},

			value_strength : { 
				suggestion : {"fr" : "La valeur de votre espace de connaissances est forte ce qui augmente l'intérêt du projet innovant et renvoie très certainement vers une expansion de concept et/ou une conjonction", "en" : ""},
				options : [],
				exemples : [options.conjonction],
			},
			

			"s33" : { "fr" : "voir les règles d’expansion en C", "en" : ""},
			

			"s34" : { "fr" : "reprendre le travail de divergence pour forcer l’expansion", "en" : ""},
			"s35" : { "fr" : "rechercher de nouvelles connaissances et travailler avec de nouveau expert ", "en" : ""},
			"s36" : { "fr" : "bonne indication sur les possibilités de structurer des road map pour l’exploration", "en" : ""},
			"s37" : { "fr" : "spécifier la suggestion en faisant le lien entre les delta C et delta K qui nous donnera le delta T", "en" : ""},
			"s38" : { "fr" : "Il faut aller chercher des compétences extérieurs (suggérer le type de profil qu’il manque)", "en" : ""},
			"s39" : { "fr" : "augmente l’interet du projet innovant", "en" : ""},
			"s40" : { "fr" : "ca va renvoyer vers une expansion de C et/ou une conjonction", "en" : ""},
			"s41" : { "fr" : "êtes vous en mesure de faire une conjonction? Une preuve de concept?", "en" : ""},
			"s42" : { "fr" : "Le risque est plus important", "en" : ""},
			"s43" : { "fr" : "Il faut monter des partenariats (suggérer des partenariats intéressant en fonction de la thématique voir si ya pas moyen de s’interfacer à l’api de linkedin ou https://www.jacoop.fr/ ou l’entreprise qui fait collaborer les grandes entreprise et les startups?)", "en" : ""},
			"s44" : { "fr" : "comment identifier des collaboration à partir des arbres CK (valeo et le modèle opéra)", "en" : ""},
			"s45" : { "fr" : "Votre base de connaissance est robuste", "en" : ""},
			"s46" : { "fr" : "Le risque est plus faible", "en" : ""},
			"s47" : { "fr" : "capacité d’absorption de nouveau K voir KSOR", "en" : ""},
			s48 : { 
				suggestion : {"fr" : "c hamecon + c indessidable = le plus en rupture scientifiquement ", "en" : ""},
				options : [],
				exemples : [],
			},
			"s49" : { "fr" : "aller voir les bulles les première suggestion (avec ou sans description)", "en" : ""},
			"s50" : { "fr" : "j’ai un delta C plus fort et un delta K plus faible notamment pour des K existant > K nouvelle", "en" : ""},
			"s51" : { "fr" : "petit delta C avec des grd delta K", "en" : ""},
			"s52" : { "fr" : "choisir les k qui ne sont liées à aucun c et leur demander si elles peuvent engendrer des pistes de concepts?", "en" : ""},
			"s53" : { "fr" : "A chaque concept doit correspondre une connaissance", "en" : ""},
			"s54" : { "fr" : "Lister les C non liés", "en" : ""},
			"s55" : { "fr" : "A chaque connaissance doit correspondre un concept", "en" : ""},
			"s56" : { "fr" : "Lister les K non liées", "en" : ""},
			"s57" : { "fr" : "elle est critique pour des innovations", "en" : ""},
			"s58" : { "fr" : "elle est critique dans le renouvellement des K et des métiers", "en" : ""},
			"s59" : { "fr" : "si elle est manquante/indécidable  il faut mettre le paquet dessus pour l’acquérir car elle va avoir le plus de retombée", "en" : ""},
			"s60" : { "fr" : "K à réintégrer, qu’on aurait oublié qui peut nous débloquer en C", "en" : ""},
			"s61" : { "fr" : "ca peu servir pour une innovation conceptuelle rapide", "en" : ""},
			"s62" : { "fr" : "insuffisamment mobilisé (ya til une raison?)", "en" : ""},
			"s63" : { "fr" : "partition en rupture fortes", "en" : ""},
			"s64" : { "fr" : "régénération des connaissance et des métiers", "en" : ""},
			"s64" : { "fr" : "si la moyenne est base et qu’on a beaucoup de feuille:", "en" : ""},
			"s65" : { "fr" : "si j’ai beaucoup de branche mais pas trop profond = on va vers de la rupture", "en" : ""},
			"s66" : { "fr" : "si la moyenne est haute et qu’on a beaucoup de feuille: ", "en" : ""},
			"s67" : { "fr" : "on va vers de la rupture et de la conjonction", "en" : ""},
			"s68" : { "fr" : "détaillé plus forte dominante design (avez-vous une dimension écosystème, business eco, system, sous-system?)", "en" : ""},
			"s69" : { "fr" : "avez vous la profondeur qui vous permet de traiter la problématique de la façon la plus large et la plus ouverte possible.", "en" : ""},
			"s70" : { "fr" : "Leur suggérer une catégorie", "en" : ""},
			"s71" : { "fr" : "Pourquoi cette poche est vide? Voici ce que nous avons trouvé sur le web pour vous en rapport avec cette catégorie cela vous inspire t-il?", "en" : ""},
			"s72" : { "fr" : "il faut au moins 3 ou 4 feuilles pour avoir un bon travail en expansion", "en" : ""},
			"s73" : { "fr" : "= le degré d’ouverture vers de nouvelles connaissances lié à l’expansion CK", "en" : ""},
			"s74" : { "fr" : "= originalité et du degré d’ouverture (ou de rupture)", "en" : ""},
			"s75" : { "fr" : "= originalité (et est donc lié au degré d’ouverture)", "en" : ""},
			"s76" : { "fr" : " traduire un degré douverture.", "en" : ""},
			
			no_restrictive : { 
				suggestion : {"fr" : "Acucune partitions restrictives trouvées, vous n'avez pas encore spécifiez de dominante design et de concepts atteignable", "en" : ""},
				options : [],
				exemples : []
			},
			no_expansive : { 
				suggestion : {"fr" : "Acucune partitions expansives trouvées, vous n'avez pas encore proposé de concepts alternatifs ou de concepts hameçons", "en" : ""},
				options : [],
				exemples : []
			},

		}
	}
}

module.exports = Object.create(CK_text);