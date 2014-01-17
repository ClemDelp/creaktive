var should = chai.should();


describe('application', function () {
  it('creates a global variable for the name space', function () {
    should.exist(globalObj)
  });
});

//TODO : faire les tests autours des objets dans un premiers temps. on verra après pour l'enchainement ;-)

describe('Concept model', function(){
  describe('Initialization', function () {
    beforeEach(function () {
      this.fetch_stub = sinon.stub("fetch")
      globalObj.init(function(){
        
      });
      this.concept = new globalObj.Model.Concept();
    });

    it("The title should be empty'", function () {
      this.concept.should.not.be.null;
      console.log("tutu")
    });
  });
})