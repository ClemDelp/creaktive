
describe('CK Objectifs Tests',function(){
	beforeEach(function(){});
    afterEach(function(){});
    ////////////////////////////////////////////////////////////
    // VALEUR TESTS
    ////////////////////////////////////////////////////////////
    it("Phase de cadrage test des mots clefs",function(){
		var elements = [
			{tag_need : true, "id":"84ff2886-e591-2506-0950-c7d03d572b9c","id_father":"none","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"c0 : demo arbo ","type":"concept","css_auto":"c_empty","css_manu":"","content":"","inside":""},
			{"id":"6aa8e2c0-0bd7-1ec4-d37a-42e2c34a3832","id_father":"84ff2886-e591-2506-0950-c7d03d572b9c","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"sd","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"","inside":""},
			{"id":"39381749-071c-bc70-9a14-e06ff415dcc4","id_father":"84ff2886-e591-2506-0950-c7d03d572b9c","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"df","type":"concept","css_auto":"c_empty","css_manu":"c_atteignable","content":"","inside":""},
			{"id":"69d9e562-793a-3207-8a5c-a94b664a5e5f","id_father":"84ff2886-e591-2506-0950-c7d03d572b9c","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"er","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"","inside":""},
			{"id":"1e8e1443-0f32-390f-a2a0-b07229b9b409","id_father":"6aa8e2c0-0bd7-1ec4-d37a-42e2c34a3832","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"df","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"","inside":""},
			{"id":"35da0495-c4d7-5fa4-269f-2ca2843c460f","id_father":"39381749-071c-bc70-9a14-e06ff415dcc4","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"aze","type":"concept","css_auto":"c_empty","css_manu":"c_alternatif","content":"","inside":""},
			{"id":"ed19be33-ed24-f1cb-a877-2fa7521bb6b6","id_father":"39381749-071c-bc70-9a14-e06ff415dcc4","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"vc","type":"concept","css_auto":"c_empty","css_manu":"c_hamecon","content":"","inside":""},
			{"id":"c922cbb7-c9f7-8a2d-e4e6-64d75d5b1ad8","id_father":"69d9e562-793a-3207-8a5c-a94b664a5e5f","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"sss","type":"concept","css_auto":"c_empty","css_manu":"c_alternatif","content":"","inside":""},
			{"id":"9b4ca466-b28d-73d0-d47f-286eadba8d0b","id_father":"c922cbb7-c9f7-8a2d-e4e6-64d75d5b1ad8","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"sd","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"","inside":""},
			{"id":"1228dba8-572e-4632-ed78-ecdf0326ff7f","id_father":"c922cbb7-c9f7-8a2d-e4e6-64d75d5b1ad8","project":"3c50fe03-07e1-2e90-640b-0b8986641a24","title":"aze","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"","inside":""}
		];
		expect(CK_objectif.get_analyse_key_words(elements)).toContain(CK_text.objectifs().cadrage.needLess);
		
	});
	it("Si je veux passer ma robustesse de 0 à 1 et je suis en phase 1 de cadrage",function(){
		var evaluation = {strength: 0, variety: 0, originality: 0, value: 0};
		var profile = {
			goal : {strength: 1, variety: 0, originality: 0, value: 0},
			step : 1
		};
		expect(CK_objectif.get_strength_suggestions(evaluation,profile)).toContain(CK_text.objectifs().cadrage.needLess);
	});
})