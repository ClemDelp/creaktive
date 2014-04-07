/***************************************/
var expertsList = {
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
expertsList.Views.ExpertsList = Backbone.View.extend({
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
        this.template = _.template($('#expertsList-expert-template').html());
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
expertsList.Views.Main = Backbone.View.extend({
    className:"content",
    initialize : function(json) {
        _.bindAll(this, 'render','search');
        // Variables
        this.experts = json.experts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Template
        this.template_search = _.template($('#expertsList-search-template').html());
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
        experts_list_view = new expertsList.Views.ExpertsList({
            experts:this.experts,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(experts_list_view.render().el);
        
        return this;
    }
});
/***************************************/