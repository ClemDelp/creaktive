////////////////////////////////////////////////////////////
// VIEWS
CKPreviewer.Views.Modal = Backbone.View.extend({
    el:"#CKPreviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.model = new Backbone.Model();
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_content = _.template($('#CKPreviewer_modalContent_templates').html());
        // Events
        this.eventAggregator.on("openModal", this.openModal, this);
    },
    openModal : function(model){
        this.model = model;
        this.render(function(){
            $('#CKPreviewerModal').foundation('reveal', 'open'); 
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
CKPreviewer.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.user               = json.user;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.poche              = json.poche;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#CKPreviewer_knowledgesmap_template').html());
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
CKPreviewer.Views.Categories = Backbone.View.extend({
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
        this.poches.each(function(poche){
            list_of_knowledges = new Backbone.Collection();
            this.knowledges.each(function(knowledge){
                knowledge.get('tags').forEach(function(tag){
                    if(poche.get('title') == tag){list_of_knowledges.add(knowledge);}
                });
            });
            if(list_of_knowledges.length){
            list_view = new CKPreviewer.Views.Category({
                knowledges      : list_of_knowledges,
                poche           : poche,
                poches          : poches,
                user            : user,
                eventAggregator : eventAggregator_
            });
            $(this.el).append(list_view.render().el);}
        });
        notcategorized_view = new CKPreviewer.Views.NotCategorized({
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(notcategorized_view.render().el);

        return this;
    }
});
/***************************************/
CKPreviewer.Views.NotCategorized = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($('#CKPreviewer-notcategorized-template').html());
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
CKPreviewer.Views.KnowledgesMap = Backbone.View.extend({
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
        "click #allknowledges" : "allKnowledges",
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
    allKnowledges : function(){
        this.knowledges_to_render = this.knowledges;
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
        $(this.el).append(_.template($("#CKPreviewer-Khead-template").html()));
        lists_view = new CKPreviewer.Views.Categories({
            id              : "categories_grid",
            className       : "row panel custom_row gridalicious",
            knowledges      : this.knowledges_to_render,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
        $("#categories_grid").gridalicious({
             gutter: 20,
             width: 130
           });
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Slides = Backbone.View.extend({
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
CKPreviewer.Views.MiddlePart = Backbone.View.extend({
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
        if(CKPreviewer.views.conceptsmap){CKPreviewer.views.conceptsmap.remove();}
        CKPreviewer.views.conceptsmap = new CKPreviewer.Views.ConceptsMap({
            className        : "large-7 medium-7 small-7 columns",
            eventAggregator  : this.eventAggregator,
            concepts         : this.concepts
        });
        $(this.el).append(CKPreviewer.views.conceptsmap.render().el);

        // Knowledge map
        if(CKPreviewer.views.knowledgesmap){CKPreviewer.views.knowledgesmap.remove();}
        CKPreviewer.views.knowledgesmap = new CKPreviewer.Views.KnowledgesMap({
            className        : "large-5 medium-5 small-5 columns",
            links            : this.links,
            knowledges       : this.knowledges,
            eventAggregator  : this.eventAggregator,
            poches           : this.poches,
            user             : this.user
        });
        $(this.el).append(CKPreviewer.views.knowledgesmap.render().el);

        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($("#CKPreviewer_action_template").html()); 
    },
    events : {
        "click #select" : "zoom",
    },
    zoom : function(){
      if(!zoomflag){
          $("#select").addClass('disabled');
          zoomflag=true;
         }
         else{
          $("#select").removeClass('disabled');
          zoomflag=false;
        }
    },
    render : function(){
        $(this.el).append(this.template());
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.ConceptsMap = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.concepts = json.concepts;
        // Templates
        this.template = _.template($("#CKPreviewer_conceptsmap_template").html()); 
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
CKPreviewer.Views.Main = Backbone.View.extend({
    el:"#CKPreviewer_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.all_notifications  = json.a_notifications;
        this.links = json.links;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.user = json.user;
        this.mode = "normal";
        // Modals
        if(CKPreviewer.views.modal){CKPreviewer.views.modal.remove();}
        CKPreviewer.views.modal = new CKPreviewer.Views.Modal({
            eventAggregator : this.eventAggregator
        });
    },
    events : {
        "click .fullScreen" : "fullScreen",
    },
    fullScreen : function(e){
        e.preventDefault();
        if(this.mode == "normal"){
            this.mode = "fullScreen";
        }else{
            this.mode = "normal";
        }
        
        this.render();
    },
    render : function(){
        $(this.el).empty();
        if(this.mode == "fullScreen"){
            if(CKPreviewer.views.middle_part_view){CKPreviewer.views.middle_part_view.remove();}
            CKPreviewer.views.middle_part_view = new CKPreviewer.Views.MiddlePart({
                className        : "panel large-12 medium-12 small-12 columns",
                knowledges : this.knowledges,
                concepts : this.concepts,
                links : this.links,
                eventAggregator  : this.eventAggregator,
                poches : this.poches,
                user : this.user
            });
            $(this.el).append(CKPreviewer.views.middle_part_view.render().el);
        }else{
        // Action
        if(CKPreviewer.views.actions_view){CKPreviewer.views.actions_view.remove();}
        CKPreviewer.views.actions_view = new CKPreviewer.Views.Actions({
            className        : "large-1 medium-1 small-1 columns",
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKPreviewer.views.actions_view.render().el);

        // Middle part
        if(CKPreviewer.views.middle_part_view){CKPreviewer.views.middle_part_view.remove();}
        CKPreviewer.views.middle_part_view = new CKPreviewer.Views.MiddlePart({
            className        : "panel large-10 medium-10 small-10 columns",
            knowledges : this.knowledges,
            concepts : this.concepts,
            links : this.links,
            eventAggregator  : this.eventAggregator,
            poches : this.poches,
            user : this.user
        });
        $(this.el).append(CKPreviewer.views.middle_part_view.render().el);

        // Slides
        if(CKPreviewer.views.slides_view){CKPreviewer.views.slides_view.remove();}
        CKPreviewer.views.slides_view = new CKPreviewer.Views.Slides({
            className        : "large-1 medium-1 small-1 columns",
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKPreviewer.views.slides_view.render().el);
        }

        // Get Map and generate it
        MM.App.init(this.eventAggregator);
        socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));
        });
        
         $("#categories_grid").gridalicious({
             gutter: 20,
             width: 130
           });

        $(document).foundation();
    }
});
/***************************************/









