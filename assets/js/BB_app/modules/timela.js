/////////////////////////////////////////////////
var timela = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  ////////////////////////////////
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new timela.Views.Main({
        el : json.el,
        elements : global.collections.Elements,
        cklinks : global.collections.Links,
        project : global.models.currentProject,
        user : global.models.current_user,
        workspaces : global.collections.Projects,
    });
  }
};
/////////////////////////////////////////////////
// ROUTER
/////////////////////////////////////////////////
timela.router = Backbone.Router.extend({
    routes: {
        "": "edit",
        "edit": "edit",
        "visu": "visu",
    },
    edit: function() {
      timela.views.main.setMode("edit");
    },
    visu: function() {
      timela.views.main.setMode("visu");
    }
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
timela.Views.Main = Backbone.View.extend({

    initialize : function(json) {
        _.bindAll(this, 'render');
        this.submenu_el = $('#submenu_el');
        this.filter_el = $('#filter_el');
        this.timeline_el = $('#timeline_el');
        ////////////////////////////
        this.elements = json.elements;
        this.cklinks = json.cklinks;
        this.project = json.project;
        this.user = json.user;
        this.workspaces = json.workspaces;
        this.filter = "all";
        this.mode = "edit";
        ////////////////////////////////
        // Router
        this.router = new timela.router();
        // Events
        //this.listenTo(this.elements, 'add', this.addPostView);
        this.listenTo(this.elements, 'remove', this.removePostView);
        // templates
        this.template_filter = _.template($('#timela-filter-template').html());

    },
    events : {
      "click .newSimpleConcept" : "newSimpleConcept",
      "click .newSimpleKnowledge" : "newSimpleKnowledge",

      "click .newLinkedConcept" : "newLinkedConcept",
      "click .newLinkedKnowledge" : "newLinkedKnowledge",
      "click .remove" : "removeElement"
    },
    removeElement : function(e){
      e.preventDefault();
      var id = e.target.getAttribute("data-model-id");
      var model = this.elements.get(id)
      var _this = this;
      if(model.get('content') == ""){
          $("#"+model.get('id')+"_anchor").hide('slow');
          model.destroy();
          this.render();
      }
      else{
        swal({   
          title: "Are you sure?",   
          text: "this "+model.get('type')+" will be remove, would you continue?",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes, delete it!",   
          closeOnConfirm: true,
          allowOutsideClick : true
        }, 
        function(){   
            $("#"+model.get('id')+"_anchor").hide('slow');
            model.destroy();
            _this.render();
        });  
      }
            
    },
    newLinkedConcept :function(e){
      e.preventDefault();
      var id = e.target.getAttribute("data-model-id");
      var model = this.elements.get(id)
      var title = $(this.el).find('#'+id+'_input_concept_title').val();
      var top = timela.views.main.elements.get(model).get('top') + 100;
      var left = timela.views.main.elements.get(model).get('left') + 100;
      var new_element = global.newElement("concept",title,top,left);
      var new_cklink = global.newLink(model,new_element);
      $(this.el).find('#'+id+'_input_concept_title').html('');
      $('#cod'+model.get('id')).trigger('click'); // close the dropdown
      this.render();
    },
    newLinkedKnowledge : function(e){
      e.preventDefault();
      var id = e.target.getAttribute("data-model-id");
      var model = this.elements.get(id)
      var title = $(this.el).find('#'+id+'_input_knowledge_title').val();
      var top = timela.views.main.elements.get(model).get('top') + 100;
      var left = timela.views.main.elements.get(model).get('left') + 100;
      var new_element = global.newElement("knowledge",title,top,left);
      var new_cklink = global.newLink(model,new_element);
      $(this.el).find('#'+id+'_input_knowledge_title').html('');
      $('#kod'+model.get('id')).trigger('click'); // close the dropdon
      this.render();
    },
    ////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////
    setMode : function(mode){
      this.mode = mode;
      this.render();
    },
    ////////////////////////////////////////////////
    addPostView : function(model,grid){
      var _this = this;
      if(model.get('type') != "poche"){
        this.timeline_el.prepend(new timela.Views.Element({
            model : model,
            users : this.users,
            user : this.user
        }).render().el);
      }
    },
    render : function(){ 
        //this.submenu_el.empty();
        this.filter_el.empty();
        this.timeline_el.empty();
        var _this = this;
        // sub menu bar
        actionMenu.init({
            el : this.submenu_el,
            filter : "ck",
            mode : this.mode,
            from : "timela"
        });
        // elements
        this.elements.each(function(k){
          _this.addPostView(k);
        });
        
        $(".wall").gridalicious({width: 200});

        return this;
    }
});
/////////////////////////////////////////////////
// POST element
/////////////////////////////////////////////////
timela.Views.Element = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.model = json.model;
        this.user = json.user;
        // Events
        this.listenTo(this.model,"change", this.render); 
        // Templates
        this.template = _.template($('#timela-grid-element-template').html());
    },
    render : function(){  
      var _this = this;      
      $(this.el).empty();
      $(this.el).append(this.template({
        mode : timela.views.main.mode,
        model : this.model.toJSON()            
      }));

      setTimeout(function() {
        // Editor
        $('#'+_this.model.get('id')+"_googleImage").html(new googleSearch.Views.Main({
            model      : _this.model,
            mode       : _this.mode,
            type       : "images",
            perpage    : 3,
            moreButton : true,
            width      : "75px",
        }).render().el);

      }, 100);
      return this;
    }
});
