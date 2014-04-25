////////////////////////////////////////////////////////////
// VIEWS
CKViewer.Views.Modal = Backbone.View.extend({
    el:"#ckviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.model = new Backbone.Model();
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_content = _.template($('#CKViewer_modalContent_templates').html());
        // Events
        this.eventAggregator.on("openModal", this.openModal, this);
    },
    openModal : function(model){
        this.model = model;
        this.render(function(){
            $('#ckviewerModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html(''); 
        $(this.el).append(this.template_content({
            knowledge : this.model.toJSON()
        }));
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
CKViewer.Views.KnowledgesMap = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.links = json.links;
        this.knowledges = json.knowledges;
        this.knowledges_to_render = this.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_knowledgesList = _.template($('#CKViewer_knowledgesmap_template').html());
        this.eventAggregator.on("selectK",this.filterKnowledge);
    },
    events : {
        "click .openModal" : "openModal",
        "click .allKnowledges" : "allKnowledges",
    },
    filterKnowledge : function(concept_id){
        _this = this;
        this.knowledges_to_render.reset();
        var links= _.filter(this.links.toJSON(), function(model){
             return model.concept==idc;
        });
        _.each(links, function(model){
            k1 = _this.knowledges.get(model.knowledge);
            _this.knowledges_to_render.add(k1);
        });
        this.render();
    },
    allKnowledges : function(){
        this.knowledges_to_render = this.knowledges;
        this.render();
    },
    openModal : function(e){
        e.preventDefault();

        knowledge = this.knowledges.get(e.target.getAttribute("data-id-knowledge"));
        this.eventAggregator.trigger("openModal",knowledge);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template_knowledgesList({
            knowledges : this.knowledges_to_render.toJSON()
        }));

        return this;
    }
});
/////////////////////////////////////////
CKViewer.Views.Slides = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        // Templates
        
    },
    events : {
        
    },
    render : function(){
        return this;
    }
});
/////////////////////////////////////////
CKViewer.Views.MiddlePart = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;  
    },
    render : function(){
        // Concepts map
        if(CKViewer.views.conceptsmap){CKViewer.views.conceptsmap.remove();}
        CKViewer.views.conceptsmap = new CKViewer.Views.ConceptsMap({
            className        : "large-7 medium-7 small-7 columns",
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.conceptsmap.render().el);

        // Knowledge map
        if(CKViewer.views.knowledgesmap){CKViewer.views.knowledgesmap.remove();}
        CKViewer.views.knowledgesmap = new CKViewer.Views.KnowledgesMap({
            className        : "large-5 medium-5 small-5 columns",
            links            : this.links,
            knowledges       : this.knowledges,
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.knowledgesmap.render().el);

        return this;
    }
});
/////////////////////////////////////////
CKViewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($("#CKViewer_action_template").html()); 
    },
    events : {
        
    },
    render : function(){
        $(this.el).append(this.template());
        return this;
    }
});
/////////////////////////////////////////
CKViewer.Views.ConceptsMap = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($("#CKViewer_conceptsmap_template").html()); 
    },
    events : {
        "dblclick #map" : "zoomer",
        "click .text" : "select",
    },
    select : function(e){
        e.preventDefault();
        this.eventAggregator.trigger("selectK",e.target.getAttribute("id_c"));
    },
    zoomer : function(e){
        e.preventDefault();
                zoom.to({ element: e.target });
    },
    render : function(){
        $(this.el).append(this.template());
        return this;
    }
});
/////////////////////////////////////////
// MAIN
/////////////////////////////////////////
CKViewer.Views.Main = Backbone.View.extend({
    el:"#ckviewer_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.links = json.links;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Modals
        if(CKViewer.views.modal){CKViewer.views.modal.remove();}
        CKViewer.views.modal = new CKViewer.Views.Modal({
            eventAggregator : this.eventAggregator
        });
    },
    render : function(){
        // Action
        if(CKViewer.views.actions_view){CKViewer.views.actions_view.remove();}
        CKViewer.views.actions_view = new CKViewer.Views.Actions({
            className        : "large-1 medium-1 small-1 columns",
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.actions_view.render().el);

        // Middle part
        if(CKViewer.views.middle_part_view){CKViewer.views.middle_part_view.remove();}
        CKViewer.views.middle_part_view = new CKViewer.Views.MiddlePart({
            className        : "panel large-10 medium-10 small-10 columns",
            knowledges : this.knowledges,
            concepts : this.concepts,
            links : this.links,
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.middle_part_view.render().el);

        // Slides
        if(CKViewer.views.slides_view){CKViewer.views.slides_view.remove();}
        CKViewer.views.slides_view = new CKViewer.Views.Slides({
            className        : "large-1 medium-1 small-1 columns",
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.slides_view.render().el);

        // Get Map and generate it
        MM.App.init(this.eventAggregator);
        socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));
        });
        
        $(document).foundation();
    }
});
/***************************************/









