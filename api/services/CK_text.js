var exemples = {}


var options = {
	///////////////////////////////////////////////////////
    // STATUT
    ///////////////////////////////////////////////////////
    // Concept
    "empty" : {
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
		"name" : {"fr" : "Indésidable", "en" : ""},
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
}

//var CK_text = {
module.exports = {
	suggestions : function(){
		return {
		    ///////////////////////////////////////////////////////
		    // NORMALISATION
		    ///////////////////////////////////////////////////////
			"s00" : { 
				"suggestion" : {"fr" : "Ce concept n'a pas encore de statut", "en" : ""},
				"options" : [options.empty, options.c_connu, options.c_atteignable, options.c_alternatif, options.c_hamecon],
				"exemples" : []
			},
			"s01" : { 
				"suggestion" : {"fr" : "Cette connaissance n'a pas encore de statut", "en" : ""},
				"options" : [options.empty, options.k_validees, options.k_indesidable, options.k_manquante, options.k_encours],
				"exemples" : []
			},
			
			"s02" : { 
				"suggestion" : {"fr" : "Voulez-vous changer le statut de ce concept ?", "en" : ""},
				"options" : [options.empty, options.c_connu, options.c_atteignable, options.c_alternatif, options.c_hamecon],
				"exemples" : []
			},
			"s03" : { 
				"suggestion" : {"fr" : "Voulez-vous changer le statut de cette connaissance ?", "en" : ""},
				"options" : [options.empty, options.k_validees, options.k_indesidable, options.k_manquante, options.k_encours],
				"exemples" : []
			},
			
			"s04" : { 
				"suggestion" : {"fr" : "Cette connaissance est-elle interne ou externe à votre entreprise ?", "en" : ""},
			 	"options" : [options.inside, options.outside],
			 	"exemples" : []
			},
			"s05" : { 
				"suggestion" : {"fr" : "Basculer cette connaissance en interne à votre entreprise ?", "en" : ""},
			 	"options" : [options.outside],
			 	"exemples" : []
			},
			"s06" : { 
				"suggestion" : {"fr" : "Basculer cette connaissance en externe à votre entreprise ?", "en" : ""},
			 	"options" : [options.inside],
			 	"exemples" : []
			},

			///////////////////////////////////////////////////////
			// EVALUATIONS
			///////////////////////////////////////////////////////
			"s0" : { "fr" : "Suggérer plus d'expansion", "en" : ""},
			"s1" : { "fr" : "Vous restez trop dans une logique de dominante design", "en" : ""},
			"s2" : { "fr" : "Il y a un bon partage entre les concepts de rupture et incrémentale", "en" : ""},
			"s3" : { "fr" : "Ca va nous aider à structurer les roadMap court, moyen et long terme", "en" : ""},
			"s4" : { "fr" : "Il faut d'avantage travailler en K", "en" : ""},
			"s5" : { "fr" : "On est dans une volonté de rupture: il faut reprendre le travail en divergence et renforcer le travail en expansion", "en" : ""},
			"s6" : { "fr" : "Reprendre le travail d'expansion et de divergence", "en" : ""},
			"s7" : { "fr" : "", "en" : ""},
			"s8" : { "fr" : "Reprendre le travail d’expansion et de divergence mais avec un travail sur les K encore plus fort notamment avec le lien sur les K indécidables", "en" : ""},
			"s9" : { "fr" : "on renforce l’originalité de manière forte", "en" : ""},
			"s10" : { "fr" : "on renforce l’originalité de manière très forte", "en" : ""},
			
			"s11" : { "fr" : "plus j’ai des partition expansive plus je vais vers de la rupture", "en" : ""},
			"s12" : { "fr" : "plus j’ai des partition restrictive plus je vais vers de l’incrémentale ", "en" : ""},
			"s13" : { "fr" : "toutes vos connaissances sont manquantes il faut aller les chercher à l’extérieur, avez vous la capacité à absorber de nouvelle connaissance?", "en" : ""},
			"s14" : { "fr" : "il faut qu’elle embauche", "en" : ""},
			"s15" : { "fr" : "qu’elle achète la connaissance en externe", "en" : ""},
			"s16" : { "fr" : "quelle fasse appel à un expert", "en" : ""},
			"s17" : { "fr" : "voir évaluation KSOR", "en" : ""},
			"s18" : { "fr" : "il n’y a pas de programme de recherche ou d’innovation en cour", "en" : ""},
			"s19" : { "fr" : "il faut lancer des programmes de recherche et d’innovation", "en" : ""},
			"s20" : { "fr" : "identifier les connaissances à acquérir et à valider en fonction des concepts (faire le lien avec le web)", "en" : ""},
			"s21" : { "fr" : "j’ai toute les K pour répondre à de nouveaux C", "en" : ""},
			"s22" : { "fr" : "vous aide dans une situation de moyen et grd delta C et de petit delta K", "en" : ""},
			"s23" : { "fr" : "vous pouvez aller assez vite pour mettre en place l’innovation", "en" : ""},
			"s24" : { "fr" : "(voir ex chaine de produit fluidisé ALCAN)", "en" : ""},
			"s25" : { "fr" : "diminue fortement le risque", "en" : ""},
			"s26" : { "fr" : "générer de nouveau concept pour produire du K", "en" : ""},
			"s27" : { "fr" : "il faut remonter sur les C hamecon developper des C hamecon", "en" : ""},
			"s28" : { "fr" : "proposer des crazy concepts", "en" : ""},
			"s29" : { "fr" : "augmente le niveau de risque ", "en" : ""},
			"s30" : { "fr" : "faire une cotation KSOR", "en" : ""},
			"s31" : { "fr" : "grd delta C petit delta K peu de risque", "en" : ""},
			"s32" : { "fr" : "roadmap cour et moyen terme", "en" : ""},
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
			"s48" : { "fr" : "c hamecon + c indessidable = le plus en rupture scientifiquement ", "en" : ""},
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
			
			"s77" : { "fr" : "Acucune partitions restrictives trouvées, vous n'avez pas encore spécifiez de dominante design et de concepts atteignable", "en" : ""},
			"s78" : { "fr" : "Acucune partitions expansives trouvées, vous n'avez pas encore proposé de concepts alternatifs ou de concepts hameçons", "en" : ""},
		}
	}
}