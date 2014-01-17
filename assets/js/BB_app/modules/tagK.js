tagK.Views.Poche = Backbone.View.extend({
    tagName : "li",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.poche = json.poche;
        this.current_knowledge = json.current_knowledge;

        // Events
        this.current_knowledge.bind("change", this.render);

        this.template = _.template($('#poche-template').html()); 
    },

    render : function(){
        $(this.el).html("")
        console.log("RENDER");
        var tagged = "selectTag";
        if(_.indexOf(this.current_knowledge.get('tags'), this.poche.get('title')) != -1 ) tagged="unSelectTag alert"
        var renderedContent = this.template({
            tag : { title : this.poche.get('title'), tagged : tagged, id : this.poche.id}
        })
        $(this.el).append(renderedContent);
        return this;
    }
});
tagK.Views.Poches = Backbone.View.extend({
    tagName : "ul",
    className : "small-block-grid-3 medium-block-grid-5 large-block-grid-8",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
        this.current_knowledge = json.current_knowledge;

    },
    events : {
        "click .selectTag" : "onTagSelected",
        "click .unSelectTag" : "onTagDeSelected"
    },

    onTagSelected : function(e){
        poche_id = e.target.getAttribute("data-id-poche");
        poche = this.poches.get(poche_id);
        this.current_knowledge.get('tags').unshift(poche.get('title'));
        this.current_knowledge.trigger("change");
        this.current_knowledge.save();
    },
    onTagDeSelected : function(e){
        poche_id = e.target.getAttribute("data-id-poche");
        poche = this.poches.get(poche_id);
        tags = _.without(this.current_knowledge.get('tags'), poche.get('title'));
        this.current_knowledge.set({tags : tags});
        this.current_knowledge.save();

    },
    render : function(){
        _this = this;
        $(_this.el).html("");
        this.poches.each(function(poche){
            poche_ = new tagK.Views.Poche({
                poche : poche,
                current_knowledge : _this.current_knowledge
            });
            $(_this.el).append(poche_.render().el)
        })

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