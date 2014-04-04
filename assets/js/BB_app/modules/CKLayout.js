/***************************************/
var CKLayout = {
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
CKLayout.Views.Modal = Backbone.View.extend({
    el:"#CKLayoutModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModelEditorModal');
        // Variables
        this.model = new Backbone.Model();
        this.user = json.user;
        this.collection = json.knowledges || json.concepts;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on("removeKnowledge", this.closeModelEditorModal);
        this.eventAggregator.on("openModelEditorModal", this.openModelEditorModal);
    },
    closeModelEditorModal : function(){
        $('#CKLayoutModal').foundation('reveal', 'close');
    },
    openModelEditorModal : function(k_id){
        this.model = this.collection.get(k_id);
        this.render(function(){
            $('#CKLayoutModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(new CKLayout.Views.Main({
            className : "panel row",
            model : this.model,
            user : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
CKLayout.Views.Main = Backbone.View.extend({
    initialize:function(json){
        _.bindAll(this, 'render');
        // Variables
        this.model              = json.model;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.model.bind('change',this.render)
        // Templates
        this.template_hearder = _.template($('#CKLayout-header-template').html());
        this.template_footer = _.template($('#CKLayout-footer-template').html());
    },
    events : {
        "click .updateLabel" : "updateLabel",
        "click .remove" : "removeKnowledge"
    },
    removeKnowledge : function(e){
        this.model.destroy(); 
        this.eventAggregator.trigger('removeKnowledge');
    },
    updateLabel : function(e){
        e.preventDefault();
        this.model.set({color:e.target.getAttribute("data-label-color")}).save();
        this.eventAggregator.trigger("colorChanged")
        this.render();
    },
    render:function(){
        $(this.el).html('');
        // Header
        $(this.el).append(this.template_hearder({model:this.model.toJSON()}));
        // Model editor module
        $(this.el).append(new modelEditor.Views.Main({
            className       : "large-8 medium-8 small-8 columns",
            user            : this.user,
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Attachment module
        $(this.el).append(new attachment.Views.Main({
            className       : "large-4 medium-4 small-4 columns",
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Comments module
        $(this.el).append(new comments.Views.Main({
            className       : "large-4 medium-4 small-4 columns floatRight",
            model           : this.model,
            user            : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Footer
        $(this.el).append(this.template_footer({model:this.model.toJSON()}));

        return this;
    }
});