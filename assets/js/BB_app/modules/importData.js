/////////////////////////////////////////////////
var importData = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new importData.Views.Main({
      el : "#importData_container",
      project : global.models.currentProject,
      projects : global.collections.Projects,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
importData.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.project = json.project;
        this.projects = json.projects;
        this.projects.remove(this.project)
        //this.categories = new Backbone.Collection();
        this.links = new Backbone.Collection();
        this.elements = new Backbone.Collection();
        //this.concepts = new Backbone.Collection();
        // Templates
        this.template = _.template($('#importData-template').html());
        this.template_categories_list = _.template($('#importData-categories-template').html());
        this.template_knowledges_list = _.template($('#importData-knowledges-template').html());
        this.template_concepts_list = _.template($('#importData-concepts-template').html());
    },
    events : {
      "change #projectSelection" : "setProject",
      "click #importData" : "importDataIntoBBmap",
      "click .categories_list" : "clickOnCategoryEl",
    },
    clickOnCategoryEl : function(e){
      var ks_linked = api.getModelsLinkedToModel(this.links,this.knowledges,this.categories.get(e.target.getAttribute("value")));
      ks_linked.forEach(function(k){
        $( "#checkbox_"+k.get('id') ).prop( "checked", true );  
      });
    },
    setProject : function(e){
        e.preventDefault();
        var project_id = $(e.target).val();
        var _this = this;
        $.get("/bbmap/importElementsFromProject", {project_id : project_id}, function(data){ 
          $('#categories_list_container').html(_this.template_categories_list({categories : data}))
          _this.elements = new global.Collections.Elements(data);
        });
        $.get("/bbmap/importLinksFromProject", {project_id : project_id}, function(data){
          console.log("liiinks",data)
          _this.links = new global.Collections.CKLinks(data);
        });
    },
    importDataIntoBBmap : function(e){
      e.preventDefault();
      var _this = this;
      var ks = [];
      var cs = [];
      var cpts = [];
      $(".knowledges_list:checked").each(function(){
        ks.push($(this).val());
      });
      if(ks.length > 0){
        ks.forEach(function(k){
          _this.cloneAndImportToBBmap(k, _this.knowledges, bbmap.views.main.knowledges)
        });
      }
      
      $(".categories_list:checked").each(function(){
        cs.push($(this).val());
      });
      if(cs.length > 0){
        cs.forEach(function(c){
          _this.cloneAndImportToBBmap(c, _this.categories, bbmap.views.main.poches)
        });  
      }

      $(".concepts_list:checked").each(function(){
        cpts.push($(this).val());
      });
      if(cpts.length > 0){
        cpts.forEach(function(c){
          _this.cloneAndImportToBBmap(c, _this.concepts, bbmap.views.main.concepts)
        });  
      }

      $('#importData_container').foundation('reveal', 'close');

    },
    cloneAndImportToBBmap : function(model_id, collectionLocale, collectionBBmap){
      var _this = this;
      var clone = collectionLocale.get(model_id).clone();
      clone.save({id: guid(),project : _this.project.get('id')},{silent:true});
      collectionBBmap.add(clone);
      bbmap.views.main.addModelToView(clone);  
    },
    render : function(){        
        ///////////////////////
        // init
        $(this.el).empty();
        $(this.el).append(this.template({
          projects : this.projects.toJSON()
        }));
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
