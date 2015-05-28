module.exports = {
  getKnowledgeByStatus : function(elements){
      var k_validees = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_validees"});
      var k_encours = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_encours"});
      var k_manquante = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_manquante"});
      var k_indesidable = ckSuggest.elements.where({"type" : "knowledge", "css_manu" : "k_indesidable"});
      return {"k_validees" : k_validees, "k_encours" : k_encours, "k_manquante" : k_manquante, "k_indesidable" : k_indesidable};
  },
  getConceptByStatus : function(elements){
      var c_connu = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_connu"});
      var c_atteignable = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_atteignable"});
      var c_alternatif = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_alternatif"});
      var c_hamecon = ckSuggest.elements.where({"type" : "concept", "css_manu" : "c_hamecon"});
      return {"c_connu" : c_connu, "c_atteignable" : c_atteignable, "c_alternatif" : c_alternatif, "c_hamecon" : c_hamecon};
  },

  get_originality_patrick : function(){

  },
  get_originality_mines : function(){

  },
}