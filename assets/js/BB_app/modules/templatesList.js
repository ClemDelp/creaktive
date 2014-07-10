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
        this.model = json.model;
        // Templates
        this.template_t = _.template($('#templatesList-template').html());
    },
    events : {
        "click .button" : "applyTemplate"
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
        $(this.el).append(this.template_t({template:this.template}))
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
        this.model = json.model;
        this.templates = json.templates;
        // Templates
        this.template_header = _.template($('#templatesList-header-template').html());
    },
    render : function(){        
        ///////////////////////
        // init
        var _this = this;
        $(this.el).empty();
        $(this.el).append(this.template_header())
        this.templates.forEach(function(template){
            $(_this.el).append(new templatesList.Views.Template({
                tagName : "center",
                model:_this.model,
                template : template
            }).render().el);    
        });
        
        return this;
    }
});
/////////////////////////////////////////////////
