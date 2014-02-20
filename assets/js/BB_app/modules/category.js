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
// Middle Part
/////////////////////////////////////////
category.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render',"openModal");
        // Variable
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.poche              = json.poche;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "click .openModal"  : "openModal"
    },
    openModal: function(e){
        event.preventDefault();
        this.eventAggregator.trigger("openModal",e.target.getAttribute("data-knowledge-id"),e.target.getAttribute("data-catg-origin"));
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
        $(this.el).append(this.template_list({
            knowledges : this.knowledges.toJSON(), 
            category : this.poche.toJSON(),
            categories : this.poches.toJSON()
        }));

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
        // Events
        this.eventAggregator.on('categories_list_render', this.render, this);
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    render:function(){
        $(this.el).html('');
        //init
        knowledges = this.knowledges;
        user = this.user;
        poches = this.poches;
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
                poches          : poches,
                user            : user,
                eventAggregator : eventAggregator_
            });
            $(this.el).append(list_view.render().el);
        });

        return this;
    }
});
/***************************************/
category.Views.MiddlePart = Backbone.View.extend({
    className: "small-9 medium-8 large-8 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.filters            = json.filters;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
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
// Right Part
/////////////////////////////////////////
category.Views.NotCategorized = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('knowledge_search', this.knowledgeSearch, this);
        // Templates
        this.template = _.template($('#category-notcategorized-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    knowledgeSearch: function(matched_knowledges){
        this.knowledges_render = matched_knowledges;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_notcategorized_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        poches_ = this.poches;
        // For each poche
        this.knowledges_render.each(function(knowledge_){
            if(knowledge_.get('tags').length == 0){
                $(el_notcategorized_part).append(template({
                    knowledge : knowledge_.toJSON(),
                    poches : poches_.toJSON()
                }));
            }
        });

        return this;
    }
});
/***************************************/
category.Views.RightPart = Backbone.View.extend({
    className: "small-2 medium-2 large-2 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges; 
        this.poches = json.poches;   
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_search = _.template($('#category-search-template').html());
    },
    events : {
        "keyup .search" : "search",
    },
    search: function(e){
        event.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.knowledges.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('knowledge_search',matched);
    },
    render : function(){
        $(this.el).html('');
        // Input search
        $(this.el).append(this.template_search({title:"K not categorized"}));
        // Poches part
        notcategorized_view = new category.Views.NotCategorized({
            knowledges:this.knowledges,
            poches : this.poches,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(notcategorized_view.render().el);

        return this;
    }
});
/////////////////////////////////////////
// Left Part
/////////////////////////////////////////
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
        this.eventAggregator.on('categories_list_render', this.render, this);
        // Templates
        this.template_tags = _.template($('#category-tag-template').html());
        this.template_new_poche = _.template($('#category-new-poche-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    pocheSearch: function(matched_poches){
        event.preventDefault();
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
category.Views.LeftPart = Backbone.View.extend({
    className: "small-2 medium-2 large-2 columns",
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
        this.template_search = _.template($('#category-search-template').html());
        
    },
    events : {
        "keyup .search" : "search",
        "click .add" : "addPoche",
        "click .removePoche" : "removePoche",
    },
    search: function(e){
        event.preventDefault();
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
        event.preventDefault();
        var poche = this.poches.get(e.target.getAttribute('data-id-poche'));
        poche.destroy();
    },
    addPoche : function(e){
        event.preventDefault();
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
/////////////////////////////////////////
// Modal
/////////////////////////////////////////
category.Views.Modal = Backbone.View.extend({
    el:"#category_modal_container",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.knowledge = new Backbone.Model();
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.category_origin = "none";
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on("openModal", this.openModal);
        // Templates
        this.template_modal = _.template($('#category-modal-template').html()); 
    },
    events: {
        "click .moveTo" : "moveTo",
        "click .copyTo" : "copyTo",
    },
    copyTo : function(e){
        event.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        knowledge_id = e.target.getAttribute("data-knowledge-id");
        knowledgeToSet = this.knowledges.get(knowledge_id);
        knowledgeToSet.set({'tags':_.union(knowledgeToSet.get('tags'),[target])});
        knowledgeToSet.save();
        this.eventAggregator.trigger("categories_list_render");
        $('#category_modal_container').foundation('reveal', 'close'); 
    },
    moveTo : function(e){
        // Init
        event.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        origin = e.target.getAttribute("data-catg-orign");
        knowledge_id = e.target.getAttribute("data-knowledge-id");
        knowledgeToSet = this.knowledges.get(knowledge_id);
        // Si K est déjà dans une poche ou enlève le tag de la poche d'origine
        if(knowledgeToSet.get('tags').length != 0){
            knowledgeToSet.set({'tags': _.without(knowledgeToSet.get('tags'),origin)});    
        }
        knowledgeToSet.set({'tags':_.union(knowledgeToSet.get('tags'),[target])});
        knowledgeToSet.save();
        this.eventAggregator.trigger("categories_list_render");
        $('#category_modal_container').foundation('reveal', 'close'); 
    },
    openModal : function(k_id,catg_origin){
        this.knowledge = this.knowledges.get(k_id);
        this.category_origin = catg_origin;
        this.render(function(){
            $('#category_modal_container').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(this.template_modal({
            knowledge:this.knowledge.toJSON(),
            category_origin : this.category_origin,
            poches : this.poches.toJSON()
        }));

       
        // Render it in our div
        if(callback) callback();

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
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);
    },
    events : {
        "click .addFilter" : "addFilter",
        "click .remove" : "removeFilter",
        "click .moveTo" : "moveTo"
    },
    moveTo : function(e){
        // Init
        event.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        knowledge_id = e.target.getAttribute("data-knowledge-id");
        knowledgeToSet = this.knowledges.get(knowledge_id);
        
        knowledgeToSet.set({'tags':_.union(knowledgeToSet.get('tags'),[target])});
        knowledgeToSet.save();
        this.render();
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
        // alert(this.knowledges.filter(function(knowledge){return knowledge.get('tags').length == 0;}).length)
        this.knowledges.each(function(k){console.log(k.get('title'));console.log(k.get('tags'))})
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
        // Middle part
        middlePart_view = new category.Views.MiddlePart({
            knowledges:this.knowledges,
            poches : poches_to_render,
            filters : this.filters,
            user : this.user,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(middlePart_view.render().el);
        // Right part
        right_part = new category.Views.RightPart({
            knowledges:this.knowledges,
            poches : this.poches,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(right_part.render().el);
        //Modal
        modal_view = new category.Views.Modal({
            poches: this.poches,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(modal_view.render());

        $(document).foundation();

        return this;
    }
});
/***************************************/
