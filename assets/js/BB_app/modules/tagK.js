/***********************************************/
tagK.Views.Poches = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.poches_render = this.poches;
        this.eventAggregator = json.eventAggregator;
        this.current_knowledge = json.current_knowledge;
        // Events
        this.eventAggregator.on("details_poche_search", this.poche_search, this);
        // Templates
        this.template = _.template($('#tagK-poches-template').html()); 
    },
    poche_search : function(matched){
        this.poches_render = matched;
        this.render();
    },  
    render : function(){
        $(this.el).html("");
        // Init
        current_knowledge = this.current_knowledge;
        // Made linked and unlinked poches collection
        poches_linked = new Backbone.Collection();
        poches_notLinked = new Backbone.Collection();
        this.poches_render.each(function(poche){
            if(_.indexOf(current_knowledge.get('tags'), poche.get('title')) != -1 ){
                poches_linked.add(poche);
            }else{
                poches_notLinked.add(poche);
            }
        });
        // Poches 
        $(this.el).append(this.template({
            poches_linked : poches_linked.toJSON(), 
            poches_notLinked : poches_notLinked.toJSON()
        }));

        return this;
    }
});
/***********************************************/
tagK.Views.Main = Backbone.View.extend({
    tagName : "div",
    className : "panel",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
        this.current_knowledge = json.current_knowledge;
        // Events
        _.bindAll(this, 'render');

        this.poches.bind('reset', this.render);
        this.poches.bind('add', this.render);
        this.poches.bind('remove', this.render);
      
        // Template
        this.template = _.template($('#tagK-template').html());       
    },

    events : {
        "keyup .searchDetails" : "search",
        "click .linkCategory" : "linkCategory",
        "click .unlinkCategory" : "unlinkCategory"
    },
    linkCategory : function(e){
        e.preventDefault();
        poche_id = e.target.getAttribute("data-id-poche");
        poche = this.poches.get(poche_id);
        this.current_knowledge.get('tags').unshift(poche.get('title'));
        this.current_knowledge.trigger("change");
        this.current_knowledge.save();
        this.eventAggregator.trigger("Ktagged",e);
        this.render();
    },
    unlinkCategory : function(e){
        e.preventDefault();
        poche_id = e.target.getAttribute("data-id-poche");
        poche = this.poches.get(poche_id);
        tags = _.without(this.current_knowledge.get('tags'), poche.get('title'));
        this.current_knowledge.set({tags : tags});
        this.current_knowledge.save();
        this.eventAggregator.trigger("Ktagged",e);
        this.render();

    },
    search: function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.poches.each(function(k){
            if(research == k.get('title').substr(0,research_size)){
                matched.add(k);
            }
        });
        this.eventAggregator.trigger('details_poche_search',matched);
    },
    render : function() {
        $(this.el).html("");
        // Current Knowledge view
        var renderedContent = this.template({
            knowledge : this.current_knowledge.toJSON()
        });
        $(this.el).html(renderedContent);

        pochesGrid = new tagK.Views.Poches({
            current_knowledge : this.current_knowledge,
            poches:this.poches,
            eventAggregator:this.eventAggregator,
        });
        $(this.el).append(pochesGrid.render().el);

        $(document).foundation();
        return this;
    }
});