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
        this.type = json.type;
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
            notifications : this.notifications,
            type : this.type,
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
        CKLayout.init();
        // Variables
        this.notifications      = json.notifications;
        this.model              = json.model;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Labels
        this.type               = json.type;
        this.labels             = Backbone.Collection;
        if(this.type === "concept"){
            this.labels = CKLayout.collections.CLabels;
        }else{
            this.labels = CKLayout.collections.KLabels;
        }
        // Events
        this.model.on('change',this.render)
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
        this.model.set({
            color:e.target.getAttribute("data-label-color"),
            label:e.target.getAttribute("data-label-title")
        }).save();
        this.eventAggregator.trigger("colorChanged")
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
        // notification module
        notif_to_send = new Backbone.Collection();
        this.notifications.each(function(notification){
            if(notification.get('to') == _this.model.get('id')){notif_to_send.add(notification)}
        });
        $(this.el).append(new actualitiesList.Views.Main({
            className       : "large-8 medium-8 small-8 columns floatLeft",
            notifications   : notif_to_send,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Footer
        $(this.el).append(this.template_footer({model:this.model.toJSON()}));

        return this;
    }
});