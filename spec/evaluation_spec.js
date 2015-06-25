
describe('CK Evaluation Tests',function(){
	beforeEach(function(){});
    afterEach(function(){});
    ////////////////////////////////////////////////////////////
    // VALEUR TESTS
    ////////////////////////////////////////////////////////////
    it("valeur - 0C with K",function(){
		var data = new element_generator({"type":"knowledge"});
		expect(CK_evaluation.get_valeur_eval(data.element).options[0].value).toEqual(0);
	});

	it("valeur - 0K with C",function(){
		var data = new element_generator({"type":"concept"});
		expect(CK_evaluation.get_valeur_eval(data.element).options[0].value).toEqual(0);
	});

	it("valeur - 6C (3 connu, 1 atteign, 1 vierge, 1 hamecon) & 6K (3 inside validee + 2 outside vierge + 1 outside indesidésidable) and k inside connu -> c_connu + 3 new k -> new C",function(){
		var data = new basic_structure_to_valeur_test();
		expect(CK_evaluation.get_valeur_eval(data.elements,data.links).options[0].value).toEqual(0.25);
	});

	it("Value eval - with basic_structure_to_valeur_test",function(){
		var data = new basic_structure_to_valeur_test();
		var evaluation = CK_evaluation.get_evaluation_eval(data.elements,data.links);
		expect(evaluation.value).toEqual(CK_text.suggestions().s_value);
		expect(evaluation.value.options[0].value).toEqual(0.25);	
	});
    ////////////////////////////////////////////////////////////
    // VARIETE TESTS
    ////////////////////////////////////////////////////////////
    it("variete with 0C",function(){
		var data = [];
		expect(CK_evaluation.get_variete_eval(data).options[0].value).toEqual(0);
	});

	it("variete with 1C connu et 1C vierge",function(){
		var connu = new element_generator({"type":"concept","css_manu":"c_connu"});
		var vierge = new element_generator({"type":"concept"});
		var data = _.union(connu.element,vierge.element);
		expect(CK_evaluation.get_variete_eval(data).options[0].value).toEqual(0);
	});

	it("variete with just 2C hamecon",function(){
		var h1 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var h2 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var data = _.union(h1.element,h2.element);
		expect(CK_evaluation.get_variete_eval(data).options[0].value).toEqual(0);
	});

	it("variete with 2C connu et 2C hamecon",function(){
		var c1 = new element_generator({"type":"concept","css_manu":"c_connu"});
		var c2 = new element_generator({"type":"concept","css_manu":"c_connu"});
		var h1 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var h2 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var data = _.union(c1.element, c2.element, h1.element,h2.element);
		expect(CK_evaluation.get_variete_eval(data).options[0].value).toEqual(1);
	});

	it("variete with 2C connu et 4C hamecon",function(){
		var c1 = new element_generator({"type":"concept","css_manu":"c_connu"});
		var c2 = new element_generator({"type":"concept","css_manu":"c_connu"});
		var h1 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var h2 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var h3 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var h4 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var data = _.union(c1.element,c2.element,h1.element,h2.element,h3.element,h4.element);
		expect(CK_evaluation.get_variete_eval(data).options[0].value).toEqual(2);
	});

	it("Variety eval - with basic_structure_to_valeur_test",function(){
		var data = new basic_structure_to_valeur_test();
		var evaluation = CK_evaluation.get_evaluation_eval(data.elements,data.links);
		expect(evaluation.variety).toEqual(CK_text.suggestions().s_variety);
		expect(evaluation.variety.options[0].value).toEqual(0.67);
	});
    ////////////////////////////////////////////////////////////
    // ROBUSTESSE TESTS
    ////////////////////////////////////////////////////////////
    it("robustess value with 0 c color",function(){
		var c_0 = [];
		expect(CK_evaluation.get_robustesse_eval(c_0.elements).options[0].value).toEqual(0);
	});

	it("robustess value with 2 c color",function(){
		var c_2 = new c_2_connu_atteignable;
		expect(CK_evaluation.get_robustesse_eval(c_2.elements).options[0].value).toEqual(0);
	});

	it("robustess value with 2 k vierge",function(){
		var k_2 = new k2_vierge
		expect(CK_evaluation.get_robustesse_eval(k_2.elements).options[0].value).toEqual(0);
	});

	it("robustess value with 1 k intern & 1 k extern",function(){
		var data = new k1_inside_k1_outside;
		expect(CK_evaluation.get_robustesse_eval(data.elements).options[0].value).toEqual(1);
	});

	it("robustess value with 1 k intern & 1 k vierge",function(){
		var data = new k1_inside_k1_vierge;
		expect(CK_evaluation.get_robustesse_eval(data.elements).options[0].value).toEqual(0);
	});

	it("robustess value with 1 k vierge & 1 k extern",function(){
		var data = new k1_outside_k1_vierge;
		expect(CK_evaluation.get_robustesse_eval(data.elements).options[0].value).toEqual(0);
	});
	
	it("robustess value with 2 inside & 1 outside",function(){
		var data = new k2_inside_k1_outside;
		expect(CK_evaluation.get_robustesse_eval(data.elements).options[0].value).toEqual(2);
	});

	it("robustess value with 2 outside & 1 inside",function(){
		var data = new k2_outside_k1_inside;
		expect(CK_evaluation.get_robustesse_eval(data.elements).options[0].value).toEqual(0.5);
	});

	it("Strength eval - with basic_structure_to_valeur_test",function(){
		var data = new basic_structure_to_valeur_test();
		var evaluation = CK_evaluation.get_evaluation_eval(data.elements,data.links);
		expect(evaluation.strength).toEqual(CK_text.suggestions().s_strength);
		expect(evaluation.strength.options[0].value).toEqual(2);
	});
    ////////////////////////////////////////////////////////////
    // ORIGINALITY TESTS
    ////////////////////////////////////////////////////////////
	it("originality eval - with 0 c color",function(){
		var c_0 = [];
		expect(CK_evaluation.get_originality_eval(c_0).options[0].value).toEqual(0);
	});
	
	it("originality eval - with 1 c color",function(){
		var c_1 = new c_1_hamecon;
		expect(CK_evaluation.get_originality_eval(c_1.elements).options[0].value).toEqual(0.5);
	});

	it("originality eval - with 2 c color",function(){
		var c_2 = new c_2_connu_atteignable;
		expect(CK_evaluation.get_originality_eval(c_2.elements).options[0].value).toEqual(1);
	});

	it("originality eval - with 3 c color",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		expect(CK_evaluation.get_originality_eval(c_3.elements).options[0].value).toEqual(1.75);
	});

	it("originality eval - with 4 c color",function(){
		var c_4 = new c_4_color;
		expect(CK_evaluation.get_originality_eval(c_4.elements).options[0].value).toEqual(2.5);
	});
	it("originality eval - with basic_structure_to_valeur_test",function(){
		var data = new basic_structure_to_valeur_test();
		var evaluation = CK_evaluation.get_evaluation_eval(data.elements,data.links);
		expect(evaluation.originality).toEqual(CK_text.suggestions().s_originality);
		expect(evaluation.originality.options[0].value).toEqual(2.63);
	});
	////////////////////////////////////////////////////////////
    // Evaluation Suggestion
    ////////////////////////////////////////////////////////////
	it("Si j'ai une originalité < 4 with c_connu > 0",function(){
		var originality = 3;
		var c_connu = 1;
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s12);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s1);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s0);
	});

	it("Si j'ai une originalité < 4 with c_connu == 0",function(){
		var originality = 3;
		var c_connu = 0
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s11);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s12);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).not.toContain(CK_text.suggestions().s1);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).not.toContain(CK_text.suggestions().s0);
	});

	it("Si j'ai une originalité > 1 with c_connu > 0",function(){
		var originality = 2;
		var c_connu = 1;
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s11);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s11);
	});

	it("Si j'ai une originalité = 4 avec un arbre de concepts de tous les types with c_connu == 0",function(){
		var originality = 4;
		var c_connu = 0;
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s2);
		expect(CK_evaluation.get_originality_suggestions(originality,c_connu)).toContain(CK_text.suggestions().s3);
	});
    ////////////////////////////////////////////////////////////
    // ELement suggestions
    ////////////////////////////////////////////////////////////
	it("Si il n'y a aucun concept",function(){
		var data = new element_generator({"type":"knowledge"});
		expect(CK_evaluation.get_miss_element_type_suggestions(data.element)).toContain(CK_text.suggestions().no_concept);
	});
	it("Si il n'y a aucune connaissance",function(){
		var data = new element_generator({"type":"concept"});
		expect(CK_evaluation.get_miss_element_type_suggestions(data.element)).toContain(CK_text.suggestions().no_knowledge);
	});
	it("Si il n'y a aucune connaissances internes",function(){
		var k1 = new element_generator({"type":"knowledge","inside":"outside"});
		var k2 = new element_generator({"type":"knowledge","inside":"outside"});
		var data = _.union(k1.element,k2.element);
		expect(CK_evaluation.get_localisation_suggestions(data)).toContain(CK_text.suggestions().no_inside);
	});
	it("Si il n'y a aucune connaissances externes",function(){
		var k1 = new element_generator({"type":"knowledge","inside":"inside"});
		var k2 = new element_generator({"type":"knowledge","inside":"inside"});
		var data = _.union(k1.element,k2.element);
		expect(CK_evaluation.get_localisation_suggestions(data)).toContain(CK_text.suggestions().no_outside);
	});
	it("Si il n'y as pas de partitions restrictives",function(){
		var partitions_restrictives = 0;
		expect(CK_evaluation.get_partitions_restrictives_suggestions(partitions_restrictives)).toContain(CK_text.suggestions().no_restrictive);
	});
	it("Si il n'y as pas de partitions expansives",function(){
		var partitions_expansives = 0;
		expect(CK_evaluation.get_partitions_expansives_suggestions(partitions_expansives)).toContain(CK_text.suggestions().no_expansive);
	});
	////////////////////////////////////////////////////////////
	it("Si il n'y a aucun C connu",function(){
		var c1 = new element_generator({"type":"concept"});
		var data = _.union(c1.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().work_in_k);
	});
	it("Si il n'y a aucun C atteignable",function(){
		var c1 = new element_generator({"type":"concept"});
		var data = _.union(c1.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s5);
	});
	it("Si il n'y a aucun C alternatif",function(){
		var c1 = new element_generator({"type":"concept"});
		var data = _.union(c1.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s6);
	});
	it("Si il n'y a aucun C hamecon",function(){
		var c1 = new element_generator({"type":"concept"});
		var data = _.union(c1.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s6);
	});

	it("Si j'ai que des C atteignable + alternatif",function(){
		var c1 = new element_generator({"type":"concept","css_manu":"c_alternatif"});
		var c2 = new element_generator({"type":"concept","css_manu":"c_atteignable"});
		var data = _.union(c1.element,c2.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s9);
	});
	it("Si j'ai que des C alternatif + hamecon",function(){
		var c1 = new element_generator({"type":"concept","css_manu":"c_alternatif"});
		var c2 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var data = _.union(c1.element,c2.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s10);
	});

	it("Si il n'y a que des C hamecon + K indécidable",function(){
		var c1 = new element_generator({"type":"concept","css_manu":"c_hamecon"});
		var k1 = new element_generator({"type":"knowledge","css_manu":"k_indesidable"});
		var data = _.union(c1.element,k1.element);
		var concepts = CK_evaluation.get_concept_by_statut(data);
		var knowledges = CK_evaluation.get_knowledge_by_statut(data);
		expect(CK_evaluation.get_specific_confirguration_suggestions(concepts,knowledges)).toContain(CK_text.suggestions().s48);

	});





	it("Si il n'y a aucune K validée",function(){expect(1).toEqual(2);});
	it("Si il n'y a aucune K en cours",function(){expect(1).toEqual(2);});
	it("Si il n'y a aucune K manquante",function(){expect(1).toEqual(2);});
	it("Si il n'y a aucune K indésirable",function(){expect(1).toEqual(2);});
	it("Si il n'y a que des K manquante et indécidable",function(){expect(1).toEqual(2);});
	it("Si il n'y a que des K en cours + validée",function(){expect(1).toEqual(2);});
	
	it("Si j'ai une variété faible avec un arbre composé de ...",function(){expect(1).toEqual(2);});
	it("Si j'ai une variété forte avec un arbre composé de ...",function(){expect(1).toEqual(2);});

	it("Si j'ai robustesse < 1 avec un arbre composé de ...",function(){expect(1).toEqual(2);});
	it("Si j'ai robustesse > 1 avec un arbre composé de ...",function(){expect(1).toEqual(2);});
	it("Si j'ai robustesse = 1 avec un arbre composé de ...",function(){expect(1).toEqual(2);});

	it("Si j'ai équilibre > 1",function(){expect(1).toEqual(2);});
	it("Si j'ai équilibre < 1",function(){expect(1).toEqual(2);});

	it("Si j'ai des C qui ne pointent pas vers de la connaissance",function(){expect(1).toEqual(2);});

	it("Si j'ai des K qui ne pointent pas vers un ou plusieurs concept",function(){expect(1).toEqual(2);});

	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en C",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs K avec une forte valeur d’expansion en C et en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en C",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs K avec une faible valeur d’expansion en C et en K",function(){expect(1).toEqual(2);});
	
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en C",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs C avec une forte valeur d’expansion en C et en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en C",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en K",function(){expect(1).toEqual(2);});
	it("Si j'ai un ou plusieurs C avec une faible valeur d’expansion en C et en K",function(){expect(1).toEqual(2);});
	
	it("Si la profondeur moyenne de l'arbre est basse et qu’on a beaucoup de feuille",function(){expect(1).toEqual(2);});
	it("Si la profondeur moyenne de l'arbre est haute et qu’on a beaucoup de feuille",function(){expect(1).toEqual(2);});
	
	it("Si la profondeur max > 5",function(){expect(1).toEqual(2);});

	it("Si on a des K qui ne sont pas reliées à une catégorie",function(){expect(1).toEqual(2);});
	it("Si on a des poches de connaissances vides",function(){expect(1).toEqual(2);});

	it("Si on a une largeur d'arbre (nbre de feuilles) importante",function(){expect(1).toEqual(2);});
	it("Si on a une largeur d'arbre (nbre de feuilles) faibles",function(){expect(1).toEqual(2);});
	
	it("Si le degré d'ouverture C vers de nouvelles connaissances est importante",function(){expect(1).toEqual(2);});
	it("Si le degré d'ouverture C vers de nouvelles connaissances est faible",function(){expect(1).toEqual(2);});

})