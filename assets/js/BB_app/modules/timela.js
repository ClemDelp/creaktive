/////////////////////////////////////////////////
var timela = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  ////////////////////////////////
  // Timela element
  Element : Backbone.Model.extend({
    initialize : function Model() {
        this.bind("error", function(model, error){console.log( error );});
    }
  }),
  Elements : Backbone.Collection.extend({
    //model : this.Element,
    comparator: function(m){return -m.get('updatedAt');},
    initialize : function() {},
  }),
  ////////////////////////////////
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new timela.Views.Main({
        el : json.el,
        knowledges : global.collections.Knowledges,
        concepts : global.collections.Concepts,
        cklinks : global.collections.Links,
        project : global.models.currentProject,
        user : global.models.current_user,
        workspaces : global.collections.Projects
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
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

    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({
            model : this.model.toJSON(),
            user : this.user.toJSON()
        }));
        

        return this;
    }
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
timela.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.cklinks = json.cklinks;
        this.project = json.project;
        this.user = json.user;
        this.workspaces = json.workspaces;
        /////////////////////////
        // Prepare elements
        this.elements = new timela.Elements();
        this.elements.add(this.knowledges.toJSON())
        this.elements.add(this.concepts.toJSON())
        // Events

    },
    events : {

    },
    render : function(){        
        $(this.el).empty();
        var _this = this;
        this.elements.each(function(k){
            $(_this.el).append(new timela.Views.Element({
                model : k,
                user : _this.user
            }).render().el);
        });
        // Comments module
        this.elements.each(function(k){
          // Editor
          modelEditor.init({
              el:"#"+k.get('id')+"_editor",
              mode: "edit",
              model : k,
          })
          // Comment
          comments.init({
              el:"#"+k.get('id')+"_comments",
              mode: "edit",
              model : k,
              presentation : "classic"
          });


        });
        return this;
    }
});
/////////////////////////////////////////////////
