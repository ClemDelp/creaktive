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
/***************************************/
explorer.Views.KnowledgesList = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.notifications = json.notifications;
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.notifications.on('change',this.render,this);
        this.notifications.on('add',this.render,this);
        this.notifications.on('remove',this.render,this);
        this.eventAggregator.on('knowledge_search', this.knowledge_search, this);
        // Templates
        this.template_knowledge = _.template($('#explorer-knowledge-template').html());
    },
    events : {
        "click .openModal" : "openModal"
    },
    openModal : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openModelEditorModal',e.target.getAttribute("data-id-knowledge"));
    },
    knowledge_search: function(matched_knowledges){
        this.knowledges_render = matched_knowledges;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        _this = this;
        // For each knowledge
        this.knowledges_render.each(function(_knowledge){
            // Notifications
            _notifNbr = 0;
            _this.notifications.each(function(notification){
                if(notification.get('to').id == _knowledge.get('id')){_notifNbr = _notifNbr+1;}
            });
            // Send knowledge to template
            $(_this.el).append(_this.template_knowledge({
                notifNbr : _notifNbr,
                knowledge : _knowledge.toJSON()
            }));

        });
        
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
        this.notifications = json.notifications;
        this.knowledges = json.knowledges;
        this.filters = json.filters;
        this.user = json.user;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.knowledges.bind('remove',this.render)
        this.knowledges.bind('add',this.render)
        this.knowledges.bind('change',this.render)
        // Template
        this.template_context = _.template($('#explorer-context-template').html());
    },
    events : {
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
    render : function(){
        $(this.el).html('');
        // Input 
        $(this.el).append(this.template_context({filters:this.filters.toJSON()}));
        // knowledge list
        $(this.el).append(new explorer.Views.KnowledgesList({
            notifications : this.notifications,
            className : "row panel custom_row",
            knowledges:this.knowledges,
            user:this.user,
            eventAggregator:this.eventAggregator,
        }).render().el);

        return this;
    }
});
/////////////////////////////////////////
// Left Part
/////////////////////////////////////////
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
        $(this.el).append(new expertsList.Views.Main({
            idAcc : "authors_acc",
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        }).render().el);

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
        $(this.el).append(new conceptsList.Views.Main({
            idAcc : "concepts_acc",
            concepts:this.concepts,
            knowledges:this.knowledges,
            links:this.links,
            eventAggregator:this.eventAggregator
        }).render().el);

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
        $(this.el).append(new projectsList.Views.Main({
            idAcc : "projects_acc",
            projects:this.projects,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        }).render().el);

        return this;
    }
});
/***************************************/
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
        _.bindAll(this, 'render');
        // Variables
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.experts            = json.experts;
        this.poches             = json.poches;
        this.links              = json.links;
        this.user               = json.user;
        this.all_notifications  = json.a_notifications;
        this.notifications      = json.k_notifications;
        this.filters            = new explorer.Collections.Filters();
        this.eventAggregator    = json.eventAggregator;
        // Modals
        this.CKLayoutModal_view = new CKLayout.Views.Modal({
            notifications : this.all_notifications,
            type : "knowledge",
            user : this.user,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        // Events
        this.links.bind('add', this.render);
        this.links.bind('remove', this.render);
        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);
        this.eventAggregator.on("Ktagged", this.render);
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
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
    addKnowledge : function(e){
        e.preventDefault();
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
            content : '',
            tags: poches,
            comments: new Backbone.Collection(),
            date: getDate(),
            date2:new Date().getTime()
        });
        // For each concept create cklinks (if concepts are in context)
        if(concepts.length > 0){
            concepts.forEach(function(concept){
                global.models.newLink = new global.Models.CKLink({
                    id :guid(),
                    user : user_,
                    content : '',
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
    },
    ///////////////////////////////////////////////////////
    // Session quenelle power
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
        // Apply filters
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
            notifications : this.notifications,
            knowledges:ks,
            filters:this.filters,
            user:this.user,
            links:this.links,
            eventAggregator:this.eventAggregator
        }).render().el);
        // Right part
        $(this.el).append(new categoriesList.Views.Main({
            className : "large-2 medium-2 small-2 columns",
            poches : this.poches,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        }).render().el);
        
        $(document).foundation();
        return this;
    }
});
/***************************************/
