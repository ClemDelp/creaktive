
describe('CreaKtive API Suggestion Tests',function(){
	
	beforeEach(function() {

    });

    afterEach(function() {

    });

	it("Si j'ai 2 C et 3 K non normés CK sur 10 éléments",function(){
		var c2_k3 = new c2_k3_sur10_non_norme;
		console.log(SuggestionAlgo.get_not_normalize(c2_k3.elements))
		expect(SuggestionAlgo.get_not_normalize(c2_k3.elements).concepts.elements.length).toEqual(2);
		expect(SuggestionAlgo.get_not_normalize(c2_k3.elements).concepts.suggestions).toContain(SuggestionText.s00.fr);
		expect(SuggestionAlgo.get_not_normalize(c2_k3.elements).knowledges.elements.length).toEqual(3);	
		expect(SuggestionAlgo.get_not_normalize(c2_k3.elements).knowledges.suggestions).toContain(SuggestionText.s01.fr);
	});

	it("Si j'ai une originalité < 4 avec un arbre de concepts (connu + atteignable + alternatif)",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		// originalité < 4
		expect(SuggestionAlgo.get_originality_suggest(c_3.elements)).toContain(SuggestionText.s0.fr);
		expect(SuggestionAlgo.get_originality_suggest(c_3.elements)).toContain(SuggestionText.s1.fr);
	});

	it("Si j'ai une originalité = 4 avec un arbre de concepts de tous les types",function(){
		var c_4 = new c_4_color;
		// originalité = 4
		expect(SuggestionAlgo.get_originality_suggest(c_4.elements)).toContain(SuggestionText.s2.fr);
		expect(SuggestionAlgo.get_originality_suggest(c_4.elements)).toContain(SuggestionText.s3.fr);
	});
	it("Si j'ai aucun C connu avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c connu
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s4.fr);
	});
	it("Si j'ai aucun c atteignable avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c atteignable
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s5.fr);
	});
	it("Si j'ai aucun c alternatif avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c alternatif
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s6.fr);
	});
	it("Si j'ai aucun c hamecon avec un arbres de concepts (connu + atteignable)",function(){
		var c_2 = new c_2_connu_atteignable;
		// aucun c hamecon
		expect(SuggestionAlgo.get_originality_suggest(c_2.elements)).toContain(SuggestionText.s8.fr);
	});
	it("Si j'ai que des C atteignable + alternatif",function(){
		var c_1_al = new c_1_alternatif;
		var c_1_at = new c_1_atteignable;
		var c_2_aa = _.union(c_1_al.elements,c_1_at.elements);
		// atteignable + alternatif
		expect(SuggestionAlgo.get_originality_suggest(c_2_aa)).toContain(SuggestionText.s9.fr);
	});
	it("Si j'ai que des C alternatif + hamecon",function(){
		var c_1_al = new c_1_alternatif;
		var c_1_h = new c_1_hamecon;
		var c_2_ah = _.union(c_1_al.elements,c_1_h.elements);
		// alternatif + hamecon
		expect(SuggestionAlgo.get_originality_suggest(c_2_ah)).toContain(SuggestionText.s10.fr);
	});
	it("Si il n'y a que des C hamecon + K indécidable",function(){
		// var c_1_h = new c_1_hamecon;
		// var k_1_i = new k_1_indecidable;
		// var ck_hi = _.union(c_1_h.elements, k_1_i.elements);
		// expect().toContain();
	});

	it("Si il n'y a aucune K validée",function(){});
	it("Si il n'y a aucune K en cours",function(){});
	it("Si il n'y a aucune K manquante",function(){});
	it("Si il n'y a aucune K indésirable",function(){});
	it("Si il n'y a que des K manquante et indécidable",function(){});
	it("Si il n'y a que des K en cours + validée",function(){});
	
	it("Si j'ai une variété faible avec un arbre composé de ...",function(){});
	it("Si j'ai une variété forte avec un arbre composé de ...",function(){});

	it("Si j'ai robustesse < 1 avec un arbre composé de ...",function(){});
	it("Si j'ai robustesse > 1 avec un arbre composé de ...",function(){});
	it("Si j'ai robustesse = 1 avec un arbre composé de ...",function(){});

	it("Si j'ai équilibre > 1",function(){});
	it("Si j'ai équilibre < 1",function(){});

	it("Si j'ai des C qui ne pointent pas vers de la connaissance",function(){});

	it("Si j'ai des K qui ne pointent pas vers un ou plusieurs concept",function(){});

	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en C",function(){});
	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en K",function(){});
	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en C et en K",function(){});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en C",function(){});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en K",function(){});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en C et en K",function(){});
	
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en C",function(){});
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en K",function(){});
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en C et en K",function(){});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en C",function(){});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en K",function(){});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en C et en K",function(){});
	
	it("Si la profondeur moyenne de l'arbre est basse et qu’on a beaucoup de feuille",function(){});
	it("Si la profondeur moyenne de l'arbre est haute et qu’on a beaucoup de feuille",function(){});
	
	it("Si la profondeur max > 5",function(){});

	it("Si on a des K qui ne sont pas reliées à une catégorie",function(){});
	it("Si on a des poches de connaissances vides",function(){});

	it("Si on a une largeur d'arbre (nbre de feuilles) importante",function(){});
	it("Si on a une largeur d'arbre (nbre de feuilles) faibles",function(){});
	
	it("Si le degré d'ouverture C vers de nouvelles connaissances est importante",function(){});
	it("Si le degré d'ouverture C vers de nouvelles connaissances est faible",function(){});

})