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
CKViewer.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.user               = json.user;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.poche              = json.poche;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#CKViewer_knowledgesmap_template').html());
    },
    render:function(){
        $(this.el).html('');
        _this = this;
        // Category template
        $(this.el).html(this.template_list({
            knowledges : this.knowledges.toJSON(), 
            category : this.poche.toJSON(),
            categories : this.poches.toJSON()
        }));
        return this;
    }
});
/***************************************/
CKViewer.Views.Categories = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
    },

    render:function(){
        $(this.el).html('');
        //init
        knowledges = this.knowledges;
        user = this.user;
        poches = this.poches;
        el = this.el;
        eventAggregator_ = this.eventAggregator;
        // For each poches
        notcategorized_view = new CKViewer.Views.NotCategorized({
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(notcategorized_view.render().el);
        
        this.poches.each(function(poche){
            list_of_knowledges = new Backbone.Collection();
            this.knowledges.each(function(knowledge){
                knowledge.get('tags').forEach(function(tag){
                    if(poche.get('title') == tag){list_of_knowledges.add(knowledge);}
                });
            });
            if(list_of_knowledges.length){
            list_view = new CKViewer.Views.Category({
                knowledges      : list_of_knowledges,
                poche           : poche,
                poches          : poches,
                user            : user,
                eventAggregator : eventAggregator_
            });
            $(this.el).append(list_view.render().el);}
        });
        
        

        return this;
    }
});
/***************************************/
CKViewer.Views.NotCategorized = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($('#CKViewer-notcategorized-template').html());
    },

    render : function(){
        // Init
        $(this.el).html('');
        el_notcategorized_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // For each poche
         this.knowledges_render.each(function(knowledge_){
             if(knowledge_.get('tags').length == 0){
                 $(el_notcategorized_part).append(template({
                     knowledge : knowledge_.toJSON(),
                 }));
             }
         });
        return this;
    }
});
/***************************************/
CKViewer.Views.KnowledgesMap = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.links = json.links;
        this.knowledges = json.knowledges;
        this.knowledges_to_render = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.user = json.user;
        // Templates
        this.eventAggregator.on("selectK",this.filterKnowledge,this);
    },
    events : {
        "dblclick .openModal" : "openModal",
        "click #allknowledges" : "allknowledges"
    },
    filterKnowledge : function(concept_id){
        _this = this;
        var links= _.filter(this.links.toJSON(), function(model){
             return model.concept==concept_id;
        });
        var klinks = new Backbone.Collection;
        _.each(links, function(model){
            k1 = _this.knowledges.get(model.knowledge);
            klinks.add(k1);
        });
        this.knowledges_to_render=klinks;
        this.render();
    },
    allknowledges : function(){
        this.knowledges_to_render=this.knowledges;
        this.render();
    },
    openModal : function(e){
        e.preventDefault();
        knowledge = this.knowledges.get(e.target.getAttribute("data-knowledge-id"));
        if(!knowledge){knowledge = this.poches.get(e.target.getAttribute("data-category-id"));}
        this.eventAggregator.trigger("openModal",knowledge);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(_.template($("#CKViewer-Khead-template").html()));
        lists_view = new CKViewer.Views.Categories({
            id              : "categories_grid",
            className       : "row  custom_row gridalicious",
            knowledges      : this.knowledges_to_render,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
        $("#categories_grid").gridalicious({
             gutter: 20,
             width: 200
           });
        return this;
    }
});
/////////////////////////////////////////

/////////////////////////////////////////
CKViewer.Views.MiddlePart = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;  
        this.poches = json.poches;
        this.user = json.user;
    },
    render : function(){
        // Concepts map
        if(CKViewer.views.conceptsmap){CKViewer.views.conceptsmap.remove();}
        CKViewer.views.conceptsmap = new CKViewer.Views.ConceptsMap({
            className        : "large-6 medium-6 small-6 columns",
            eventAggregator  : this.eventAggregator,
            concepts         : this.concepts
        });
        $(this.el).append(CKViewer.views.conceptsmap.render().el);

        // Knowledge map
        if(CKViewer.views.knowledgesmap){CKViewer.views.knowledgesmap.remove();}
        CKViewer.views.knowledgesmap = new CKViewer.Views.KnowledgesMap({
            className        : "large-6 medium-6 small-6 columns",
            links            : this.links,
            knowledges       : this.knowledges,
            eventAggregator  : this.eventAggregator,
            poches           : this.poches,
            user             : this.user
        });
        $(this.el).append(CKViewer.views.knowledgesmap.render().el);

        return this;
    }
});
/////////////////////////////////////////

/////////////////////////////////////////
CKViewer.Views.ConceptsMap = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.concepts = json.concepts;
        // Templates
        this.template = _.template($("#CKViewer_conceptsmap_template").html()); 
    },
    events : {
        "dblclick .text" : "openModal",
        "click .text" : "select",
    },
    select : function(e){
        e.preventDefault();
        this.eventAggregator.trigger("selectK",e.target.getAttribute("id_c"));
    },
    openModal : function(e){
        e.preventDefault();
        concept = this.concepts.get(e.target.getAttribute("id_c"));
        this.eventAggregator.trigger("openModal",concept);
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
        this.project  = json.project;
        this.all_notifications  = json.a_notifications;
        this.links = json.links;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.user = json.user;
        // Modals
        if(CKViewer.views.modal){CKViewer.views.modal.remove();}
            CKViewer.views.modal = new CKViewer.Views.Modal({
            eventAggregator : this.eventAggregator
        });
    },

    render : function(){
        $(this.el).empty();
        // Middle part
        if(CKViewer.views.middle_part_view){CKViewer.views.middle_part_view.remove();}
        CKViewer.views.middle_part_view = new CKViewer.Views.MiddlePart({
            className        : "panel large-12 medium-12 small-12 columns",
            knowledges : this.knowledges,
            concepts : this.concepts,
            links : this.links,
            eventAggregator  : this.eventAggregator,
            poches : this.poches,
            user : this.user
        });
        //$(this.el).append(_.template($("#CKViewer_title_template").html()));
        $(this.el).append(CKViewer.views.middle_part_view.render().el);

        // Get Map and generate it
        MM.App.init(this.eventAggregator);
        socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));
        });
        
         $("#categories_grid").gridalicious({
             gutter: 20,
             width: 200
           });

        $(document).foundation();
    }
});
/***************************************/









