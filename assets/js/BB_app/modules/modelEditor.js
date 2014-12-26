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
    eventAggregator : global.eventAggregator,
    init: function (json) {
        this.views.main = new this.Views.Main({
            el : json.el,
            user : global.models.current_user,
            model : json.model,
            mode    : json.mode,
            users : global.collections.Users,
            elements : global.collections.Elements,
        });
        this.views.main.render();
    }
};
/***************************************/
modelEditor.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.elements = json.elements;
        this.users = json.users;
        this.bbmapMode = json.mode;
        this.mode = "normal";
        this.model = json.model;
        this.template_model_normal = _.template($('#modelEditor-normal-template').html());
        this.template_model_edition = _.template($('#modelEditor-edition-template').html());
        // Events
        //this.model.bind('change',this.render);
    },
    events : {
        "click .edit"  : "editMode",
        "click .updateModel"  : "updateModel",
        "click .cancelEdition"  : "cancelEdition",
    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    updateModel : function(e){
        e.preventDefault();
        console.log(this.model)
        this.model.save({
            user : this.user,
            title:$(this.el).find(".title").val(),
            content:CKEDITOR.instances.editor.getData(),
            date: getDate(),
            date2:new Date().getTime()
        });       
        this.mode = "normal";
        //global.eventAggregator.trigger("updateMap")
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
        // father
        var father = this.model.get('id_father')
        if(father != "none") father = this.elements.get(father).toJSON();
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_model_normal({
                model : this.model.toJSON(),
                mode : this.bbmapMode,
                father : father,
                user : this.users.get(this.model.get('user')).toJSON()
        }));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_model_edition({
                model : this.model.toJSON(),
                mode : this.bbmapMode,
                father : father,
                user : this.users.get(this.model.get('user')).toJSON()
        }));    
        }
        
        return this;
    }
});
