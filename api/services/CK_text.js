var exemples = {
	chaines_alcan : {
		exemple : {fr : "voir ex chaine de produit fluidisé ALCAN", en: ""}
	}
	
}


var options = {
	///////////////////////////////////////////////////////
    // STATUT
    ///////////////////////////////////////////////////////
    // Concept
    "statut_empty" : {
		"value" : "",
		"name" : {"fr" : "Vide", "en" : "Empty"},
		"desc" : {"fr" : "L'élément n'a pas de statut","en" : ""},
	},
	"c_connu" : {
		"value" : "c_connu",
		"name" : {"fr" : "Connu", "en" : ""},
		"desc" : {"fr" : "Le concept renvoie à un ensemble de solutions techniques connues, dont la performance est également connue","en" : ""},
	},
    "c_atteignable" : {
		"value" : "c_atteignable",
		"name" : {"fr" : "Atteignable", "en" : ""},
		"desc" : {"fr" : "Le concept est à approfondir ou atteignable","en" : ""},
	},
	"c_alternatif" : {
		"value" : "c_alternatif",
		"name" : {"fr" : "Alternatif", "en" : ""},
		"desc" : {"fr" : "Le concept est éloigné du dominant design et peut faire l'objet d'une démarche de conception dédiée","en" : ""},
	},
	"c_hamecon" : {
		"value" : "c_hamecon",
		"name" : {"fr" : "Hameçon", "en" : ""},
		"desc" : {"fr" : "Le concept est lié à une rupture de règles et devient un point d'accroche pour de nouvelles connaissances en émergence/expansion pure","en" : ""},
	},
	// Knowledge
	"k_validees" : {
		"value" : "k_validees",
		"name" : {"fr" : "Validées", "en" : ""},
		"desc" : {"fr" : "La connaissance acquise est validée en interne","en" : ""},
	},	
	"k_encours" : {
		"value" : "k_encours",
		"name" : {"fr" : "En cours", "en" : ""},
		"desc" : {"fr" : "La connaissance est en cours d'acquisition","en" : ""},
	},	
	"k_manquante" : {
		"value" : "k_manquante",
		"name" : {"fr" : "Manquante", "en" : ""},
		"desc" : {"fr" : "La connaissance est absente ou non actionnable en interne","en" : ""},
	},	
	"k_indesidable" : {
		"value" : "k_indesidable",
		"name" : {"fr" : "Indécidable", "en" : ""},
		"desc" : {"fr" : "La connaissance est manquante de surcroit non accessible","en" : ""},
	},
	"inside" : {
		"value" : "inside",
		"name" : {"fr" : "Interne", "en" : "Inside"},
		"desc" : {"fr" : "La connaissance est interne à l'entreprise","en" : ""},
	},
	"outside" : {
		"value" : "outside",
		"name" : {"fr" : "Externe", "en" : "Outside"},
		"desc" : {"fr" : "La connaissance est externe à l'entreprise","en" : ""},
	},
	///////////////
	"originality" : {
		"value" : 0,
		"name" : {"fr" : "Originalité", "en" : "Originality"},
		"desc" : {
			"fr" : "Capacité de l'espace C à s'éloigner du dominant design",
			"en" : ""
		},
	},
	"variety" : {
		"value" : 0,
		"name" : {"fr" : "Variété", "en" : "Variety"},
		"desc" : {
			"fr" : "Capacité d'options que l'espace C peut offrir",
			"en" : ""
		},
	},
	"value" : {
		"value" : 0,
		"name" : {"fr" : "Valeur", "en" : "Value"},
		"desc" : {
			"fr" : "Capacité d'évolution de la connaissance et de son impact sur la génération de nouveau concept",
			"en" : ""
		},
	},
	"strength" : {
		"value" : 0,
		"name" : {"fr" : "Robustesse", "en" : "Strength"},
		"desc" : {
			"fr" : "Capacité de maîtrise des connaissance en interne",
			"en" : ""
		},
	},
	"localisation_empty" : {
		"value" : 0,
		"name" : {"fr" : "Vide", "en" : "Empty"},
		"desc" : {
			"fr" : "L'élément n'a pas de localisation",
			"en" : ""
		},
	},
	embauche : { 
		name : {"fr":"Si non","en":"If no"},
		desc : {"fr" : "Embaucher un expert", "en" : ""},
		value : 0,
	},
	achete_k : { 
		name : {"fr":"Si non","en":"If no"},
		desc : {"fr" : "Achèter de la connaissance en externe", "en" : ""},
		value : 0,
	},
	expert_call : { 
		name : {"fr":"Si non","en":"If no"},
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
		desc : {fr : "générer de nouveaux concepts pour produire plus de connaissances",en:""},
		value : 0
	},
	dev_c_hamecon : {
		name : {fr:"",en:""},
		desc : {fr : "Il faut remonter sur les concepts hameçons, développer des concepts hameçons",en:""},
		value : 0
	},
	crazy_concept : {
		name : {fr:"",en:""},
		desc : {fr : "proposer des crazy concepts",en:""},
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
		desc : {fr : "faire une cotation KSOR", en : ""},
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
		desc : {fr : "Rechercher de nouvelles connaissances et travailler avec de nouveau expert ", en : ""},
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
		desc : {fr : "Etes vous en mesure de faire une conjonction ou une preuve de concept?", en : ""},
		value : 0	
	},
	partenariat : {
		name : {fr:"",en:""},
		desc : {fr : "Il faut monter des partenariats", en : ""},
		value : 0	
	}
}

var CK_text = {
	suggestions : function(){
		return {
		    ///////////////////////////////////////////////////////
		    // NORMALISATION
		    ///////////////////////////////////////////////////////
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
			////////////////
			// Localisation
			"s04" : { 
				suggestion : {"fr" : "Cette connaissance est-elle interne ou externe à votre entreprise ?", "en" : ""},
			 	options : [options.inside, options.outside, options.localisation_empty],
			 	exemples : []
			},
			"s05" : { 
				suggestion : {"fr" : "Basculer cette connaissance en externe à votre entreprise ?", "en" : ""},
			 	options : [options.inside, options.outside, options.localisation_empty],
			 	exemples : []
			},
			"s06" : { 
				suggestion : {"fr" : "Basculer cette connaissance en interne à votre entreprise ?", "en" : ""},
			 	options : [options.inside, options.outside, options.localisation_empty],
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
				suggestion : {"fr" : "Reprendre le travail d’expansion et de divergence mais avec un travail sur les K encore plus fort notamment avec le lien sur les K indécidables (cause la plus probable: il n'y a aucun concept hameçon)", "en" : ""},
				options : [],
				exemples : [],
			},

			"s9" : { 
				suggestion : {"fr" : "on renforce l’originalité de manière forte", "en" : ""},
				options : [],
				exemples : [],
			},
			"s10" : { 
				suggestion : {"fr" : "on renforce l’originalité de manière très forte", "en" : ""},
				options : [],
				exemples : [],
			},
			
			"s11" : { 
				suggestion : {"fr" : "plus j’ai des partition expansive plus je vais vers de la rupture", "en" : ""},
				options : [],
				exemples : [],
			},
			"s12" : { 
				suggestion : {"fr" : "plus j’ai des partition restrictive plus je vais vers de l’incrémentale ", "en" : ""},
				options : [],
				exemples : [],
			},
			no_k_validee : { 
				suggestion : {"fr" : "Toutes vos connaissances sont manquantes il faut aller les chercher à l’extérieur. Avez-vous la capacité à absorber de nouvelles connaissances ?", "en" : ""},
				options : [options.embauche,options.achete_k,options.expert_call,options.ksor_eval],
				exemples : [],
			},
			no_k_encours : { 
				suggestion : {"fr" : "Il n’y a pas de programme de recherche ou d’innovation en cour", "en" : ""},
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
				suggestion : {"fr" : "vous êtes dans une situation de moyen et grd delta C et de petit delta K", "en" : ""},
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
				suggestion : {"fr" : "vous pouvez aller assez vite pour mettre en place l’innovation", "en" : ""},
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
				suggestion : {"fr" : "Aucune connaissances indécidables", "en" : ""},
				options : [options.c_generation,options.dev_c_hamecon,options.crazy_concept],
				exemples : [],
			},
			


			no_inside : { 
				suggestion : {"fr" : "Aucune connaissances internes à votre entreprise trouvées", "en" : ""},
				options : [],
				exemples : [],
			},
			no_outside : { 
				suggestion : {"fr" : "Aucune connaissances externe à votre entreprise trouvées", "en" : ""},
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
				suggestion : {"fr" : "La valeur de votre espace de connaissances est forte ce qui augmente l'intérêt du projet innovant et renvoi très certainement vers une expansion de concept et/ou une conjonction", "en" : ""},
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