describe('CreaKtive API Suggestion Tests',function(){
	
	beforeEach(function() {

    });

    afterEach(function() {

    });

	it("Si j'ai une originalité < 4",function(){
		var c_3 = new c_3_connu_atteignable_alternatif;
		// originalité < 4
		expect(SuggestionAlgo.get_originality_suggest(c_3.elements)).toContain(SuggestionText.s0.fr);
		expect(SuggestionAlgo.get_originality_suggest(c_3.elements)).toContain(SuggestionText.s1.fr);
	});

	it("Si j'ai une originalité = 4",function(){
		var c_4 = new c_4_color;
		// originalité = 4
		expect(SuggestionAlgo.get_originality_suggest(c_4.elements)).toContain(SuggestionText.s2.fr);
		expect(SuggestionAlgo.get_originality_suggest(c_4.elements)).toContain(SuggestionText.s3.fr);
	});
	it("Si j'ai aucun c connu",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c connu
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s4.fr);
	});
	it("Si j'ai aucun c atteignable",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c atteignable
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s5.fr);
	});
	it("Si j'ai aucun c alternatif",function(){
		var c_1_h = new c_1_hamecon;
		// aucun c alternatif
		expect(SuggestionAlgo.get_originality_suggest(c_1_h.elements)).toContain(SuggestionText.s6.fr);
	});
	it("Si j'ai aucun c hamecon",function(){
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

})