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
        console.log('Filter visu Constructor');
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/***************************************/
visu.Collections.Filters = Backbone.Collection.extend({
    model : visu.Models.Filter,
    initialize : function() {
        console.log('Filters visu collection Constructor');
        this.bind("error", function(model, error){
            console.log( error );
        });
    }
});
/////////////////////////////////////////
// Right part
/////////////////////////////////////////
visu.Views.RightPart = Backbone.View.extend({
    tagName: "div",
    className: "small-10 large-10 columns",
    initialize : function(json) {
        console.log("Right part of visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.filters = json.filters;
        this.user = json.user;
        this.links = json.links;
        // Template
        this.template1 = _.template($('#visu-publish-module-template').html());
        this.template2 = _.template($('#visu-knowledge-template').html());
    },
    events : {
        "click .details" : "open_modal_details_box",
        "click .remove" : "removeFilter",
        "click .addKnowledge" : "addKnowledge",
    },
    removeFilter: function(e){
        this.filters.remove(this.filters.get(e.target.getAttribute('data-id-filter')));
    },
    open_modal_details_box :function(e){
        knowledge_ = this.knowledges.get(e.target.getAttribute('data-id-knowledge'));
        k_details.views.modal = new k_details.Views.Main({
            knowledge:knowledge_,
            user:this.user
        });
        k_details.views.modal.render();
        $('#detailsKnoledgeModal').foundation('reveal', 'open');
    },
    addKnowledge : function(e){
        console.log("Add knowledge");
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
        alert("new")
    },
    render : function(){
        $(this.el).html('');
        // Input 
        var renderedContent = this.template1({filters:this.filters.toJSON()});
        $(this.el).append(renderedContent);
        // For each knowledge
        el_knowledge_part=this.el;
        template2 = this.template2;
        this.knowledges.each(function(knowledge_){
            var renderedContent = template2({knowledge:knowledge_.toJSON()});
            $(el_knowledge_part).append(renderedContent);
        });
        return this;
    }
});
/////////////////////////////////////////
// Left part
/////////////////////////////////////////
visu.Views.ExpertsPart = Backbone.View.extend({
    initialize : function(json) {
        console.log("Visu experts part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.experts = json.experts;
        console.log("experts visu -",this.experts);
        // Template
        this.template = _.template($('#visu-expert-template').html());
    },
    render : function(){
        $(this.el).html('');
        // For each expert
        el_experts_part=this.el;
        template = this.template;
        this.experts.each(function(expert_){
            var renderedContent = template({expert:expert_.toJSON()});
            $(el_experts_part).append(renderedContent);
        });
        return this;
    }
});
/***************************************/
visu.Views.PochesPart = Backbone.View.extend({
    initialize : function(json) {
        console.log("Visu poches part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.knowledges = json.knowledges;
        // Template
        this.template = _.template($('#visu-poche-template').html());
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_poches_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.poches.each(function(poche_){
            knowledges.each(function(k){
                k.get('tags').forEach(function(tag){
                    if(tag == poche_.get('title')){total_connections+=1;}
                });
            });  
        });
        // For each poche
        this.poches.each(function(poche_){
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
visu.Views.ConceptsPart = Backbone.View.extend({
    initialize : function(json) {
        console.log("Visu concept part view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.links = json.links;
        // Template
        this.template = _.template($('#visu-concept-template').html());
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
        this.concepts.each(function(concept_){
            links.filter(function(link){
                if(link.get('concept') == concept_.get('id')){
                    total_connections+=1;return false;
                }
                else{return false;}   
            });  
        });
        // For each concept
        this.concepts.each(function(concept_){
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
visu.Views.LeftPart = Backbone.View.extend({
    tagName: "div",
    className: "small-2 large-2 columns",
    initialize : function(json) {
        console.log("Left part of visu view initialise");
        _.bindAll(this, 'render');
        _.bindAll(this, 'addFilter');
        _.bindAll(this, 'removeFilter');
        // Variables
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;    
        this.poches = json.poches;
        this.experts = json.experts;
        this.links = json.links;
        this.filters = json.filters;
    },
    events : {
        "click .addFilter" : "addFilter",
        "click .removeFilter" : "removeFilter"
    },
    addFilter: function(e){
        model_ = "";
        if(e.target.getAttribute("data-filter-type") == "concept"){model_ = this.concepts.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "expert"){model_ = this.experts.get(e.target.getAttribute("data-filter-model"))}
        else if(e.target.getAttribute("data-filter-type") == "poche"){model_ = this.poches.get(e.target.getAttribute("data-filter-model"))}
        if(model_ != ""){
            new_filter = new visu.Models.Filter({
                id:e.target.getAttribute("data-filter-id"),
                type:e.target.getAttribute("data-filter-type"),
                model:model_
            });
            this.filters.add(new_filter);
            console.log("filters: ",this.filters);
        }
    },
    removeFilter: function(e){
        this.filters.get(e.target.getAttribute("data-filter-id")).destroy();
    },
    render : function(){
        $(this.el).html('');
        // Concepts part
        concepts_part_view = new visu.Views.ConceptsPart({
            concepts:this.concepts,
            knowledges:this.knowledges,
            links:this.links
        });
        $(this.el).append(concepts_part_view.render().el);
        // Poches part
        poches_part_view = new visu.Views.PochesPart({
            poches:this.poches,
            knowledges:this.knowledges
        });
        $(this.el).append(poches_part_view.render().el);
        // Experts part
        // experts_part_view = new visu.Views.ExpertsPart({experts:this.experts});
        // $(this.el).append(experts_part_view.render().el);

        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
visu.Views.Main = Backbone.View.extend({
    el:"#visu_container",
    initialize : function(json) {
        console.log("Main visu view initialise");
        _.bindAll(this, 'render');
        _.bindAll(this, 'quenelle');
        // Variables
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.experts = json.experts;
        this.poches = json.poches;
        this.links = json.links;
        this.user = json.user;
        this.filters = new visu.Collections.Filters();
        // Events
        this.concepts.bind("reset", this.render);
        this.knowledges.bind("reset", this.render);
        this.experts.bind("reset", this.render);
        this.poches.bind("reset", this.render);
        this.links.bind("reset", this.render);
        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);
    },
    quenelle: function(){
        ks_filtered = new global.Collections.Knowledges();
        filters = this.filters;
        links = this.links;
        this.knowledges.each(function(k){
                      
            filters.each(function(f){
                ////////////////////////
                if(f.get('type') == "concept"){
                    links.filter(function(link){
                        if((link.get('concept') == f.get('model').get('id'))&&(link.get('knowledge') == k.get('id'))){
                            ks_filtered.add(k);return false;
                        }
                        else{return false;}   
                    });
                }
                ////////////////////////
                if(f.get('type') == "poche"){
                    b = k.get('tags').forEach(function(tag){
                        if(tag == f.get('model').get('title')){
                            ks_filtered.add(k);
                            return false;
                        }
                    });
                    if(b == false){return false;}
                }
                ////////////////////////
                if(f.get('type') == "expert"){
                    // if(k.user.get('id') == f.val){
                    //     ks_filtered.add(k);
                    //     return false;
                    // }
                }
                ////////////////////////
            });
        });
        return ks_filtered;
    },
    render : function(){
        if(this.filters.length == 0){ks=this.knowledges;}else{ks = this.quenelle();}
        // Left part
        leftPart_view = new visu.Views.LeftPart({
            concepts:this.concepts,
            knowledges:ks,
            links:this.links,
            poches:this.poches,
            experts:this.experts,
            filters:this.filters
        });
        $(this.el).html(leftPart_view.render().el);
        // right part
        rightPart_view = new visu.Views.RightPart({
            knowledges:ks,
            filters:this.filters,
            user:this.user,
            links:this.links
        });
        $(this.el).append(rightPart_view.render().el);

        return this;
    }
});

/***************************************/
