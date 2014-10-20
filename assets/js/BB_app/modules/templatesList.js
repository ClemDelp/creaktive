/////////////////////////////////////////////////
var templatesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    
  }
};
/////////////////////////////////////////////////
// Template
/////////////////////////////////////////////////
templatesList.Views.Template = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.template = json.template;
        this.mode = json.mode;
        this.model = json.model;
        this.templates_collection = json.templates_collection;
        // Templates
        this.template_t = _.template($('#templatesList-template').html());
        // Events
    },
    events : {
        "click .applyTemplate" : "applyTemplate",
        "click .removeTemplate" : "removeTemplate"
    },
    removeTemplate : function(e){
        e.preventDefault();
        if(confirm("Delete this label?")){
            var template_model = this.templates_collection.get(this.template.id);
            this.templates_collection.remove(template_model);
            var array = [];
            this.templates_collection.each(function(model){
                array.push(model);
            })
            global.models.currentProject.save({templates : array});    
        }
    },
    applyTemplate : function(e){
        e.preventDefault();
        this.model.set({css:this.template.css}).save();
    },
    render : function(){        
        ///////////////////////
        // init
        _this = this;
        $(this.el).empty();
        $(this.el).append(this.template_t({
            template:this.template,
            mode : this.mode
        }))
        return this;
    }
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
templatesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.mode = json.mode;
        this.model = json.model;
        this.childViews = [];
        // Events
        this.listenTo(global.models.currentProject,'change:templates',this.render,this);
        // Templates
        this.template_header = _.template($('#templatesList-header-template').html());
    },
    render : function(){        
        ///////////////////////
        // init
        var _this = this;
        this.templates_collection = new Backbone.Collection(global.models.currentProject.get('templates'))
        $(this.el).empty();
        // Header
        $(this.el).append(this.template_header())
        // Templates
        global.models.currentProject.get('templates').forEach(function(template){
            var childView = new templatesList.Views.Template({
                tagName : "span",
                mode : this.mode,
                model:_this.model,
                templates_collection : _this.templates_collection,
                template : template
            });
            $(_this.el).append(childView.render().el);
            _this.childViews.push(childView);    
        });
        
        return this;
    }
});
/////////////////////////////////////////////////
