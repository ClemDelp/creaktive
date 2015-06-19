
describe('CK Evaluation Tests',function(){
	beforeEach(function(){});
    afterEach(function(){});
    ////////////////////////////////////////////////////////////
    // ORIGINALITE TESTS
    ////////////////////////////////////////////////////////////
    it("originality_eval_patrick with 0 c color",function(){
		var c_0 = [];
		expect(CK_evaluation.get_originality_eval_patrick(c_0)).toEqual(0);
	});

	it("originality_eval_patrick with 1 c color",function(){
		var c_1 = new c_1_hamecon;
		expect(CK_evaluation.get_originality_eval_patrick(c_1.elements)).toEqual(1);
	});

	it("originality_eval_patrick with 2 c color",function(){
		var c_2 = new c_2_connu_atteignable;
		expect(CK_evaluation.get_originality_eval_patrick(c_2.elements)).toEqual(2);
	});

	it("originality_eval_patrick with 3 c color",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		expect(CK_evaluation.get_originality_eval_patrick(c_3.elements)).toEqual(3);
	});

	it("originality_eval_patrick with 4 c color",function(){
		var c_4 = new c_4_color;
		expect(CK_evaluation.get_originality_eval_patrick(c_4.elements)).toEqual(4);
	});
	////////////////////////////////////////////////////////////
	it("originality_eval_mines - with 0 c color",function(){
		var c_0 = [];
		expect(CK_evaluation.get_originality_eval_mines(c_0)).toEqual(0);
	});
	
	it("originality_eval_mines - with 1 c color",function(){
		var c_1 = new c_1_hamecon;
		expect(CK_evaluation.get_originality_eval_mines(c_1.elements)).toEqual(0);
	});

	it("originality_eval_mines - with 2 c color",function(){
		var c_2 = new c_2_connu_atteignable;
		expect(CK_evaluation.get_originality_eval_mines(c_2.elements)).toEqual(0);
	});

	it("originality_eval_mines - with 3 c color",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		expect(CK_evaluation.get_originality_eval_mines(c_3.elements)).toEqual(0.5);
	});

	it("originality_eval_mines - with 4 c color",function(){
		var c_4 = new c_4_color;
		expect(CK_evaluation.get_originality_eval_mines(c_4.elements)).toEqual(1);
	});
	////////////////////////////////////////////////////////////
	it("Si j'ai une originalité < 4 avec un arbre de concepts (connu + atteignable + alternatif)",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		// originalité < 4
		expect(CK_evaluation.get_originality_suggest(c_3.elements)).toContain(CK_text.evaluation.s0.fr);
		expect(CK_evaluation.get_originality_suggest(c_3.elements)).toContain(CK_text.evaluation.s1.fr);
	});

	it("Si j'ai une originalité < 4 avec un arbre de concepts (connu + atteignable + alternatif)",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		// originalité < 4
		expect(CK_evaluation.get_originality_suggest(c_3.elements)).toContain(CK_text.evaluation.s0.fr);
		expect(CK_evaluation.get_originality_suggest(c_3.elements)).toContain(CK_text.evaluation.s1.fr);
	});

	it("Si j'ai une originalité = 4 avec un arbre de concepts de tous les types",function(){
		var c_4 = new c_4_color;
		// originalité = 4
		expect(CK_evaluation.get_originality_suggest(c_4.elements)).toContain(CK_text.evaluation.s2.fr);
		expect(CK_evaluation.get_originality_suggest(c_4.elements)).toContain(CK_text.evaluation.s3.fr);
	});
	////////////////////////////////////////////////////////////
    // ROBUSTESSE TESTS
    ////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////
    // CONCEPTS TREE TESTS
    ////////////////////////////////////////////////////////////
	it("Si il n'y as pas de partition expansive (alternatif + hamecon)",function(){
		var c_2 = new c_2_connu_atteignable;
		// originalité < 4
		expect(CK_evaluation.get_originality_suggest(c_2.elements)).toContain(CK_text.evaluation.s78.fr);
	});
	it("Si il n'y as pas de partition restrictive (connu + atteignable)",function(){
		var c_1_alt = new c_1_alternatif;
		var c_1_ham = new c_1_hamecon;
		var c_2_ah = _.union(c_1_alt.elements,c_1_ham.elements);
		expect(CK_evaluation.get_originality_suggest(c_2_ah.elements)).toContain(CK_text.evaluation.s77.fr);
	});
	////////////////////////////////////////////////////////////
	it("Si j'ai aucun C connu avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c connu
		expect(CK_evaluation.get_originality_suggest(c_1_h.elements)).toContain(CK_text.evaluation.s4.fr);
	});
	it("Si j'ai aucun c atteignable avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c atteignable
		expect(CK_evaluation.get_originality_suggest(c_1_h.elements)).toContain(CK_text.evaluation.s5.fr);
	});
	it("Si j'ai aucun c alternatif avec un arbre de concepts avec seulement un hamecon",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c alternatif
		expect(CK_evaluation.get_originality_suggest(c_1_h.elements)).toContain(CK_text.evaluation.s6.fr);
	});
	it("Si j'ai aucun c hamecon avec un arbres de concepts (connu + atteignable)",function(){
		var c_2 = new c_2_connu_atteignable;
		// aucun c hamecon
		expect(CK_evaluation.get_originality_suggest(c_2.elements)).toContain(CK_text.evaluation.s8.fr);
	});
	it("Si j'ai que des C atteignable + alternatif",function(){
		var c_1_al = new c_1_alternatif;
		var c_1_at = new c_1_atteignable;
		var c_2_aa = _.union(c_1_al.elements,c_1_at.elements);
		// atteignable + alternatif
		expect(CK_evaluation.get_originality_suggest(c_2_aa)).toContain(CK_text.evaluation.s9.fr);
	});
	it("Si j'ai que des C alternatif + hamecon",function(){
		var c_1_al = new c_1_alternatif;
		var c_1_h = new c_1_hamecon;
		var c_2_ah = _.union(c_1_al.elements,c_1_h.elements);
		// alternatif + hamecon
		expect(CK_evaluation.get_originality_suggest(c_2_ah)).toContain(CK_text.evaluation.s10.fr);
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