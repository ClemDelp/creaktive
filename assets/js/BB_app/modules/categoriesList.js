/***************************************/
var categoriesList = {
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
categoriesList.Views.PochesCategory = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.poches_render = this.poches;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('poche_search', this.pocheSearch, this);
        this.eventAggregator.on('categories_list_render', this.render, this);
        // Templates
        this.template_tags = _.template($('#categoriesList-tag-template').html());
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
        template = this.template_tags;
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
categoriesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
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
        this.template_search = _.template($('#categoriesList-search-template').html());
        
    },
    events : {
        "keyup .search" : "search"
    },
    search: function(e){
        e.preventDefault();
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
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"Poches"}));
        // Poche list
        poches_list_view = new categoriesList.Views.PochesCategory({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_list_view.render().el);
        
        return this;
    }
});
/***************************************/