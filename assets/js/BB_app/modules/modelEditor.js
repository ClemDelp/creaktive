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
            ckeditor : json.ckeditor,
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
        this.ckeditor = json.ckeditor;
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
        var content = $(this.el).find('.ckeditor').val();
        if(this.ckeditor == true){
            content = CKEDITOR.instances.editor.getData();
            console.log(content)  
        } 
        this.model.save({
            user : this.user,
            title:$(this.el).find(".title").val(),
            content:content,
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
        if(this.ckeditor == true){
            CKEDITOR.replaceAll('ckeditor');
            CKEDITOR.config.toolbar = [
               ['Bold','Italic','Underline','NumberedList','BulletedList','Image','Link','TextColor']
            ] ;    
        }
    },
    render : function(){
        $(this.el).html('');
        // father
        var fathers = this.model.get('id_father')
        if(fathers != "none"){
            var fathers = api.getTreeParentNodes(this.model,this.elements).reverse()
        }
        console.log(fathers)
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_model_normal({
                model : this.model.toJSON(),
                mode : this.bbmapMode,
                fathers : fathers,
                user : this.users.get(this.model.get('user')).toJSON()
        }));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_model_edition({
                model : this.model.toJSON(),
                mode : this.bbmapMode,
                fathers : fathers,
                user : this.users.get(this.model.get('user')).toJSON()
            }));    
        }
        
        return this;
    }
});
