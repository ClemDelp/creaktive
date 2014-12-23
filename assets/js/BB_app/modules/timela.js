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
                users : _this.users,
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

    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({
            model : this.model.toJSON()            
        }));
        

        return this;
    }
});
