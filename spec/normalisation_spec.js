
describe('CK Normalisation Tests',function(){
	
	beforeEach(function() {

    });

    afterEach(function() {

    });

	it("Si j'ai 2 C et 3 K non normés CK sur 10 éléments",function(){
		var c2_k3 = new c2_k3_sur10_non_norme;
		expect(CK_normalisation.get_not_normalized(c2_k3.elements).concepts.elements.length).toEqual(2);
		expect(CK_normalisation.get_not_normalized(c2_k3.elements).concepts.suggestions).toContain(CK_text.normalisation.s00.fr);
		expect(CK_normalisation.get_not_normalized(c2_k3.elements).knowledges.elements.length).toEqual(3);	
		expect(CK_normalisation.get_not_normalized(c2_k3.elements).knowledges.suggestions).toContain(CK_text.normalisation.s01.fr);
	});
})