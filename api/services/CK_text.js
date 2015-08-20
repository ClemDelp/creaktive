
var CK_text = {
	frugale : function(){
		return {
			frugale : { 
			 	title : {fr:"frugale",en:""},
			 	level : 0,
			 	ref : [],
			 	desc : {fr:"",en:""},
			},
		};
	},
	explorations : function(){
		return {
			risk_important : { 
				style : "alert",
			 	branche : [],
			 	value : 0, // entre 2 et 3
			 	title : {fr:"Rupture",en:""},
			 	desc : {fr:"Le risque est important, on est dans des logiques d'innovation de rupture",en:""},
			},
			risk_small : { 
				style : "success",
			 	branche : [],
			 	value : 0, // entre 2 et 3
			 	title : {fr:"Incrementale",en:""},
			 	desc : {fr:"Le risque est faible, on est dans des logiques d'innovation incrémentale",en:""},
			},
			risk_medium : { 
				style : "",
			 	branche : [],
			 	value : 0, // entre 2 et 3
			 	title : {fr:"Alternatif",en:""},
			 	desc : {fr:"Le risque est moyen, on est dans des logiques d'innovation alternative",en:""},
			},
			risk_undefined : { 
				style : "secondary",
			 	branche : [],
			 	value : 0, // entre 2 et 3
			 	title : {fr:"Undefined",en:""},
			 	desc : {fr:"Impossible d'établir un diagnostic",en:""},
			},
		};
	},
	localisations : function(){
		return {
			////////////////
			// Localisation
			interne_ou_externe : { 
				suggestion : {"fr" : "Cette connaissance est soit interne, soit externe à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [CK_options.inside, CK_options.outside, CK_options.localisation_empty],
			 	exemples : []
			},
			externe : { 
				suggestion : {"fr" : "Basculer cette connaissance en externe à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [CK_options.inside, CK_options.outside],
			 	exemples : []
			},
			interne : { 
				suggestion : {"fr" : "Basculer cette connaissance en interne à votre entreprise ?", "en" : ""},
			 	knowledge : {},
			 	options : [CK_options.inside, CK_options.outside],
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
				tag : 'need',
				exemples : [],	
				v2or : {strength : 2, variety : 0, value : 1, originality : 0},
				tagged : [],
				poche : undefined
			},
			needLess : {
				title : {fr:"Element perturbateur",en:""},
				prefix : "tag_",
				notFound : {fr : "Qu’est ce qui peut faire disparaître le besoin?", en: ""},
				found : {fr : "Définir un autre élément qui pourrait faire disparaître le besoin?", en: ""},
				tag : 'need_less',
				exemples : [],	
				v2or : {strength : 1, variety : 0, value : 3, originality : 0},
				tagged : [],
				poche : undefined
			},
			target : {
				title : {fr:"Les cibles",en:""},
				prefix : "tag_",
				notFound : {fr : "A qui ça s’adresse? (j’ai pas forcément la réponse au départ)", en: ""},
				found : {fr : "Une nouvelle cible ?", en: ""},
				tag : 'target',
				exemples : [],
				v2or : {strength : 0, variety : 1, value : 1, originality : 1},
				tagged : [],
				poche : undefined
			},
			impact : {
				title : {fr:"Les impacts",en:""},
				prefix : "tag_",
				notFound : {fr : "Sur quoi ça agit?", en: ""},
				found : {fr : "Un autre élément sur lequel ça agit ?", en: ""},
				tag : 'impact_on',
				exemples : [],	
				v2or : {strength : 0, variety : 1, value : 2, originality : 3},
				tagged : [],
				poche : undefined
			},
			actor : {
				title : {fr:"Les acteurs",en:""},
				prefix : "tag_",
				notFound : {fr : "Quelles sont les parties prenante?", en: ""},
				found : {fr : "Une autre partie prenante ?", en: ""},
				tag : 'actor',
				exemples : [],	
				v2or : {strength : 4, variety : 0, value : 3, originality : 0},
				tagged : [],
				poche : undefined
			},
			implantation : {
				title : {fr:"Implantation",en:""},
				prefix : "tag_",
				notFound : {fr : "Comment ça s’intègre avec l’existant?", en: ""},
				found : {fr : "Une autre intégration avec l’existant?", en: ""},
				tag : 'implantation',
				exemples : [],	
				v2or : {strength : 1, variety : 1, value : 1, originality : 1},
				tagged : [],
				poche : undefined
			},
			keyword : {
				title : {fr:"Element clef",en:"Keyword"},
				prefix : "tag_",
				notFound : {fr : "Quels sont les éléments clefs de la problématique (thème, objet, service) ?", en: ""},
				found : {fr : "Un autre élément clef ?", en: ""},
				tag : 'keyword',
				exemples : [],	
				v2or : {strength : 1, variety : 1, value : 1, originality : 1},
				tagged : [],
				poche : undefined
			},
			// C0 : {
			// 	title : {fr:"C0 - concept initial",en:""},
			// 	prefix : "tag_",
			// 	notFound : {fr : "Définir C0", en: ""},
			// 	found : {fr : "Définir un autre C0", en: ""},
			// 	tag : 'c0',
			// 	exemples : [],	
			// 	v2or : {strength : 0, variety : 4, value : 0, originality : 4},
			// 	tagged : [],
			// 	poche : undefined
			// },
			// K0 : {
			// 	title : {fr:"K0 - connaissances initiales",en:""},
			// 	prefix : "tag_",
			// 	notFound : {fr : "Définir K0", en: ""},
			// 	found : {fr : "Définir un autre K0", en: ""},
			// 	tag : 'k0',
			// 	exemples : [],	
			// 	v2or : {strength : 4, variety : 0, value : 4, originality : 0},
			// 	tagged : [],
			// 	poche : undefined
			// },
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
				title : {fr:"Analogies",en:""},
				prefix : "tag_",
				conditions : ["c0"], // to debloc this suggestion we need to have a C0
				notFound : {fr : "Faire des recherches par analogie", en: ""},
				found : {fr : "Faire d'autres analogies", en: ""},
				tag : {fr:['analogie'],en:['analogy']},
				exemples : [],	
				v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : []
			},
			// homonyme : {
			// 	suggestion : {fr : "Faire des recherches par homonyme", en: ""},
			// 	tag : {fr:['homonyme'],en:['homonym']},
			// 	options : [],
			// 	exemples : [],	
			// 	v2or : {strength : 0, variety : 2, value : 0, originality : 2},
			// },
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
	define_dd : function(){
		return {
			// dd : {
			// 	title : {fr:"Dominant design",en:""},
			// 	prefix : "tag_",
			// 	tag : {fr:['analogie'],en:['analogy']},
			// 	conditions : ["c0","k0"], // to debloc this suggestion we need to have a C0
			// 	notFound : {fr : "Formaliser un Dominant Design", en: ""},
			// 	//found : {fr : "Formaliser un Dominant Design", en: ""},
			// 	exemples : [],	
			// 	// v2or : {strength : 4, variety : 0, value : 4, originality : 0},
			// 	tagged : []
			// },
			dim_business : {
				title : {fr:"Dimension business",en:""},
				prefix : "tag_",
				conditions : ["c0"], // to debloc this suggestion we need to have a C0
				notFound : {fr : "Comment l'objet/service est valorisé économiquement ?", en: ""},
				found : {fr : "Proposer une autre valeur économique ?", en: ""},
				tag : 'dim_bsn',
				exemples : [],	
				// v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : [],
				poche : undefined
			},
			dim_usage_valeur : {
				title : {fr:"Dimension usage / valeur",en:""},
				prefix : "tag_",
				conditions : ["dim_bsn"], // to debloc this suggestion we need to have a C0
				notFound : {fr : "Ce qu'apporte l'objet/service à l'utilisateur ?", en: ""},
				found : {fr : "Proposer un autre apport ?", en: ""},
				tag : 'dim_usg_val',
				exemples : [],	
				// v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : [],
				poche : undefined
			},
			dim_fonctionnel : {
				title : {fr:"Dimension fonctionnelles",en:""},
				prefix : "tag_",
				conditions : ["dim_usg_val"], // to debloc this suggestion we need to have a C0
				notFound : {fr : "Ce que fait l'objet/service ? (techniquement)", en: ""},
				found : {fr : "Proposer une autre fonctionnalité ?", en: ""},
				tag : 'dim_fct',
				exemples : [],	
				// v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : [],
				poche : undefined
			},
			dim_technique : {
				title : {fr:"Dimension technique",en:""},
				prefix : "tag_",
				conditions : ["dim_fct"], // to debloc this suggestion we need to have a C0
				notFound : {fr : "Comment l'objet/service fonctionne ? (techniquement)", en: ""},
				found : {fr : "Proposer une autre fonction technique ?", en: ""},
				tag : 'dim_tech',
				exemples : [],	
				// v2or : {strength : 4, variety : 0, value : 4, originality : 0},
				tagged : [],
				poche : undefined
			},
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
	originality : function(){
		return {
			"undefined" : { 
				def : CK_definitions.originality,
				value : undefined,
				suggestion : {"fr" : "Impossible de définir correctement l'originalité de votre projet pour l'instant", "en" : ""},
				options : [],
			},
			faible : { 
				def : CK_definitions.originality,
				value : undefined,
				suggestion : {"fr" : "l'originalité de votre projet est faible", "en" : ""},
				options : [],
			},
			correct : { 
				def : CK_definitions.originality,
				value : undefined,
				suggestion : {"fr" : "l'originalité de votre projet est correcte", "en" : ""},
				options : [],
			},
			forte : { 
				def : CK_definitions.originality,
				value : undefined,
				suggestion : {"fr" : "l'originalité de votre projet est forte", "en" : ""},
				options : [],
			},
		}
	},
	variety : function(){
		return {
			"undefined" : { 
				def : CK_definitions.variety,
				value : undefined,
				suggestion : {"fr" : "Impossible de définir correctement la variété de votre projet pour l'instant", "en" : ""},
				options : [],
			},
			faible : { 
				def : CK_definitions.variety,
				value : undefined,
				suggestion : {"fr" : "La variété de votre projet est faible", "en" : ""},
				options : [],
			},
			correct : { 
				def : CK_definitions.variety,
				value : undefined,
				suggestion : {"fr" : "La variété de votre projet est correcte", "en" : ""},
				options : [],
			},
			forte : { 
				def : CK_definitions.variety,
				value : undefined,
				suggestion : {"fr" : "La variété de votre projet est forte", "en" : ""},
				options : [],
			},
		}
	},
	valeur : function(){
		return {
			"undefined" : { 
				def : CK_definitions.valeur,
				value : undefined,
				suggestion : {"fr" : "Impossible de définir correctement la valeur de votre projet pour l'instant", "en" : ""},
				options : [],
			},
			faible : { 
				def : CK_definitions.valeur,
				value : undefined,
				suggestion : {"fr" : "La valeur de votre projet est faible", "en" : ""},
				options : [],
			},
			correct : { 
				def : CK_definitions.valeur,
				value : undefined,
				suggestion : {"fr" : "La valeur de votre projet est correcte", "en" : ""},
				options : [],
			},
			forte : { 
				def : CK_definitions.valeur,
				value : undefined,
				suggestion : {"fr" : "La valeur de votre projet est forte", "en" : ""},
				options : [],
			},
		}
	},
	strength : function(){
		return {
			"undefined" : { 
				def : CK_definitions.strength,
				value : undefined,
				suggestion : {"fr" : "Impossible de définir correctement la robustesse de votre projet pour l'instant", "en" : ""},
				options : [],
			},
			faible : { 
				def : CK_definitions.strength,
				value : undefined,
				suggestion : {"fr" : "La robustesse de votre projet est faible", "en" : ""},
				options : [],
			},
			correct : { 
				def : CK_definitions.strength,
				value : undefined,
				suggestion : {"fr" : "La robustesse de votre projet est correcte", "en" : ""},
				options : [],
			},
			forte : { 
				def : CK_definitions.strength,
				value : undefined,
				suggestion : {"fr" : "La robustesse de votre projet est forte", "en" : ""},
				options : [],
			},
		}
	},
	risk : function(){
		return {
			"undefined" : { 
				def : CK_definitions.risk,
				value : undefined,
				suggestion : {"fr" : "Impossible de définir correctement le risque de votre projet pour l'instant", "en" : ""},
				options : [],
			},
			faible : { 
				def : CK_definitions.risk,
				value : undefined,
				suggestion : {"fr" : "Le risque de votre projet est faible", "en" : ""},
				options : [],
			},
			correct : { 
				def : CK_definitions.risk,
				value : undefined,
				suggestion : {"fr" : "Le risque de votre projet est acceptable", "en" : ""},
				options : [],
			},
			forte : { 
				def : CK_definitions.risk,
				value : undefined,
				suggestion : {"fr" : "Le risque de votre projet est fort", "en" : ""},
				options : [],
			},
		}
	},
	suggestions : function(){
		return {
		    ///////////////////////////////////////////////////////
		    // NORMALISATION
		    ///////////////////////////////////////////////////////
			
			///////////////////////////////////////////////////////
			// EVALUATIONS
			///////////////////////////////////////////////////////
			"s00" : { 
				suggestion : {"fr" : "Ce concept n'a pas encore de statut", "en" : ""},
				options : [CK_options.statut_empty, CK_options.c_connu, CK_options.c_atteignable, CK_options.c_alternatif, CK_options.c_hamecon],
				exemples : []
			},
			"s01" : { 
				suggestion : {"fr" : "Cette connaissance n'a pas encore de statut", "en" : ""},
				options : [CK_options.statut_empty, CK_options.k_validees, CK_options.k_indesidable, CK_options.k_manquante, CK_options.k_encours],
				exemples : []
			},
			
			"s02" : { 
				suggestion : {"fr" : "Voulez-vous changer le statut de ce concept ?", "en" : ""},
				options : [CK_options.statut_empty, CK_options.c_connu, CK_options.c_atteignable, CK_options.c_alternatif, CK_options.c_hamecon],
				exemples : []
			},
			"s03" : { 
				suggestion : {"fr" : "Voulez-vous changer le statut de cette connaissance ?", "en" : ""},
				options : [CK_options.statut_empty, CK_options.k_validees, CK_options.k_indesidable, CK_options.k_manquante, CK_options.k_encours],
				exemples : []
			},
			///////////////////////////////////////////////////////
			// EVALUATIONS
			///////////////////////////////////////////////////////
			
			// "s3" : { 
			// 	suggestion : {"fr" : "Ca va nous aider à structurer les roadMap court, moyen et long terme", "en" : ""},
			// 	options : [],
			// 	exemples : [],
			// },
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
				options : [CK_options.embauche,CK_options.achete_k,CK_options.expert_call,CK_options.ksor_eval],
				exemples : [],
			},
			no_k_encours : { 
				suggestion : {"fr" : "Apparament il n'y a pas de programme de recherche ou d’innovation en cour", "en" : ""},
				options : [CK_options.k_identification],
				exemples : [],
			},
			no_k_manquante : { 
				suggestion : {"fr" : "Aucunes connaissances manquantes : j’ai toute les connaissances pour répondre à de nouveaux concepts", "en" : ""},
				options : [],
				exemples : [CK_exemples.chaines_alcan],
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
			
			/////////////////////////
			/////////////////////////
			// VARIETY
			variety_low : { 
				suggestion : {"fr" : "La variété de votre espace de concepts est faible", "en" : ""},
				options : [],
				exemples : [CK_options.w_divergence, CK_options.search_new_k],
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
				exemples : [CK_options.partenariat]
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
				exemples : [CK_options.search_new_competence],
			},

			value_strength : { 
				suggestion : {"fr" : "La valeur de votre espace de connaissances est forte ce qui augmente l'intérêt du projet innovant et renvoie très certainement vers une expansion de concept et/ou une conjonction", "en" : ""},
				options : [],
				exemples : [CK_options.conjonction],
			},
			

			// "s33" : { "fr" : "voir les règles d’expansion en C", "en" : ""},
			

			// "s34" : { "fr" : "reprendre le travail de divergence pour forcer l’expansion", "en" : ""},
			// "s35" : { "fr" : "rechercher de nouvelles connaissances et travailler avec de nouveau expert ", "en" : ""},
			// "s36" : { "fr" : "bonne indication sur les possibilités de structurer des road map pour l’exploration", "en" : ""},
			// "s37" : { "fr" : "spécifier la suggestion en faisant le lien entre les delta C et delta K qui nous donnera le delta T", "en" : ""},
			// "s38" : { "fr" : "Il faut aller chercher des compétences extérieurs (suggérer le type de profil qu’il manque)", "en" : ""},
			

			// "s42" : { "fr" : "Le risque est plus important", "en" : ""},
			// "s43" : { "fr" : "Il faut monter des partenariats (suggérer des partenariats intéressant en fonction de la thématique voir si ya pas moyen de s’interfacer à l’api de linkedin ou https://www.jacoop.fr/ ou l’entreprise qui fait collaborer les grandes entreprise et les startups?)", "en" : ""},
			// "s44" : { "fr" : "comment identifier des collaboration à partir des arbres CK (valeo et le modèle opéra)", "en" : ""},
			// "s45" : { "fr" : "Votre base de connaissance est robuste", "en" : ""},
			// "s46" : { "fr" : "Le risque est plus faible", "en" : ""},
			// "s47" : { "fr" : "capacité d’absorption de nouveau K voir KSOR", "en" : ""},
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