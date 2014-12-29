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
        "": "visu",
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
        this.mode = "visu";
        ////////////////////////////////
        // Router
        this.router = new timela.router();
        // Events
        this.listenTo(this.elements, 'add', this.addPostView);
        // templates
        this.template_submenu = _.template($('#timela-submenu-template').html());
        this.template_filter = _.template($('#timela-filter-template').html());

    },
    events : {
      "click .newSimpleConcept" : "newSimpleConcept",
      "click .newSimpleKnowledge" : "newSimpleKnowledge",
    },
    ////////////////////////////////////////////////
    // New element
    ////////////////////////////////////////////////
    newSimpleConcept : function(e){
      e.preventDefault();
      var el = $(this.el).find('#new_concept_input');
      var title = el.val();
      el.html('');
      var new_element = global.newElement("concept",title,"none",global.default_element_position.top,global.default_element_position.left);
      $('#csod').trigger('click');
    },
    newSimpleKnowledge : function(e){
      e.preventDefault();
      var el = $(this.el).find('#new_knowledge_input');
      var title = el.val();
      el.html('');
      var new_element = global.newElement("knowledge",title,"none",global.default_element_position.top,global.default_element_position.left);
      $('#ksod').trigger('click');
    },
    ////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////
    setMode : function(mode){
      this.mode = mode;
      this.render();
    },
    ////////////////////////////////////////////////
    addPostView : function(model){
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
        this.submenu_el.empty();
        this.filter_el.empty();
        this.timeline_el.empty();
        var _this = this;
        // sub menu bar
        this.submenu_el.append(this.template_submenu({
          project : this.project.toJSON(),
          filter : this.filter,
          mode : this.mode
        }));
        // filter
        this.filter_el.append(this.template_filter({
          poches : new Backbone.Collection(this.elements.where({type : "poche"})).toJSON()
        }))
        // elements
        this.elements.each(function(k){
          _this.addPostView(k);
        });
        /////////////////////////
        // Workspace editor
        if(workspaceEditor.views.main != undefined) workspaceEditor.views.main.close();
        workspaceEditor.init({el:"#title_project_dropdown",mode:this.mode});
        // Members editor
        if(usersList.views.main != undefined) usersList.views.main.close(); 
        usersList.init({el : "#members_anager_dropdown",mode : this.mode});


        return this;
    }
});
/////////////////////////////////////////////////
// POST element
/////////////////////////////////////////////////
timela.Views.Element = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','newLinkedConcept','newLinkedKnowledge');
        ////////////////////////////
        this.model = json.model;
        this.user = json.user;
        // Events
        this.listenTo(this.model,"change", this.render); 
        // Templates
        this.template = _.template($('#timela-element-template').html());
    },
    events : {
      "click .newLinkedConcept" : "newLinkedConcept",
      "click .newLinkedKnowledge" : "newLinkedKnowledge",
      "click .remove" : "removeElement"
    },
    removeElement : function(e){
      e.preventDefault();
      var _this = this;
      swal({   
          title: "Are you sure?",   
          text: "this "+_this.model.get('type')+" will be remove, would you continue?",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes, delete it!",   
          closeOnConfirm: true,
          allowOutsideClick : true
      }, 
      function(){   
          _this.model.destroy();
          $("#"+_this.model.get('id')+"_anchor").hide('slow');
      });      
    },
    newLinkedConcept :function(e){
      e.preventDefault();
      var title = $(this.el).find('#input_concept_title').val();
      var top = timela.views.main.elements.get(this.model).get('top') + 100;
      var left = timela.views.main.elements.get(this.model).get('left') + 100;
      var new_element = global.newElement("concept",title,this.model,top,left);
      var new_cklink = global.newLink(timela.views.main.elements.get(new_element.get('id_father')),new_element);
      $(this.el).find('#input_concept_title').html('');
      $('#cod'+this.model.get('id')).trigger('click'); // close the dropdown
    },
    newLinkedKnowledge : function(e){
      e.preventDefault();
      var title = $(this.el).find('#input_knowledge_title').val();
      var top = timela.views.main.elements.get(this.model).get('top') + 100;
      var left = timela.views.main.elements.get(this.model).get('left') + 100;
      var new_element = global.newElement("knowledge",title,this.model,top,left);
      var new_cklink = global.newLink(timela.views.main.elements.get(new_element.get('id_father')),new_element);
      $(this.el).find('#input_knowledge_title').html('');
      $('#kod'+this.model.get('id')).trigger('click'); // close the dropdon
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
        modelEditor.init({
            el:"#"+_this.model.get('id')+"_editor",
            mode: timela.views.main.mode,
            ckeditor : true,
            model : _this.model,
        })
        // Comment
        comments.init({
            el:"#"+_this.model.get('id')+"_comments",
            mode: timela.views.main.mode,
            model : _this.model,
            presentation : "bulle"
        });
        // Comment
        attachment.init({
            el:"#"+_this.model.get('id')+"_attachments",
            mode: timela.views.main.mode,
            model : _this.model,
        });
        // Display true
        //$("#"+model.get('id')+"_anchor").show('slow')      // Do something after 5 seconds
      }, 1000);
      return this;
    }
});
