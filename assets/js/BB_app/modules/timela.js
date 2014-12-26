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
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// ROUTER
/////////////////////////////////////////////////
timela.router = Backbone.Router.extend({
    routes: {
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
        // templates
        this.template_submenu = _.template($('#timela-submenu-template').html());
        this.template_filter = _.template($('#timela-filter-template').html());

    },
    events : {
      "click .newSimpleConcept" : "newSimpleConcept",
      "click .newSimpleKnowlege" : "newSimpleKnowlege",
    },
    ////////////////////////////////////////////////
    // New element
    ////////////////////////////////////////////////
    newSimpleConcept : function(e){
      e.preventDefault();
      alert('new simple concept')
      var el = $(this.el).find('#new_concept_input');
      var title = el.val();
      el.html('');
      var new_element = global.newElement("concept",title,"none",global.default_element_position.top,global.default_element_position.left);
    },
    newSimpleKnowlege : function(e){
      e.preventDefault();
      var el = $(this.el).find('#new_knowledge_input');
      var title = el.val();
      el.html('');
      var new_element = global.newElement("knowledge",title,"none",global.default_element_position.top,global.default_element_position.left);
    },
    ////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////
    setMode : function(mode){
      this.mode = mode;
      this.render();
    },
    render : function(){        
        $(this.el).empty();
        var _this = this;
        // sub menu bar
        $(this.el).append(this.template_submenu({
          project : this.project.toJSON(),
          filter : this.filter,
          mode : this.mode
        }));
        // filter
        $(this.el).append(this.template_filter({
          poches : new Backbone.Collection(this.elements.where({type : "poche"})).toJSON()
        }))
        // elements
        $(this.el).append(new timela.Views.Elements({
          className : "large-9 medium-9 small-12 columns",
          users : _this.users,
          elements : _this.elements,
          user : _this.user,
          mode : this.mode
        }).render().el);
        // Part element
        this.elements.each(function(k){
          if(k.get('type') != "poche"){
            // Editor
            modelEditor.init({
                el:"#"+k.get('id')+"_editor",
                mode: _this.mode,
                model : k,
            })
            // Comment
            comments.init({
                el:"#"+k.get('id')+"_comments",
                mode: _this.mode,
                model : k,
                presentation : "bulle"
            });
            // Comment
            attachment.init({
                el:"#"+k.get('id')+"_attachments",
                mode: _this.mode,
                model : k,
            });  
          }
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
// Elements
/////////////////////////////////////////////////
timela.Views.Elements = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.elements = json.elements;
        this.user = json.user;
        // Events

        // Templates
        this.template = _.template($('#timela-element-template').html());
    },
    events : {

    },
    render : function(){        
        $(this.el).empty();
        var _this = this;
        // Elements
        this.elements.each(function(k){
          if(k.get('type') != "poche"){
            $(_this.el).append(new timela.Views.Element({
                model : k,
                users : _this.users,
                user : _this.user
            }).render().el);
          }
        });
        

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

        // Templates
        this.template = _.template($('#timela-element-template').html());
    },
    events : {
      "click .newLinkedConcept" : "newLinkedConcept",
      "click .newLinkedKnowledge" : "newLinkedKnowledge"
    },
    newLinkedConcept :function(e){
      e.preventDefault();
      var title = "";
      var father_id = this.element.get('id');
      var top = this.elements.get(father_id).get('top') + 100;
      var left = this.elements.get(father_id).get('left') + 100;
      var new_element = global.newElement("concept",title,father_id,top,left);
      var new_cklink = global.newLink(this.elements.get(new_element.get('id_father')),new_element);
    },
    newLinkedKnowledge : function(e){
      e.preventDefault();
      var title = "";
      var father_id = this.element.get('id');
      var top = this.elements.get(father_id).get('top') + 100;
      var left = this.elements.get(father_id).get('left') + 100;
      var new_element = global.newElement("knowledge",title,father_id,top,left);
      var new_cklink = global.newLink(this.elements.get(new_element.get('id_father')),new_element);
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({
            model : this.model.toJSON()            
        }));
        

        return this;
    }
});
