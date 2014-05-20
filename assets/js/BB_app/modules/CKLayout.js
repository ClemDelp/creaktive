/////////////////////////////////////////
// MODULE
/////////////////////////////////////////
var CKLayout = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    // Concept labels
    CKLayout.collections.CLabels = new CKLayout.Collections.Labels();
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Known",color:"#27AE60"}));
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Reachable",color:"#F39C12"}));
    CKLayout.collections.CLabels.add(new CKLayout.Models.Label({id:guid(),title:"Alternative",color:"#C0392B"}));
    // Knowledge Labels
    CKLayout.collections.KLabels = new CKLayout.Collections.Labels();
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Validated",color:"#27AE60"}));
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Processing",color:"#F39C12"}));
    CKLayout.collections.KLabels.add(new CKLayout.Models.Label({id:guid(),title:"Missing",color:"#C0392B"}));
  }
};
/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
CKLayout.Models.Label = Backbone.Model.extend({
    defaults : {
        id : "",
        title : "",
        color : ""
    },
    initialize : function Label() {
        //console.log('Filter explorer Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/***************************************/
CKLayout.Collections.Labels = Backbone.Collection.extend({
    model : CKLayout.Models.Label,
    initialize : function() {
        //console.log('Filters explorer collection Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
CKLayout.Views.Modal = Backbone.View.extend({
    el:"#CKLayoutModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModelEditorModal');
        // Variables
        this.notifications = json.notifications;
        this.model = new Backbone.Model();
        this.user = json.user;
        this.collection = json.collection;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on("removeModel", this.closeModelEditorModal);
        this.eventAggregator.on("removeKnowledge", this.closeModelEditorModal);
        this.eventAggregator.on("openModelEditorModal", this.openModelEditorModal);
    },
    closeModelEditorModal : function(){
        $('#CKLayoutModal').foundation('reveal', 'close');
    },
    openModelEditorModal : function(id){
        this.model = this.collection.get(id);
        this.render(function(){
            $('#CKLayoutModal').foundation('reveal', 'open'); 
            try{
                $(document).foundation();
            }catch(err){
                console.log(err);
            }

        }); 
        
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(new CKLayout.Views.Main({
            className : "panel row",
            notifications : this.notifications,
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
        CKLayout.init(); // Pour instancier les labels
        // Variables
        this.notifications      = json.notifications;
        this.notif_to_render    = new Backbone.Collection();
        this.model              = json.model;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Init
        _this = this;
        this.labels             = new Backbone.Collection();
        if(this.model.get('type') === "concept"){
            this.labels = CKLayout.collections.CLabels;
            this.notifications.each(function(notification){
                if(notification.get('to').id == _this.model.get('id')){_this.notif_to_render.add(notification)}
            });
        }else if((this.model.get('type') === "category")||(this.model.get('type') === "knowledge")){
            this.labels = CKLayout.collections.KLabels;
            this.notifications.each(function(notification){
                if(notification.get('to').id == _this.model.get('id')){_this.notif_to_render.add(notification)}
            });
        }else if(this.model.get('type') === "project"){
            this.notif_to_render.add(this.notifications.where({project_id : this.model.get('id')}))
        }
        // Events
        this.model.on('change',this.render)
        // Templates
        this.template_hearder = _.template($('#CKLayout-header-template').html());
        this.template_footer = _.template($('#CKLayout-footer-template').html());
    },
    events : {
        "click .updateLabel" : "updateLabel",
        "click .toConcept" : "convertInConcept",
        "click .toKnowledge" : "convertInKnowledge",
        "click .toCategory" : "convertInCategory",
        "click .remove" : "removeModel"
    },
    convertInConcept : function(e){
        e.preventDefault();
        newModel = new global.Models.ConceptModel(this.model.toJSON());
        console.log("newModel",newModel)
        newModel.set({id_father : "none"});
        console.log("newModel",newModel)
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('removeModel');
    },
    convertInKnowledge : function(e){
        e.preventDefault();
        newModel = new global.Models.Knowledge(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('removeModel');
    },
    convertInCategory : function(e){
        e.preventDefault();
        newModel = new global.Models.Poche(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        this.eventAggregator.trigger('removeModel');
    },
    removeModel : function(e){
        e.preventDefault();
        _this = this;
        ///////////////////////////////////////
        // Si c'est une category on doit supprimer le tag qui référence cette category
        if(this.model.get('type') == "category"){
            if (confirm("If you delete this category, the system will delete the reference in each knowledge, would you continue?")) {
                // change knowledge reference
                global.collections.Knowledges.each(function(knowledge){
                    knowledge.set({
                        tags : _.without(knowledge.get('tags'),_this.model.get('title')),
                        date : getDate(),
                        user : _this.user
                    }).save();
                });
                this.model.destroy();
                this.eventAggregator.trigger('removeCategory',this.model.get('id'));
            }
        ///////////////////////////////////////    
        }else{
            if (confirm("All references attached to this item will also be removed, would you continue?")) {
                this.model.destroy();
            }
        }
        this.eventAggregator.trigger('removeModel');
    },
    updateLabel : function(e){
        e.preventDefault();
        this.model.save({
            color:e.target.getAttribute("data-label-color"),
            label:e.target.getAttribute("data-label-title")
        });
        if(this.model.get('type') === "concept") this.eventAggregator.trigger("updateMap")
        this.render();
    },
    render:function(){
        $(this.el).html('');
        _this = this;
        // Header
        $(this.el).append(this.template_hearder({
            model:this.model.toJSON(),
            labels:this.labels.toJSON()
        }));
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
        // IMG List module
        $(this.el).append(new imagesList.Views.Main({
            className       : "large-8 medium-8 small-8 columns",
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // notification module
        $(this.el).append(new activitiesList.Views.Main({
            className       : "large-8 medium-8 small-8 columns floatLeft",
            //model           : this.model,
            notifications   : this.notif_to_render,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Footer
        $(this.el).append(this.template_footer({model:this.model.toJSON()}));

        return this;
    }
});