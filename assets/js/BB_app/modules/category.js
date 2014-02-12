/////////////////////////////////////////
// Models & collections
/////////////////////////////////////////
category.Models.Filter = Backbone.Model.extend({
    defaults : {
        id : "",
        type : "",
        model : ""
    },
    initialize : function Poche() {
        //console.log('Filter category Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/***************************************/
category.Collections.Filters = Backbone.Collection.extend({
    model : category.Models.Filter,
    initialize : function() {
        //console.log('Filters category collection Constructor');
        this.bind("error", function(model, error){
            //console.log( error );
        });
    }
});
/////////////////////////////////////////
// Left Part
/////////////////////////////////////////
category.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.poche              = json.poche;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
    },
    addKnowledge : function(e){
        // Init
        user_ = this.user;
        poches_ = [e.target.getAttribute('data-title-category')];
        // Create the knowledge (sign with poche if poches are in context)
        newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
            title : $(this.el).find('.category_new_k_title').val(),
            //content : CKEDITOR.instances.new_k_content.getData(),
            tags: poches_,
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        // Save the new knowledge
        newK.save();
        this.knowledges.add(newK);
        this.render();

    },
    render:function(){
        $(this.el).html('');
        $(this.el).append(this.template_list({knowledges : this.knowledges.toJSON(), category : this.poche.toJSON()}));

        return this;
    }
});
/***************************************/
category.Views.Categories = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    render:function(){
        $(this.el).html('');
        //init
        knowledges = this.knowledges;
        user = this.user;
        template_list = this.template_list;
        el = this.el;
        eventAggregator_ = this.eventAggregator;
        // For each poches
        this.poches.each(function(poche){
            list_of_knowledges = new Backbone.Collection();
            this.knowledges.each(function(knowledge){
                knowledge.get('tags').forEach(function(tag){
                    if(poche.get('title') == tag){list_of_knowledges.add(knowledge);}
                });
            });
            list_view = new category.Views.Category({
                knowledges      : list_of_knowledges,
                poche           : poche,
                user            : user,
                eventAggregator : eventAggregator_
            });
            $(this.el).append(list_view.render().el);
        });

        return this;
    }
});
/***************************************/
category.Views.RightPart = Backbone.View.extend({
    tagName: "div",
    className: "small-11 medium-10 large-10 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.filters            = json.filters;
        this.user               = json.user;
        // Events 

        // Templates
        this.template_search = _.template($('#category-searchKnowledges-template').html());
        this.template_filters = _.template($('#category-filters-template').html());
        
    },
    render : function(){
        $(this.el).html('');
        // Search bar
        $(this.el).append(this.template_search());
        // Context bar
        $(this.el).append(this.template_filters({filters : this.filters.toJSON()}));
        // Category de cards
        lists_view = new category.Views.Categories({
            knowledges      : this.knowledges,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
        

        return this;
    }
});
/////////////////////////////////////////
// Left Part
/////////////////////////////////////////
/***************************************/
category.Views.PochesCategory = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.poches_render = this.poches;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('poche_search', this.pocheSearch, this);
        // Templates
        this.template_tags = _.template($('#category-tag-template').html());
        this.template_new_poche = _.template($('#category-new-poche-template').html());
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
        // New poche
        $(this.el).append(this.template_new_poche());

        return this;
    }
});
/***************************************/
category.Views.PochesPart = Backbone.View.extend({
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
        this.template_search = _.template($('#category-searchTags-template').html());
        
    },
    events : {
        "keyup .search" : "search",
        "click .add" : "addPoche",
        "click .removePoche" : "removePoche",
    },
    search: function(e){
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
    removePoche: function(e){
        var poche = this.poches.get(e.target.getAttribute('data-id-poche'));
        poche.destroy();
    },
    addPoche : function(e){
        global.models.newP = new global.Models.Poche({
            id: guid(),
            title: $("#category_newP").val(),
            user : "clem",
            color : "#FF0000",
            description : $("#category_newP_description").val(),
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
    },
    render : function(){
        // Init
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"Poches"}));
        // Poche list
        poches_list_view = new category.Views.PochesCategory({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_list_view.render().el);
        
        return this;
    }
});
/***************************************/
category.Views.LeftPart = Backbone.View.extend({
    className: "small-2 medium-2 large-2 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;    
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
    },

    render : function(){
        $(this.el).html('');
        // Poches part
        poches_part_view = new category.Views.PochesPart({
            poches:this.poches,
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(poches_part_view.render().el);
        


        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
category.Views.Main = Backbone.View.extend({
    el:"#category_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.filters            = new category.Collections.Filters();
        this.eventAggregator    = json.eventAggregator;

        // Events                 
        this.poches.bind("reset", this.render);

        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);

        this.knowledges.bind("reset", this.render);
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
    render : function(){
        $(this.el).html("");
        // init
        poches_to_render = new Backbone.Collection(); 
        if(this.filters.length != 0){
            this.filters.each(function(filter){
                if(filter.get('type') == "poche"){poches_to_render.add(filter.get('model'))}
            });
        }else{
            this.poches.each(function(poche){
                poches_to_render.add(poche);
            });
        }
        // Left part
        leftPart_view = new category.Views.LeftPart({
            knowledges:this.knowledges,
            poches:this.poches,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(leftPart_view.render().el);
        // right part
        rightPart_view = new category.Views.RightPart({
            knowledges:this.knowledges,
            poches : poches_to_render,
            filters : this.filters,
            user : this.user,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(rightPart_view.render().el);
        $(document).foundation();
        return this;
    }
});
/***************************************/
