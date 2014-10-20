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
        this.mode = json.mode;
        this.model = json.model;
        this.mode = "normal";
        this.template_model_normal = _.template($('#modelEditor-normal-template').html());
        this.template_model_edition = _.template($('#modelEditor-edition-template').html());
        // Events
        //this.model.bind('change',this.render);
    },
    events : {
        "click .edit"  : "editMode",
        "click .updateModel"  : "updateModel",
        "click .cancelEdition"  : "cancelEdition",
        "click .updateLabel" : "updateLabel",
        "click .remove" : "removeKnowledge"
    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    updateModel : function(e){
        e.preventDefault();
        _this = this;
        //////////////////////////////////////
        // Si cest une category et que le titre change on doit updater tous tags qui référence les K
        if(this.model.get('type') === "category"){
            if(this.model.get('title') != $(this.el).find(".title").val()){
                if (confirm("The title of the category has changed, would you want to change all references in the relevant knowledge?")) {
                    // change knowledge reference
                    global.collections.Knowledges.each(function(knowledge){
                        new_tags_array = []
                        knowledge.get('tags').forEach(function(tag){
                            if(_this.model.get('title') == tag){
                                new_tags_array.unshift($(_this.el).find(".title").val());
                            }else{
                                new_tags_array.unshift(tag);
                            }
                        });
                        knowledge.set({
                            tags : new_tags_array,
                            date : getDate(),
                            user : _this.user
                        }).save();
                    });
                    // Set the category title
                    this.model.set({
                        title : $(this.el).find(".title").val(),
                        date: getDate()
                    });
                    global.eventAggregator.trigger('updateCategory',this.model.get('id'),this.model.get('title'))
                }
            }
            this.model.set({
                user : this.user,
                description:CKEDITOR.instances.editor.getData(),
                content:CKEDITOR.instances.editor.getData(),
                date: getDate(),
                date2:new Date().getTime()
            }).save(); 
        //////////////////////////////////////
        }else{
            this.model.save({
                user : this.user,
                title:$(this.el).find(".title").val(),
                content:CKEDITOR.instances.editor.getData(),
                date: getDate(),
                date2:new Date().getTime()
            });       
        }
        this.mode = "normal";
        global.eventAggregator.trigger("updateMap")
        this.render();
    },
    editMode : function(e){
        e.preventDefault();
        this.mode = "edition";
        this.render();
        CKEDITOR.replaceAll('ckeditor');
        CKEDITOR.config.toolbar = [
           ['Bold','Italic','Underline','NumberedList','BulletedList','Image','Link','TextColor']
        ] ;
        // CKEDITOR.config.toolbar = [
        //     { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Print', '-', 'Templates', '-' , 'Maximize' ] },
        //     { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        //     { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
        //     { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        //     { name: 'insert', items: [ 'Image', 'Link', 'Unlink', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar' ] },
        //     { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        //     { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        // ];
    },
    render : function(){
        $(this.el).html('');
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_model_normal({
                model : this.model.toJSON(),
                mode : this.mode
        }));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_model_edition({
                model : this.model.toJSON(),
                mode : this.mode
        }));    
        }
        
        return this;
    }
});
