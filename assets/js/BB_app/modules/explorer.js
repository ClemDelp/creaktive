/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
explorer.Models.Filter = Backbone.Model.extend({
    defaults : {
        id : "",
        type : "",
        model : ""
    },
    initialize : function Poche() {
        //console.log('Filter explorer Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/***************************************/
explorer.Collections.Filters = Backbone.Collection.extend({
    model : explorer.Models.Filter,
    initialize : function() {
        //console.log('Filters explorer collection Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/////////////////////////////////////////
// Right part
/////////////////////////////////////////
explorer.Views.PochesList = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu poches part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.poches_render = this.poches;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('poche_search', this.pocheSearch, this);
        // Templates
        this.template = _.template($('#explorer-poche-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    pocheSearch: function(matched_poches){
        this.poches_render = matched_poches;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_poches_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.poches_render.each(function(poche_){
            knowledges.each(function(k){
                k.get('tags').forEach(function(tag){
                    if(tag == poche_.get('title')){total_connections+=1;}
                });
            });  
        });
        // For each poche
        this.poches_render.each(function(poche_){
            // Get the recurrence
            recurrence = 0;
            knowledges.each(function(k){
                k.get('tags').forEach(function(tag){
                    if(tag == poche_.get('title')){recurrence+=1;}
                });
            });
            if((recurrence == 0)&&(total_connections == 0)){percentage = 0;}else{percentage = (recurrence*100)/total_connections;}
            var renderedContent = template({poche:poche_.toJSON(),rec:recurrence,per:percentage});
            $(el_poches_part).append(renderedContent);
        });

        return this;
    }
});
/***************************************/
explorer.Views.PochesPart = Backbone.View.extend({
    className:"large-2 medium-2 small-2 columns",
    initialize : function(json) {
        _.bindAll(this, 'render','search');
        // Variables
        this.poches = json.poches;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.poches.bind("add",this.render);
        this.poches.bind("remove",this.render);
        this.poches.bind("change",this.render);
        // Templates
        this.template_search = _.template($('#explorer-search-template').html());
    },
    events : {
        "keyup .search" : "search",
        "click .add" : "addPoche",
        "click .removePoche" : "removePoche",
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.poches.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('poche_search',matched);
    },
    removePoche: function(e){
        var poche = this.poches.get(e.target.getAttribute('data-id-poche'));
        poche.destroy();
    },
    addPoche : function(e){
        global.models.newP = new global.Models.Poche({
            id: guid(),
            title: $("#explorer_newP").val(),
            user : "clem",
            color : "#FF0000",
            description : $("#explorer_newP_description").val(),
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"Categories"}));
        // Poche list
        poches_list_view = new explorer.Views.PochesList({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_list_view.render().el);
        
        return this;
    }
});
/////////////////////////////////////////
// Middle part
/////////////////////////////////////////
explorer.Views.Comments = Backbone.View.extend({
    className : "row",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.comments = json.comments;
        this.eventAggregator = json.eventAggregator;
        this.template_comments_list = _.template($('#explorer-comments-list-template').html());
        this.template_new_comment = _.template($('#explorer-new-comment-template').html());
    },
    events : {},
    render : function(){
        $(this.el).html('');
        // comments list
        $(this.el).append(this.template_comments_list({comments : this.comments.toJSON()}));
        // new comment
        $(this.el).append(this.template_new_comment());

        return this;
    }
});
/////////////////////////////////////////
explorer.Views.Knowledge = Backbone.View.extend({
    tagName: "div",
    className: "panel small-12 medium-12 large-12",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.knowledge = json.knowledge;
        this.eventAggregator = json.eventAggregator;
        this.template_knowledge_content = _.template($('#explorer-knowledge-content-template').html());
    },
    events : {},
    render : function(){
        $(this.el).html('');
        // content
        $(this.el).append(this.template_knowledge_content({knowledge : this.knowledge.toJSON()}));
        // comments part
        $(this.el).append(new explorer.Views.Comments({
            comments : this.knowledge.get('comments'),
            eventAggregator : this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
explorer.Views.Knowledges = Backbone.View.extend({
    initialize: function(json){
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('knowledge_search', this.knowledge_search, this);
        this.eventAggregator.on("kColorChanged", this.render)
        this.eventAggregator.on("kTitleChanged", this.render)
    },
    knowledge_search: function(matched_knowledges){
        this.knowledges_render = matched_knowledges;
        this.render();
    },
    events : {

    },
    render : function(){
        _this = this;
        $(this.el).html('');
        this.knowledges_render.each(function(_knowledge){
            $(_this.el).append(new explorer.Views.Knowledge({
                knowledge : _knowledge,
                eventAggregator : _this.eventAggregator
            }).render().el);
        });
        return this;
    }

});
/////////////////////////////////////////
explorer.Views.KnowledgesList = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu knwoledges liste view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        this.style = json.style;
        // Events
        this.eventAggregator.on('knowledge_search', this.knowledge_search, this);
        this.eventAggregator.on("kColorChanged", this.render)
        this.eventAggregator.on("kTitleChanged", this.render)
        // Templates
        this.template_knowledge = _.template($('#explorer-knowledges-template').html());
    },
    knowledge_search: function(matched_knowledges){
        this.knowledges_render = matched_knowledges;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        // For each knowledge
        var renderedContent = this.template_knowledge({
            knowledges:this.knowledges_render.toJSON(),
            user:this.user,
            style:this.style
        });
        $(this.el).append(renderedContent);

        return this;
    }
});
/***************************************/
explorer.Views.MiddlePart = Backbone.View.extend({
    className: "small-8 medium-8 large-8 columns",
    initialize : function(json) {
        //console.log("Right part of explorer view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.filters = json.filters;
        this.user = json.user;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        this.style=json.style;
        // Template
        this.template_context = _.template($('#explorer-context-template').html());

    },
    events : {
        "click .openModal" : "open_modal_details_box",
        "keyup .search" : "search",
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.knowledges.each(function(k){
            if(research.toLowerCase() == k.get('title').substr(0,research_size).toLowerCase()){
                matched.add(k);
            }
        });
        this.eventAggregator.trigger('knowledge_search',matched);
    },
    open_modal_details_box :function(e){
        this.eventAggregator.trigger("kSelected", e.target.getAttribute("data-id-knowledge"))
    },
    render : function(){
        $(this.el).html('');
        // Input 
        $(this.el).append(this.template_context({filters:this.filters.toJSON()}));
        // knowledge list
        knowledge_list_view = new explorer.Views.KnowledgesList({
            knowledges:this.knowledges,
            user:this.user,
            eventAggregator:this.eventAggregator,
            style:this.style
        });
        $(this.el).append(knowledge_list_view.render().el);
        // Knowledges timeline
        $(this.el).append(new explorer.Views.Knowledges({
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Experts content part
/////////////////////////////////////////
explorer.Views.ExpertsList = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu experts liste view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.experts = json.experts;
        this.experts_render = this.experts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('expert_search', this.expertSearch, this);
        // Templates
        this.template = _.template($('#explorer-expert-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    expertSearch: function(matched_experts){
        this.experts_render = matched_experts;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_experts_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.experts_render.each(function(expert){
            knowledges.each(function(k){
                if(k.get('user').id == expert.get('id')){total_connections+=1;}
            });  
        });
        // For each expert
        this.experts_render.each(function(expert_){
            // Get the recurrence
            recurrence = 0;
            knowledges.each(function(k){
                if(k.get('user').id == expert_.get('id')){recurrence+=1;}
            });
            if((recurrence == 0)&&(total_connections == 0)){percentage = 0;}else{percentage = (recurrence*100)/total_connections;}
            var renderedContent = template({expert:expert_.toJSON(),rec:recurrence,per:percentage});
            $(el_experts_part).append(renderedContent);
        });

        return this;
    }
});
/***************************************/
explorer.Views.ExpertsPart = Backbone.View.extend({
    className:"content",
    initialize : function(json) {
        _.bindAll(this, 'render','search');
        // Variables
        this.experts = json.experts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Template
        this.template_search = _.template($('#explorer-search-template').html());
        // Style
        $(this.el).attr('id',json.idAcc);
    },
    events : {
        "keyup .search" : "search",
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.experts.each(function(c){
            if(research.toLowerCase() == c.get('name').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('expert_search',matched);
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"Experts"}));
        // Poche list
        experts_list_view = new explorer.Views.ExpertsList({
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(experts_list_view.render().el);
        
        return this;
    }
});
/***************************************/
explorer.Views.ddExperts = Backbone.View.extend({
    tagName:"dd",
    initialize:function(json){
        _.bindAll(this, 'render');
        // Variables
        this.experts = json.experts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_accrodion_hearder = _.template($('#explorer-accordion-header-template').html());
    },
    render:function(){
        $(this.el).html('');
        $(this.el).append(this.template_accrodion_hearder({title:"Authors",idAcc:"authors_acc"}));
        // Accordion Concepts part content
        $(this.el).append(new explorer.Views.ExpertsPart({
            idAcc : "authors_acc",
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Concept content part
/////////////////////////////////////////
explorer.Views.ConceptList = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu concept part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.concepts = json.concepts;
        this.concepts_render = this.concepts;
        this.eventAggregator = json.eventAggregator;
        this.knowledges = json.knowledges;
        this.links = json.links;
        // Events
        this.eventAggregator.on('concept_search', this.conceptSearch, this);
        // Templates
        this.template = _.template($('#explorer-concept-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    conceptSearch: function(matched_concepts){
        this.concepts_render = matched_concepts;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_concepts_part=this.el;
        template = this.template;
        links = this.links;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.concepts_render.each(function(concept_){
            // Get the recurrence
            knowledges.each(function(k){
                links.filter(function(link){
                    if((link.get('concept') == concept_.get('id'))&&(link.get('knowledge') == k.get('id'))){
                        total_connections+=1;return false;
                    }
                    else{return false;}   
                });  
            });
        });
        // For each concept
        this.concepts_render.each(function(concept_){
            // Get the recurrence
            recurrence = 0;
            knowledges.each(function(k){
                links.filter(function(link){
                    if((link.get('concept') == concept_.get('id'))&&(link.get('knowledge') == k.get('id'))){
                        recurrence+=1;return false;
                    }
                    else{return false;}   
                });  
            });
            if((recurrence == 0)&&(total_connections == 0)){percentage = 0;}else{percentage = (recurrence*100)/total_connections;}
            var renderedContent = template({concept:concept_.toJSON(),rec : recurrence,per : percentage});
            $(el_concepts_part).append(renderedContent);
        });
        return this;
    }
});
/***************************************/
explorer.Views.ConceptsPart = Backbone.View.extend({
    className:"content",
    initialize : function(json) {
        _.bindAll(this, 'render', 'search');
        // Variables
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.concepts.bind("add",this.render);
        this.concepts.bind("remove",this.render);
        this.concepts.bind("change",this.render);
        // Template
        this.template_search = _.template($('#explorer-search-template').html());
        // Style
        $(this.el).attr('id',json.idAcc);
    },
    events : {
        "keyup .search" : "search"
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.concepts.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('concept_search',matched);
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_concepts_part=this.el;
        template = this.template;
        links = this.links;
        knowledges = this.knowledges;
        // Input search
        $(this.el).append(this.template_search({title:"Concepts"}));
        // Concepts list
        concept_list_view = new explorer.Views.ConceptList({
            concepts:this.concepts,
            eventAggregator:this.eventAggregator,
            knowledges:this.knowledges,
            links:this.links
        });
        $(this.el).append(concept_list_view.render().el);
        
        
        return this;
    }
});
/***************************************/
explorer.Views.ddConcepts = Backbone.View.extend({
    tagName:"dd",
    initialize:function(json){
        _.bindAll(this, 'render');
        // Variables
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_accrodion_hearder = _.template($('#explorer-accordion-header-template').html());
    },
    render:function(){
        $(this.el).html('');
        $(this.el).append(this.template_accrodion_hearder({title:"Concepts",idAcc:"concepts_acc"}));
        // Accordion Concepts part content
        $(this.el).append(new explorer.Views.ConceptsPart({
            idAcc : "concepts_acc",
            concepts:this.concepts,
            knowledges:this.knowledges,
            links:this.links,
            eventAggregator:this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Projects content part
/////////////////////////////////////////
explorer.Views.ProjectList = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects;
        this.projects_render = this.projects;
        this.eventAggregator = json.eventAggregator;
        this.knowledges = json.knowledges;
        // Events
        this.eventAggregator.on('project_search', this.projectSearch, this);
        // Templates
        this.template = _.template($('#explorer-project-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    projectSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_projects_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.projects_render.each(function(project_){
            // Get the recurrence
            knowledges.each(function(k){
                    if(k.get('project') == project_.get('id')){
                        total_connections+=1;return false;
                    }
                    else{return false;}   
            });
        });
        // For each concept
        this.projects_render.each(function(project_){
            // Get the recurrence
            recurrence = 0;
            knowledges.each(function(k){
                if(k.get('project') == project_.get('id')){
                        recurrence+=1;return false;
                    }
                    else{return false;}   
            });
            if((recurrence == 0)&&(total_connections == 0)){percentage = 0;}else{percentage = (recurrence*100)/total_connections;}
            var renderedContent = template({project:project_.toJSON(),rec : recurrence,per : percentage});
            $(el_projects_part).append(renderedContent);
        });
        return this;
    }
});
/***************************************/
explorer.Views.ProjectsPart = Backbone.View.extend({
    className:"content",
    initialize : function(json) {
        _.bindAll(this, 'render','search');
        // Variables
        this.projects = json.projects; 
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.projects.bind("add",this.render);
        this.projects.bind("remove",this.render);
        this.projects.bind("change",this.render);
        // Template
        this.template_search = _.template($('#explorer-search-template').html());
        // Style
        $(this.el).attr('id',json.idAcc);
    },
    events : {
        "keyup .search" : "search"
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.projects.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('project_search',matched);
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_projects_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Input search
        $(this.el).append(this.template_search({title:"Projects"}));
        // Concepts list
        project_list_view = new explorer.Views.ProjectList({
            projects:this.projects,
            eventAggregator:this.eventAggregator,
            knowledges:this.knowledges,
        });
        $(this.el).append(project_list_view.render().el);
        
        return this;
    }
});
/***************************************/
explorer.Views.ddProjects = Backbone.View.extend({
    tagName:"dd",
    initialize:function(json){
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects; 
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_accrodion_hearder = _.template($('#explorer-accordion-header-template').html());
    },
    render:function(){
        $(this.el).html('');
        $(this.el).append(this.template_accrodion_hearder({title:"Projects",idAcc:"projects_acc"}));
        // Accordion Projects part content
        $(this.el).append(new explorer.Views.ProjectsPart({
            idAcc : "projects_acc",
            projects:this.projects,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Left Part
/////////////////////////////////////////
explorer.Views.LeftPart = Backbone.View.extend({
    tagName:'dl',
    className: "accordion show-for-medium-up medium-2 large-2 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.poches             = json.poches;
        this.experts            = json.experts;
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;    
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        // Style
        $(this.el).attr('data-accordion','');
        // Templates
        this.template_states = _.template($('#explorer-states-template').html());
    },
    render : function(){
        $(this.el).html('');
        // States
        $(this.el).append(this.template_states());
        // Projects dd part 
        // $(this.el).append(new explorer.Views.ddProjects({
        //     projects:this.projects,
        //     knowledges:this.knowledges,
        //     eventAggregator:this.eventAggregator
        // }).render().el);
        // Concepts dd part
        $(this.el).append(new explorer.Views.ddConcepts({
            concepts:this.concepts,
            knowledges:this.knowledges,
            links:this.links,
            eventAggregator:this.eventAggregator
        }).render().el);
        // Authors dd part
        $(this.el).append(new explorer.Views.ddExperts({
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
explorer.Views.Main = Backbone.View.extend({
    el:"#explorer_container",
    initialize : function(json) {
        //console.log("Main explorer view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.experts            = json.experts;
        this.poches             = json.poches;
        this.links              = json.links;
        this.user               = json.user;
        this.filters            = new explorer.Collections.Filters();
        this.eventAggregator    = json.eventAggregator;
        this.style              = json.style;

        // Events
        this.links.bind("reset", this.render);
        this.links.bind('add', this.render);
        this.links.bind('remove', this.render);
        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);
        this.eventAggregator.on("Ktagged", this.render);
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        // "click .list" : "putInList",
        // "click .grid" : "putInGrid",
        "click .addFilter" : "addFilter",
        "click .remove" : "removeFilter",
    },
    removeFilter: function(e){
        e.preventDefault();
        this.filters.remove(this.filters.get(e.target.getAttribute('data-id-filter')));
    },
    addFilter: function(e){
        e.preventDefault();
        model_ = "";
        if(e.target.getAttribute("data-filter-type") == "expert"){model_ = this.experts.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "poche"){model_ = this.poches.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "project"){ model_ = this.projects.get(e.target.getAttribute("data-filter-model")); }
        else if(e.target.getAttribute("data-filter-type") == "concept"){ model_ = this.concepts.get(e.target.getAttribute("data-filter-model")); }
        else if(e.target.getAttribute("data-filter-type") == "state"){ model_ = e.target.getAttribute("data-filter-model"); }
        else if(e.target.getAttribute("data-filter-type") == "notLinked"){ model_ = "notLinked"; }
        else if(e.target.getAttribute("data-filter-type") == "notCategorised"){ model_ = "notCategorised"; }
        if(model_ != ""){
            new_filter = new explorer.Models.Filter({
                id:guid(),//e.target.getAttribute("data-filter-id"),
                type:e.target.getAttribute("data-filter-type"),
                model:model_
            });
            console.log("new filter: ",new_filter);
            this.filters.add(new_filter);
            console.log("filters: ",this.filters);
        }
    },
    // putInList: function(e){
    //     this.style = "list";
    //     this.render();
    // },
    // putInGrid: function(e){
    //     this.style = "grid";
    //     this.render();
    // },
    addKnowledge : function(e){
        // Init
        user_ = this.user;
        // Get the context
        var poches = [];
        var concepts = [];
        this.filters.each(function(f){
            if(f.get('type') == "concept"){concepts.unshift(f.get('model'));}
            else if(f.get('type') == "poche"){poches.unshift(f.get('model').get('title'));}
        });
        // Create the knowledge (sign with poche if poches are in context)
        newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
            title : $('#explorer_new_k_title').val(),
            //content : CKEDITOR.instances.new_k_content.getData(),
            tags: poches,
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        // For each concept create cklinks (if concepts are in context)
        if(concepts.length > 0){
            concepts.forEach(function(concept){
                global.models.newLink = new global.Models.CKLink({
                    id :guid(),
                    user : user_,
                    date : getDate(),
                    concept : concept.get('id'),
                    knowledge : newK.get('id')
                });
                // Save the new link and add it to links collection
                global.models.newLink.save();
                this.links.add([global.models.newLink]);
            });
        }
        // Save the new knowledge
        newK.save();
        this.knowledges.add(newK);
        this.render();

    },
    ///////////////////////////////////////////////////////
    // Session quenelle power
    ///////////////////////////////////////////////////////
    quenelle: function(){
        knowledges_q = new global.Collections.Knowledges();
        this.knowledges.each(function(k){knowledges_q.add(k)})
        filters = this.filters;
        links = this.links;
        v = this;
        filters.each(function(f){
            if(f.get('type') == "concept"){        knowledges_q = v.filterByConcept(knowledges_q,links,f);}
            if(f.get('type') == "project"){        knowledges_q = v.filterByProject(knowledges_q,f);}
            if(f.get('type') == "poche"){          knowledges_q = v.filterByPoche(knowledges_q,links,f);}
            if(f.get('type') == "expert"){         knowledges_q = v.filterByExpert(knowledges_q,links,f);}
            if(f.get('type') == "state"){          knowledges_q = v.filterByState(knowledges_q,links,f);}
            if(f.get('type') == "notLinked"){      knowledges_q = v.filterByNotLinked(knowledges_q,links,f);}
            if(f.get('type') == "notCategorised"){ knowledges_q = v.filterByNotCategorised(knowledges_q,links,f);}
        });
        return knowledges_q;
    },
    filterByNotLinked : function(knowledges,links,f){
        list_to_remove = [];
        knowledges.each(function(k){
            links.filter(function(link){
                if(link.get('knowledge') == k.get('id')){
                    list_to_remove.unshift(k);
                }
            });  
        }); 
        list_to_remove.forEach(function(k){
            knowledges.remove(k);
        }); 
        return knowledges;
    },
    filterByNotCategorised : function(knowledges,links,f){
        list_to_remove = [];
        knowledges.each(function(k){
            if(k.get('tags').length > 0){
                list_to_remove.unshift(k);
            }   
        });
        list_to_remove.forEach(function(k){
            knowledges.remove(k);
        });
        return knowledges;
    },
    filterByProject : function(knowledges,f){
        ks_filtered = new global.Collections.Knowledges();
        knowledges.each(function(k){
            if(k.get('project') == f.get('model').get('id')){
                ks_filtered.add(k);return false;
            }
            else{return false;}    
        });  
        return ks_filtered;
    },
    filterByConcept : function(knowledges,links,f){
        ks_filtered = new global.Collections.Knowledges();
        knowledges.each(function(k){
            links.filter(function(link){
                if((link.get('concept') == f.get('model').get('id'))&&(link.get('knowledge') == k.get('id'))){
                    ks_filtered.add(k);return false;
                }
                else{return false;}   
            });  
        });  
        return ks_filtered;
    },
    filterByPoche : function(knowledges,links,f){
        ks_filtered = new global.Collections.Knowledges();
        knowledges.each(function(k){
            b = k.get('tags').forEach(function(tag){
                if(tag == f.get('model').get('title')){
                    ks_filtered.add(k);
                    return false;
                }
            });
            if(b == false){return false;}   
        });
        return ks_filtered;
    },
    filterByExpert : function(knowledges,links,f){
        ks_filtered = new global.Collections.Knowledges();
        knowledges.each(function(k){
            if(k.get('user').id == f.get('model').get('id')){
                ks_filtered.add(k);
                return false;
            }
        });
        return ks_filtered;
    },
    filterByState : function(knowledges,links,f){
        ks_filtered = new global.Collections.Knowledges();
        knowledges.each(function(k){
            if(k.get('color') == f.get('model')){
                ks_filtered.add(k);
                return false;
            } 
        });
        return ks_filtered;
    },
    ///////////////////////////////////////////////////////
    render : function(){
        $(this.el).html('');
        if(this.filters.length == 0){
            ks=this.knowledges;
        }else{
            ks = this.quenelle();
        }
        // Left part
        $(this.el).append(new explorer.Views.LeftPart({
            poches              :this.poches,
            experts             :this.experts,
            projects            :this.projects,
            concepts            :this.concepts,
            knowledges          :ks,
            links               :this.links,
            eventAggregator     :this.eventAggregator
        }).render().el);
        // middle part
        $(this.el).append(new explorer.Views.MiddlePart({
            knowledges:ks,
            filters:this.filters,
            user:this.user,
            links:this.links,
            eventAggregator:this.eventAggregator,
            style:this.style
        }).render().el);
        // Right part
        $(this.el).append(new explorer.Views.PochesPart({
            poches : this.poches,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        }).render().el);

        $(document).foundation();
        return this;
    }
});
/***************************************/
