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
        this.model              = new Backbone.Model();
        this.user               = json.user;
        this.collection         = json.collection;
        // Element
        this.content_el         = $(this.el).find('#cklayout_content_container');
        this.activities_el      = $(this.el).find('#cklayout_activities_container');
        // Events
        this.listenTo(this.model,"remove",this.removeView,this);     
        global.eventAggregator.on("closeModelEditorModal", this.closeModelEditorModal);
        global.eventAggregator.on("openModelEditorModal", this.openModelEditorModal);
    },
    removeView : function(){
        this.remove();
    },
    closeModelEditorModal : function(){
        $(this.el).foundation('reveal', 'close');
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
        this.content_el.empty();
        this.activities_el.empty();
        this.content_el.append(new CKLayout.Views.Main({
            activities_el : this.activities_el,
            className : "panel row",
            model : this.model,
            user : this.user,
        }).render().el);
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
CKLayout.Views.Header = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this,'render');
        this.model = json.model;
        this.labels = json.labels;
        // Events
        this.listenTo(this.model,'change',this.render,this);
        // Templates
        this.template_hearder = _.template($('#CKLayout-header-template').html());
    },
    render : function(){
        $(this.el).empty();
        // Header
        $(this.el).append(this.template_hearder({
            model:this.model.toJSON(),
            labels:this.labels.toJSON()
        }));
        return this;
    }
});
/***************************************/
CKLayout.Views.Main = Backbone.View.extend({
    initialize:function(json){
        _.bindAll(this, 'render');
        CKLayout.init(); // Pour instancier les labels
        // Variables
        this.activities_el      = json.activities_el;
        this.model              = json.model;
        this.eventAggregator    = json.eventAggregator;
        this.user               = global.models.current_user;
        this.labels             = new Backbone.Collection();
        // Label
        if(this.model.get('type') == "concept"){
            this.labels = CKLayout.collections.CLabels;
        }else if(this.model.get('type') === "knowledge"){
            this.labels = CKLayout.collections.KLabels;
        }
        // Events
        //this.model.on('change',this.render,this)
        this.listenTo(this.model,"remove",this.removeView,this);   
        this.listenTo(global.eventAggregator,this.model.get('id'),this.actualize,this) 
        // Templates
        this.template_footer = _.template($('#CKLayout-footer-template').html());
    },
    events : {
        "click .updateLabel" : "updateLabel",
        "click .toConcept" : "convertInConcept",
        "click .toKnowledge" : "convertInKnowledge",
        "click .toCategory" : "convertInCategory",
        "click .remove" : "closeModelEditorModal"
    },
    actualize : function(model){
        this.model = model;
        this.render();
    },
    removeView : function(){
        //this.remove();
        $("#CKLayoutModal").foundation('reveal', 'close');
    },
    convertInConcept : function(e){
        e.preventDefault();
        newModel = new global.Models.ConceptModel(this.model.toJSON());
        console.log("newModel",newModel)
        newModel.set({id_father : "none"});
        console.log("newModel",newModel)
        newModel.save();
        this.model.destroy();
        global.eventAggregator.trigger('closeModelEditorModal');
    },
    convertInKnowledge : function(e){
        e.preventDefault();
        newModel = new global.Models.Knowledge(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        global.eventAggregator.trigger('closeModelEditorModal');
    },
    convertInCategory : function(e){
        e.preventDefault();
        newModel = new global.Models.Poche(this.model.toJSON());
        newModel.save();
        this.model.destroy();
        global.eventAggregator.trigger('closeModelEditorModal');
    },
    closeModelEditorModal : function(e){
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
                global.eventAggregator.trigger('removeCategory',this.model.get('id'));
            }
        ///////////////////////////////////////    
        }else{
            if (confirm("All references attached to this item will also be removed, would you continue?")) {
                global.eventAggregator.trigger('closeModelEditorModal');
                this.model.destroy();
            }
        }
        
    },
    updateLabel : function(e){
        e.preventDefault();
        this.model.save({
            color:e.target.getAttribute("data-label-color"),
            label:e.target.getAttribute("data-label-title")
        });
        if(this.model.get('type') === "concept") global.eventAggregator.trigger("updateMap")
        this.render();
    },
    render:function(){
        $(this.el).empty();
        this.activities_el.empty();
        _this = this;
        // Header
        $(this.el).append(new CKLayout.Views.Header({
            model : this.model,
            labels : this.labels
        }).render().el);
        // Model editor module
        $(this.el).append(new modelEditor.Views.Main({
            user            : this.user,
            model           : this.model,
        }).render().el);
        // IMG List module
        $(this.el).append(new imagesList.Views.Main({
            model           : this.model,
        }).render().el);
        // Attachment module
        $(this.el).append(new attachment.Views.Main({
            model           : this.model,
        }).render().el);
        // Comments module
        $(this.el).append(new comments.Views.Main({
            
            model           : this.model,
            user            : this.user,
        }).render().el);
        
        // notification module
        this.activities_el.append(new activitiesList.Views.Main({
            className       : "row panel",
            model           : this.model,
        }).render().el);
        // Footer
        $(this.el).append(this.template_footer({model:this.model.toJSON()}));
        $(document).foundation();

        return this;
    }
});