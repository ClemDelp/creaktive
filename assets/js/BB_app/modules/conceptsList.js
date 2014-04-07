/***************************************/
var conceptsList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/***************************************/
conceptsList.Views.ConceptList = Backbone.View.extend({
    initialize : function(json) {
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
        this.template = _.template($('#conceptList-concept-template').html());
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
conceptsList.Views.Main = Backbone.View.extend({
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
        this.template_search = _.template($('#conceptList-search-template').html());
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
        concept_list_view = new conceptsList.Views.ConceptList({
            concepts:this.concepts,
            eventAggregator:this.eventAggregator,
            knowledges:this.knowledges,
            links:this.links
        });
        $(this.el).append(concept_list_view.render().el);
        
        
        return this;
    }
});