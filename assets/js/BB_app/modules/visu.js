/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
visu.Models.Filter = Backbone.Model.extend({
    defaults : {
        id : "",
        type : "",
        val : ""
    },
    initialize : function Poche() {
        console.log('Filter visu Constructor');
        this.urlRoot = "poche";
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
visu.Views.FiltersPart = Backbone.View.extend({
    initialize : function(json) {
        console.log("Visu filters part view initialise");
        _.bindAll(this, 'render');
        // Variables
        
    },
    render : function(){
        return this;
    }
});
/***************************************/
visu.Views.KnowledgesPart = Backbone.View.extend({
    initialize : function(json) {
        console.log("Visu knowledges part view initialise");
        _.bindAll(this, 'render');
        // Variables
        
    },
    render : function(){
        return this;
    }
});
/***************************************/
visu.Views.RightPart = Backbone.View.extend({
    tagName: "div",
    className: "small-10 large-10 columns",
    initialize : function(json) {
        console.log("Right part of visu view initialise");
        _.bindAll(this, 'render');
        // Variables
        
    },
    render : function(){

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
        console.log("experts visu -",this.concepts);
        // Template
        this.template = _.template($('#visu-expert-template').html());
    },
    render : function(){
        // For each expert
        el_experts_part=this.el;
        this.experts.each(function(expert_){
            var renderedContent = this.template({concept:expert_.toJSON()});
            $(el_experts_part).html(renderedContent);
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
        console.log("poches visu -",this.poches);
        // Template
        this.template = _.template($('#visu-poche-template').html());
    },
    render : function(){
        $(this.el).html('');
        // For each poche
        el_poches_part=this.el;
        this.poches.each(function(poche_){
            var renderedContent = this.template({concept:poche_.toJSON()});
            $(el_poches_part).html(renderedContent);
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
        console.log("concepts visu -",this.concepts);
        // Template
        this.template = _.template($('#visu-concept-template').html());
    },
    render : function(){
        $(this.el).html('');
        // For each concept
        el_concepts_part=this.el;
        this.concepts.each(function(concept_){
            var renderedContent = this.template({concept:concept_.toJSON()});
            $(el_concepts_part).html(renderedContent);
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
        this.filters = json.filters;
    },
    events : {
        "click .addFilter" : "addFilter",
        "click .removeFilter" : "removeFilter"
    },
    addFilter: function(e){
        new_filter = new visu.Models.Filter({
            id:e.target.getAttribute("data-filter-id"),
            type:e.target.getAttribute("data-filter-type"),
            val:e.target.getAttribute("data-filter-val")
        });
        this.filters.add(new_filter);
    },
    removeFilter: function(e){
        this.filters.get(e.target.getAttribute("data-filter-id")).destroy();
    },
    render : function(){
        // Concepts part
        concepts_part_view = new visu.Views.ConceptsPart({concepts:this.concepts});
        $(this.el).html(concepts_part_view.render().el);
        // Poches part
        poches_part_view = new visu.Views.PochesPart({poches:this.poches});
        $(this.el).append(poches_part_view.render().el);
        // Experts part
        experts_part_view = new visu.Views.ExpertsPart({experts:this.experts});
        $(this.el).append(experts_part_view.render().el);

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
        this.filters = new visu.Collections.Filters();
        // Events
        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);
    },
    quenelle: function(){
        ks_filtered = new global.Collections.Knowledges();
        filters = this.filters;
        links = this.links;
        this.knowledges.each(function(k){
            filters.each(function(f){
                ////////////////////////
                if(f.type == "concept"){
                    links.filter(function(link){
                        if((link.get('concept') == f.val)&&(link.get('knowledges') == k.get('id'))){ks_filtered.add(k);return false;}
                        else{return false;}   
                    });
                }
                ////////////////////////
                if(f.type == "poche"){
                    b = k.get('tags').forEach(function(tag){
                        if(tag == f.val){
                            ks_filtered.add(k);
                            return false;
                        }
                    });
                    if(b == false){return false;}
                }
                ////////////////////////
                if(f.type == "expert"){
                    if(k.user.get('id') == f.val){
                        ks_filtered.add(k);
                        return false;
                    }
                }
                ////////////////////////
            });
        });
        return ks_filtered;
    },
    render : function(){
        ks = this.quenelle();
        // Left part
        leftPart_view = new visu.Views.LeftPart({
            concepts:this.concepts,
            knowledges:ks,
            poches:this.poches,
            experts:this.experts,
            filters:this.filters
        });
        $(this.el).html(leftPart_view.render().el);
        // right part
        // rightPart_view = new visu.Views.RightPart({});
        // $(this.el).append(rightPart_view.render().el);

        return this;
    }
});

/***************************************/
