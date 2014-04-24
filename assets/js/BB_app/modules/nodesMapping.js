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
        this.model = json.model;
        this.collection = json.collection;
        this.collection_render = this.collection;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.listenTo(this.eventAggregator,'search', this.Search, this);
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
        $(this.el).append(this.template({
            from : this.model.toJSON(),
            collection : this.collection_render.toJSON()
        }));

        return this;
    }
});
/***************************************/
nodesMapping.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.collection = json.collection;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.listenTo(this.collection,"add",this.render,this);
        this.listenTo(this.collection,"remove",this.render,this);
        this.listenTo(this.collection,"change",this.render,this);
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
        $(this.el).append(this.template_search({from : this.model.toJSON()}));
        // Node map
        if(nodesMapping.views.mapping){
            nodesMapping.views.mapping.remove();
        }
        nodesMapping.views.mapping = new nodesMapping.Views.Mapping({
            model : this.model,
            collection:this.collection,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(nodesMapping.views.mapping.render().el);
        
        return this;
    }
});
/***************************************/