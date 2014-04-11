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
        this.category = new Backbone.Model();
        this.user = json.user;
        this.categories = json.categories;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on("openCategoryEditorModal", this.openCategoryEditorModal);
        this.eventAggregator.on("removeCategory", this.closeCategoryEditorModal);
    },
    closeCategoryEditorModal : function(){
        $('#categoryEditorModal').foundation('reveal', 'close');
    },
    openCategoryEditorModal : function(c_id){
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
        _.bindAll(this, 'render');
        // Variables
        this.notifications          = json.notifications;
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
        this.category.destroy(); 
        this.eventAggregator.trigger('removeKnowledge');
    },
    updateCategory : function(e){
        e.preventDefault();
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
        notif_to_send = new Backbone.Collection();
        this.notifications.each(function(notification){
            if(notification.get('to') == _this.category.get('id')){notif_to_send.add(notification)}
        });
        $(this.el).append(new activitiesList.Views.Main({
            className       : "expand",
            notifications   : notif_to_send,
            eventAggregator : this.eventAggregator
        }).render().el);
        
        return this;
    }
});