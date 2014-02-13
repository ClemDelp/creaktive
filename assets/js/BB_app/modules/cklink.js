/////////////////////////////////////////////////
// Right Part
/////////////////////////////////////////////////
cklink.Views.Knowledges = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges = json.knowledges;
        this.links = json.links;
        // Template
        this.template = _.template($('#cklink-knowledges-template').html()); 
    },
    events : {
        "click .selectable" : "linkAndUnlink",
    },
    linkAndUnlink: function(e){
        event.preventDefault();
        // Init
        current_concept = this.current_concept;
        // Change the background color
        var Class = e.target.className.split(' ');
        var index = Class.indexOf('alert');
        if(index > -1){
            /* Deselection */
            $("#"+e.target.id).removeClass('alert');
            var links_to_remove = this.links.filter(function(link){
                return (
                    link.get('knowledge') == e.target.getAttribute('data-id-knowledge') &&
                    link.get('concept') == this.current_concept.get('id')
                );
            });
            links_to_remove.forEach(function(link){
                link.destroy();
            });
        }else{
            /* Selection */
            $("#"+e.target.id).addClass('alert');
            // Create a new link
            var concept_id = this.current_concept.get('id');
            global.models.newLink = new global.Models.CKLink({
                id :guid(),
                user : "",
                date : getDate(),
                concept : concept_id,
                knowledge : e.target.getAttribute('data-id-knowledge')
            });
            // Save the new link and add it to links collection
            global.models.newLink.save();
            this.links.add([global.models.newLink]);
        }

    },
    render : function() {
        $(this.el).html("");
        // Init
        knowledges = this.knowledges;
        current_concept = this.current_concept;
        k_linked    = new Backbone.Collection();
        k_notlinked = new Backbone.Collection();
        // Set k_linked
        this.links.filter(function(link){
            if((!k_linked.contains(knowledges.get(link.get('knowledge'))))&&(link.get('concept')==current_concept.get('id'))){
                k_linked.add(knowledges.get(link.get('knowledge')));
            }
        });
        // Set k_notlinked
        knowledges.each(function(knowledge){
            if(!k_linked.contains(knowledge)){k_notlinked.add(knowledge);}
        });
        // Knowledges
        $(this.el).append(this.template({
            k_linked : k_linked.toJSON(),
            k_notlinked : k_notlinked.toJSON()
        }));

        return this;
    }
});
/***********************************************/
cklink.Views.RightPart = Backbone.View.extend({
    className: "small-10 medium-10 large-10 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges         = json.knowledges;
        this.filters            = json.filters;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;
        // Events 

        // Templates
        this.template_search = _.template($('#category-searchKnowledges-template').html());
        this.template_filters = _.template($('#category-filters-template').html());
        
    },
    render : function(){
        $(this.el).html('');
        // Search bar
        //$(this.el).append(this.template_search());
        // Context bar
        $(this.el).append(this.template_filters({filters : this.filters.toJSON()}));
        // Knowledge
        list_of_knowledges = new cklink.Views.Knowledges({
            current_concept : this.current_concept,
            knowledges      : this.knowledges,
            links           : this.links,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(list_of_knowledges.render().el);

        return this;
    }
});
/////////////////////////////////////////////////
// Main 
/////////////////////////////////////////////////
cklink.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        //console.log("CKLINK MAIN view initialise");
        // Variables
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
        this.links = json.links;
        this.concepts = json.concepts;
        this.filters = new category.Collections.Filters();
        this.current_concept = json.current_concept;

        // Events
        _.bindAll(this, 'render');

        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);

        this.poches.bind('reset', this.render);
        this.poches.bind('add', this.render);
        this.poches.bind('remove', this.render);

        this.links.bind('reset', this.render);

        this.knowledges.bind('reset', this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);

        // Template
        this.template = _.template($('#cklink-current-concept-template').html());       
    },
    events : {
        "click .addFilter" : "addFilter",
        "click .remove" : "removeFilter",
    },
    removeFilter: function(e){
        event.preventDefault();
        this.filters.remove(this.filters.get(e.target.getAttribute('data-id-filter')));
    },
    addFilter: function(e){
        event.preventDefault();
        model_ = this.poches.get(e.target.getAttribute("data-filter-model"));
        if(model_ != ""){
            new_filter = new category.Models.Filter({
                id:guid(),//e.target.getAttribute("data-filter-id"),
                type:e.target.getAttribute("data-filter-type"),
                model:model_
            });
            this.filters.add(new_filter);
        }
    },
    render : function() {
        $(this.el).html("");
        // init
        knowledges = this.knowledges;
        knowledges_to_render = new Backbone.Collection(); 
        if(this.filters.length != 0){
            this.filters.each(function(filter){
                if(filter.get('type') == "poche"){
                    knowledges.each(function(knowledge){
                        console.log('tutu',knowledge.get('tags').indexOf(filter.get('model')),"tags ",knowledge.get('tags'),"model",filter.get('model'))
                        if(knowledge.get('tags').indexOf(filter.get('model').get('title')) > -1){
                            knowledges_to_render.add(knowledge);
                        }
                    });
                }
            });
        }else{
            this.knowledges.each(function(knowledge){
                knowledges_to_render.add(knowledge);
            });
        }
        // Left part
        left_part_view = new category.Views.LeftPart({
            knowledges      : this.knowledges,   
            poches          : this.poches,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(left_part_view.render().el);
        // Right Part
        right_part_view = new cklink.Views.RightPart({
            current_concept  : this.current_concept,
            knowledges       : knowledges_to_render,
            filters          : this.filters,
            links            : this.links,
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(right_part_view.render().el);


        return this;
    }
});
/***************************************/    