/***************************************/
var nodesMapping = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collection: {},
  models: {},
  views: {},
  init: function () {}
};
/***************************************/
nodesMapping.Views.Mapping = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.collection = json.collection;
        this.collection_render = this.collection;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('search', this.Search, this);
        // Templates
        this.template = _.template($('#nodesMapping-tag-template').html());
    },
    Search: function(matched){
        this.collection_render = matched;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Concepts mapping template
        $(this.el).append(this.template({collection : this.collection_render.toJSON()}));

        return this;
    }
});
/***************************************/
nodesMapping.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.collection = json.collection;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.collection.bind("add",this.render,this);
        this.collection.bind("remove",this.render,this);
        this.collection.bind("change",this.render,this);
        // Templates
        this.template_search = _.template($('#nodesMapping-search-template').html());
    },
    events : {
        "keyup .search" : "search"
    },
    search: function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.collection.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('search',matched);
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search());
        // Node map
        $(this.el).append(new nodesMapping.Views.Mapping({
            collection:this.collection,
            eventAggregator:this.eventAggregator
        }).render().el);
        
        return this;
    }
});
/***************************************/