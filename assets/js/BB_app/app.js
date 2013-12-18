/////////////////////////////////////////////////////////////////////////////////////////////
// globalObj object
/////////////////////////////////////////////////////////////////////////////////////////////
var globalObj = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Objects
  currentUser : {},
  currentProject : {},

  init: function (callback) {
    /*Init*/
    console.log("globalObj object loading...");
    /*Models*/
    currentUser = new this.Models.UserModel();
    currentProject = new this.Models.ProjectModel();
    /*Collections*/
    this.collections.Projects = new this.Collections.ProjectsCollection();
    this.collections.Concepts = new this.Collections.ConceptsCollection();
    this.collections.Links = new this.Collections.LinksCollection();

    /*Fetch*/
    this.collections.Projects.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){},
    });
    this.collections.Concepts.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){
        console.log(response)
      },
    });
    this.collections.Links.fetch({
      reset:true,
      success : function(collection, response, options){},
      complete : function(collection, response, options){},
      error : function(collection, response, options){
        console.log(response)
      },
    });
    callback();    
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// CONCEPTS PART
/////////////////////////////////////////////////////////////////////////////////////////////
var concepts = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Objects
  eventAggregator : {},


  init: function () {
    /*Init*/
    console.log("concepts loading...");
    _this = this;
    _.extend(this.eventAggregator, Backbone.Events);
    /*views*/
    this.views.MapView = new this.Views.MapView({
      currentUser : new globalObj.Models.UserModel(),
      currentProject : new globalObj.Models.ProjectModel({}),
      collection : globalObj.collections.Concepts,
      eventAggregator : this.eventAggregator,
    });

    this.views.KnowledgeView = new this.Views.KnowledgeView({
      concepts : globalObj.collections.Concepts,
      links : this.collections.Links,
      eventAggregator : this.eventAggregator
    });


    /*Loads*/
    //this.views.MapView.render();
    this.views.KnowledgeView.render();
  }
};

