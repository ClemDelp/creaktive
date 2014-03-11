/////////////////////////////////////////
// CONCETP TABLE
/////////////////////////////////////////
analyse.Views.ConceptPercent = Backbone.View.extend({
    tagName : "table",
    className : "",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.concept            = json.concept;
        this.eventAggregator    = json.eventAggregator;
        this.rec                = json.rec;
        this.per                = json.per;
        this.template_concept   = _.template($('#analyse-concept-template').html());

        // Style
        $(this.el).attr('style',"width:100%");
    },
    render : function(){
        $(this.el).html('');        

        $(this.el).append(this.template_concept({
            concept:this.concept.toJSON(),
            per:this.per,
            rec:this.rec
        }));

        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
analyse.Views.Main = Backbone.View.extend({
    el:"#analyse_container",
    initialize : function(json) {
        _.bindAll(this, 'render');

        // Variables
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        this.x_axis             = "concepts";
        this.y_axis             = "knowledges";
        this.template_axis      = _.template($('#analyse-axis-template').html());

        // Events
        this.links.bind("reset", this.render);
    },
    events : {

    },
    render : function(){
        $(this.el).html("");
        // init
        knowledges = this.knowledges;
        links = this.links;
        el = this.el;
        // Filters choice
        $(this.el).append(this.template_axis());
        // Concepts percent table
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
            if(recurrence == 0){percentage = 0;}else{percentage = (recurrence*100)/knowledges.length;}
            $(el).append(new analyse.Views.ConceptPercent({concept:concept_,rec : recurrence,per : percentage}).render().el);
        });
        
    }
});
/***************************************/