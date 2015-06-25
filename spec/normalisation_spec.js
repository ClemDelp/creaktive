
describe('CK Normalisation Tests',function(){
	
	beforeEach(function(){});
    afterEach(function(){});

	it("normalisation satut - C not categorized",function(){
		var data = new element_generator({"type":"concept"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var statut = normalisations.statuts;
		expect(statut[0].suggestion).toEqual(CK_text.suggestions().s00.suggestion);
		expect(statut[0].options.length).toEqual(5);
	});

	it("normalisation satut - C categorized",function(){
		var data = new element_generator({"type":"concept","css_manu" : "c_connu"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var statut = normalisations.statuts;
		expect(statut[0].suggestion).toEqual(CK_text.suggestions().s02.suggestion);
		expect(statut[0].options.length).toEqual(5);
	});

	it("normalisation satut - K not categorized",function(){
		var data = new element_generator({"type":"knowledge"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var statut = normalisations.statuts;
		expect(statut[0].suggestion).toEqual(CK_text.suggestions().s01.suggestion);
		expect(statut[0].options.length).toEqual(5);
	});

	it("normalisation satut - K categorized",function(){
		var data = new element_generator({"type":"knowledge","css_manu" : "k_encours"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var statut = normalisations.statuts;
		expect(statut[0].suggestion).toEqual(CK_text.suggestions().s03.suggestion);
		expect(statut[0].options.length).toEqual(5);
	});

	it("normalisation localisation - K vierge",function(){
		var data = new element_generator({"type":"knowledge"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var localisation = normalisations.localisations;
		expect(localisation[0].suggestion).toEqual(CK_text.suggestions().s04.suggestion);
		expect(localisation[0].options.length).toEqual(3);
	});

	it("normalisation localisation - K inside",function(){
		var data = new element_generator({"type":"knowledge","inside" : "inside"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var localisation = normalisations.localisations;
		expect(localisation[0].suggestion).toEqual(CK_text.suggestions().s05.suggestion);
		expect(localisation[0].options.length).toEqual(3);
	});

	it("normalisation localisation - K outside",function(){
		var data = new element_generator({"type":"knowledge","inside" : "outside"});
		var normalisations = CK_normalisation.get_normalisations(data.element);
		var localisation = normalisations.localisations;
		expect(localisation[0].suggestion).toEqual(CK_text.suggestions().s06.suggestion);
		expect(localisation[0].options.length).toEqual(3);
	});
})