/***************************************/
var modelEditor = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/

  }
};
/***************************************/
modelEditor.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.model = json.model;
        this.eventAggregator = json.eventAggregator;
        this.mode = "normal";
        this.template_model_normal = _.template($('#modelEditor-normal-template').html());
        this.template_model_edition = _.template($('#modelEditor-edition-template').html());
        // Events
        this.model.bind('change',this.render);
    },
    events : {
        "click .edit"  : "editMode",
        "click .updateKnowledge"  : "updateKnowledge",
        "click .cancelEdition"  : "cancelEdition",
        "click .updateLabel" : "updateLabel",
        "click .remove" : "removeKnowledge"
    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    updateKnowledge : function(e){
        e.preventDefault();
        //alert(CKEDITOR.instances.editor.getData())
        this.model.save({
            user : this.user,
            title:$(this.el).find(".title").val(),
            content:CKEDITOR.instances.editor.getData(),
            date: getDate(),
            date2:new Date().getTime()
        });
        this.mode = "normal";
        this.eventAggregator.trigger("updateMap")
        this.render();
    },
    editMode : function(e){
        e.preventDefault();
        this.mode = "edition";
        this.render();
        CKEDITOR.replaceAll('ckeditor');
    },
    render : function(){
        $(this.el).html('');
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_model_normal({model : this.model.toJSON()}));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_model_edition({model : this.model.toJSON()}));    
        }
        
        return this;
    }
});
