/////////////////////////////////////////
// MODULE
/////////////////////////////////////////
var categoryEditor = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
categoryEditor.Views.Modal = Backbone.View.extend({
    el:"#categoryEditorModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openCategoryEditorModal');
        // Variables
        this.notifications = json.notifications;
        this.knowledges = new Backbone.Collection(); // The attach knowledges
        this.category = new Backbone.Model();
        this.user = json.user;
        this.categories = json.categories;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on("openCategoryEditorModal", this.openCategoryEditorModal);
        this.eventAggregator.on("removeCategory", this.closeCategoryEditorModal);
    },
    alert : function(){
        alert("azazza")
    },
    closeCategoryEditorModal : function(){
        $('#categoryEditorModal').foundation('reveal', 'close');
    },
    openCategoryEditorModal : function(c_id,knowledges){
        this.knowledges = knowledges;
        this.category = this.categories.get(c_id);
        this.render(function(){
            $('#categoryEditorModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(new categoryEditor.Views.Main({
            className : "panel row",
            knowledges : this.knowledges,
            notifications : this.notifications,
            category : this.category,
            user : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
categoryEditor.Views.Main = Backbone.View.extend({
    initialize:function(json){
        _.bindAll(this, 'render','updateCategory');
        // Variables
        this.notifications          = json.notifications;
        this.knowledges             = json.knowledges;
        this.category               = json.category;
        this.user                   = json.user;
        this.eventAggregator        = json.eventAggregator;
        this.mode                   = "normal";
        this.template_category_normal  = _.template($('#categoryEditor-normal-template').html());
        this.template_category_edition = _.template($('#categoryEditor-edition-template').html());
    },
    events : {
        "click .updateCategory" : "updateCategory",
        "click .removeCategory" : "removeCategory",
        "click .edit"           : "editMode",
        "click .cancelEdition"  : "cancelEdition"
    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    removeCategory : function(e){
        e.preventDefault();
        if (confirm("If you delete this category, the system will delete the reference in each knowledge, would you continue?")) {
            this.category.destroy();
            _this = this;
            // change knowledge reference
            this.knowledges.each(function(knowledge){
                knowledge.set({
                    tags : _.without(knowledge.get('tags'),_this.category.get('title')),
                    date : getDate(),
                    user : _this.user
                }).save();
            });
            this.eventAggregator.trigger('removeCategory',this.category.get('id'));
        }
    },
    updateCategory : function(e){
        e.preventDefault();
        _this = this;
        if(this.category.get('title') != $(this.el).find(".title_category").val()){
            if (confirm("The title of the category has changed, would you want to change all references in the relevant knowledge?")) {
                // change knowledge reference
                this.knowledges.each(function(knowledge){
                    new_tags_array = []
                    knowledge.get('tags').forEach(function(tag){
                        if(_this.category.get('title') == tag){
                            new_tags_array.unshift($(_this.el).find(".title_category").val());
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
                this.category.set({
                    title : $(this.el).find(".title_category").val(),
                    date: getDate()
                });
                this.eventAggregator.trigger('updateCategory',this.category.get('id'),this.category.get('title'))
            }
        }
        this.category.set({
            user : this.user,
            description:CKEDITOR.instances.editor.getData(),
            date: getDate()
        }).save(); 
        this.mode = "normal";
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
        _this = this;
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_category_normal({category : this.category.toJSON()}));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_category_edition({category : this.category.toJSON()}));    
        }
        // notification module
        $(this.el).append(new activitiesList.Views.Main({
            className       : "expand",
            model           : this.category,
            notifications   : this.notifications,
            eventAggregator : this.eventAggregator
        }).render().el);
        
        return this;
    }
});