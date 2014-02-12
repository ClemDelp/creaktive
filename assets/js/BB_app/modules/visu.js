/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
visu.Models.Filter = Backbone.Model.extend({
    defaults : {
        id : "",
        type : "",
        model : ""
    },
    initialize : function Poche() {
        //console.log('Filter visu Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/***************************************/
visu.Collections.Filters = Backbone.Collection.extend({
    model : visu.Models.Filter,
    initialize : function() {
        //console.log('Filters visu collection Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/////////////////////////////////////////
// Middle part
/////////////////////////////////////////
visu.Views.KnowledgesList = Backbone.View.extend({
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
        this.template_knowledge = _.template($('#visu-knowledges-template').html());
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
visu.Views.MiddlePart = Backbone.View.extend({
    tagName: "div",
    className: "small-12 medium-6 large-8 columns",
    initialize : function(json) {
        //console.log("Right part of visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.filters = json.filters;
        this.user = json.user;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        this.style=json.style;
        // Template
        this.template_context = _.template($('#visu-publish-module-template').html());

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
        //alert(e.target.getAttribute("data-id-knowledge"))
        this.eventAggregator.trigger("kSelected", e.target.getAttribute("data-id-knowledge"))
    },
    render : function(){
        $(this.el).html('');
        // Input 
        $(this.el).append(this.template_context({filters:this.filters.toJSON()}));
        // knowledge list
        knowledge_list_view = new visu.Views.KnowledgesList({
            knowledges:this.knowledges,
            user:this.user,
            eventAggregator:this.eventAggregator,
            style:this.style
        });
        $(this.el).append(knowledge_list_view.render().el);
        
        return this;
    }
});
/////////////////////////////////////////
// Right part
/////////////////////////////////////////
visu.Views.ExpertsList = Backbone.View.extend({
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
        this.template = _.template($('#visu-expert-template').html());
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
visu.Views.ExpertsPart = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu experts part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.experts = json.experts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Template
        this.template_search = _.template($('#visu-search-template').html());
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
        experts_list_view = new visu.Views.ExpertsList({
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(experts_list_view.render().el);
        
        return this;
    }
});
/***************************************/
visu.Views.PochesList = Backbone.View.extend({
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
        this.template = _.template($('#visu-poche-template').html());
        this.template_new_poche = _.template($('#visu-new-poche-template').html());
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
        // New poche
        $(this.el).append(this.template_new_poche());

        return this;
    }
});
/***************************************/
visu.Views.PochesPart = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu poches part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.poches.bind("add",this.render);
        this.poches.bind("remove",this.render);
        this.poches.bind("change",this.render);
        // Templates
        this.template_search = _.template($('#visu-search-template').html());
        
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
            title: $("#visu_newP").val(),
            user : "clem",
            color : "#FF0000",
            description : $("#visu_newP_description").val(),
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"Poches"}));
        // Poche list
        poches_list_view = new visu.Views.PochesList({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_list_view.render().el);
        
        return this;
    }
});
/***************************************/
visu.Views.RightPart = Backbone.View.extend({
    className: "show-for-medium-up medium-3 large-2 columns",
    initialize : function(json) {
        //console.log("Right part of visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;    
        this.poches = json.poches;
        this.experts = json.experts;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
    },

    render : function(){
        $(this.el).html('');
        // Poches part
        poches_part_view = new visu.Views.PochesPart({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_part_view.render().el);
        // Experts part
        experts_part_view = new visu.Views.ExpertsPart({
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(experts_part_view.render().el);


        return this;
    }
});
/////////////////////////////////////////
// Left part
/////////////////////////////////////////
visu.Views.ConceptList = Backbone.View.extend({
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
        this.template = _.template($('#visu-concept-template').html());
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
visu.Views.ConceptsPart = Backbone.View.extend({
    initialize : function(json) {
        //console.log("Visu concept part view initialise");
        _.bindAll(this, 'render');
        _.bindAll(this, 'search');
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
        this.template_search = _.template($('#visu-search-template').html());
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
        concept_list_view = new visu.Views.ConceptList({
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
visu.Views.ProjectList = Backbone.View.extend({
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
        this.template = _.template($('#visu-project-template').html());
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
visu.Views.ProjectsPart = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        _.bindAll(this, 'search');
        // Variables
        this.projects = json.projects; 
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.projects.bind("add",this.render);
        this.projects.bind("remove",this.render);
        this.projects.bind("change",this.render);
        // Template
        this.template_search = _.template($('#visu-search-template').html());
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
        project_list_view = new visu.Views.ProjectList({
            projects:this.projects,
            eventAggregator:this.eventAggregator,
            knowledges:this.knowledges,
        });
        $(this.el).append(project_list_view.render().el);
        
        return this;
    }
});
/***************************************/
visu.Views.LeftPart = Backbone.View.extend({
    className: "show-for-medium-up medium-3 large-2 columns",
    initialize : function(json) {
        //console.log("Left part of visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;    
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
    },
    render : function(){
        $(this.el).html('');
        // Projects part 
        projects_part_view = new visu.Views.ProjectsPart({
            projects:this.projects,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(projects_part_view.render().el);
        // Concepts part
        concepts_part_view = new visu.Views.ConceptsPart({
            concepts:this.concepts,
            knowledges:this.knowledges,
            links:this.links,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(concepts_part_view.render().el);

        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
visu.Views.Main = Backbone.View.extend({
    el:"#visu_container",
    initialize : function(json) {
        //console.log("Main visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.experts            = json.experts;
        this.poches             = json.poches;
        this.links              = json.links;
        this.user               = json.user;
        this.filters            = new visu.Collections.Filters();
        this.eventAggregator    = json.eventAggregator;
        this.style              = json.style;

        // Events
        this.projects.bind("reset", this.render);
        
        this.concepts.bind("reset", this.render);
        
        this.experts.bind("reset", this.render);

        this.poches.bind("reset", this.render);

        this.links.bind("reset", this.render);
        this.links.bind('add', this.render);
        this.links.bind('remove', this.render);

        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);

        this.knowledges.bind("reset", this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);

        this.eventAggregator.on("Ktagged", this.render);
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "click .list" : "putInList",
        "click .grid" : "putInGrid",
        "click .addFilter" : "addFilter",
        "click .remove" : "removeFilter",
    },
    removeFilter: function(e){
        event.preventDefault();
        this.filters.remove(this.filters.get(e.target.getAttribute('data-id-filter')));
    },
    addFilter: function(e){
        event.preventDefault();
        model_ = "";
        if(e.target.getAttribute("data-filter-type") == "expert"){model_ = this.experts.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "poche"){model_ = this.poches.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "project"){ model_ = this.projects.get(e.target.getAttribute("data-filter-model")); }
        else if(e.target.getAttribute("data-filter-type") == "concept"){ model_ = this.concepts.get(e.target.getAttribute("data-filter-model")); }
        else if(e.target.getAttribute("data-filter-type") == "state"){ model_ = e.target.getAttribute("data-filter-model"); }
        else if(e.target.getAttribute("data-filter-type") == "notLinked"){ model_ = "notLinked"; }
        else if(e.target.getAttribute("data-filter-type") == "notCategorised"){ model_ = "notCategorised"; }
        if(model_ != ""){
            new_filter = new visu.Models.Filter({
                id:guid(),//e.target.getAttribute("data-filter-id"),
                type:e.target.getAttribute("data-filter-type"),
                model:model_
            });
            console.log("new filter: ",new_filter);
            this.filters.add(new_filter);
            console.log("filters: ",this.filters);
        }
    },
    putInList: function(e){
        this.style = "list";
        this.render();
    },
    putInGrid: function(e){
        this.style = "grid";
        this.render();
    },
    addKnowledge : function(e){
        //console.log("Add knowledge");
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
            title : $('#visu_new_k_title').val(),
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
    ///////////////////////////////////////////////////////
    render : function(){
        if(this.filters.length == 0){
            ks=this.knowledges;
        }else{
            ks = this.quenelle();
        }
            // Left part
            leftPart_view = new visu.Views.LeftPart({
                projects            : this.projects,
                concepts            :this.concepts,
                knowledges          :ks,
                links               :this.links,
                eventAggregator     :this.eventAggregator
            });
            $(this.el).html(leftPart_view.render().el);
            // middle part
            middlePart_view = new visu.Views.MiddlePart({
                knowledges:ks,
                filters:this.filters,
                user:this.user,
                links:this.links,
                eventAggregator:this.eventAggregator,
                style:this.style
            });
            $(this.el).append(middlePart_view.render().el);
            // right part
            rightPart_view = new visu.Views.RightPart({
                knowledges:ks,
                links:this.links,
                poches:this.poches,
                experts:this.experts,
                eventAggregator:this.eventAggregator
            });
            $(this.el).append(rightPart_view.render().el);

            return this;
        }
    });
/***************************************/
