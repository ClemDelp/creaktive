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
        _.bindAll(this, 'render');
        // Variable
        this.notifications      = json.notifications;
        this.user               = json.user;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.poche              = json.poche;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    render:function(){
        $(this.el).html('');
        _this = this;
        // Notifications
        _notifNbr = 0;
        this.notifications.each(function(notification){
            if((notification.get('to') == _this.poche.get('id'))&&( _.indexOf(notification.get('read'),_this.user.get('id')) == -1 )){_notifNbr = _notifNbr+1;}
        });
        // Category template
        $(this.el).html(this.template_list({
            notifNbr : _notifNbr,
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
        _.bindAll(this, 'render',"openModal","openCategoryEditorModal");
        // Variable
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "click .openModal"  : "openModal",
        "click .openCategoryEditorModal" : "openCategoryEditorModal"
    },
    openCategoryEditorModal : function(e){
        e.preventDefault();
        // Get category knowledges
        category_model = this.poches.get(e.target.getAttribute("data-category-id"))
        list_of_knowledges = new Backbone.Collection();
        this.knowledges.each(function(knowledge){
            knowledge.get('tags').forEach(function(tag){
                if(category_model.get('title') == tag){list_of_knowledges.add(knowledge);}
            });
        });
        this.eventAggregator.trigger('openCategoryEditorModal',e.target.getAttribute("data-category-id"),list_of_knowledges);
    },
    openModal: function(e){
        e.preventDefault();
        this.eventAggregator.trigger("openModal",e.target.getAttribute("data-knowledge-id"),e.target.getAttribute("data-catg-origin"));
    },
    addKnowledge : function(e){
        e.preventDefault()
        catg_id = e.target.getAttribute('data-id-category')
        poches_ = [e.target.getAttribute('data-title-category')];
        // Create the knowledge (sign with poche if poches are in context)
        newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
            title : $(this.el).find('#category_new_k_title_'+catg_id).val(),
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
        //init
        knowledges = this.knowledges;
        user = this.user;
        poches = this.poches;
        notifications = this.notifications;
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
                notifications   : notifications,
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
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.filters            = json.filters;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Events 
        this.poches.on('remove',this.render,this)
        this.poches.on('change',this.render,this)
        this.eventAggregator.on('categories_list_render', this.render, this);
        // Templates
        this.template_filters = _.template($('#category-filters-template').html());
        
    },
    render : function(){
        $(this.el).html('');
        // Context bar
        $(this.el).append(this.template_filters({filters : this.filters.toJSON()}));
        // Category de cards
        lists_view = new category.Views.Categories({
            id              : "categories_grid",
            className       : "row panel custom_row gridalicious",
            notifications   : this.notifications,
            knowledges      : this.knowledges,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
          });
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
        e.preventDefault();
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
        e.preventDefault();
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
        e.preventDefault();
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
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.filters            = new category.Collections.Filters();
        this.eventAggregator    = json.eventAggregator;
        // Modals
        this.modal_view = new category.Views.Modal({
            poches: this.poches,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        this.categoryEditorModal_view = new categoryEditor.Views.Modal({
            notifications : this.notifications,
            user : this.user,
            categories : this.poches,
            eventAggregator : this.eventAggregator
        });
        // Events                 
        this.notifications.bind("reset", this.render);
        this.filters.bind('add', this.render);
        this.filters.bind('remove', this.render);
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);

    },
    events : {
        "click .addFilter" : "addFilter",
        "click .remove" : "removeFilter",
        "click .moveTo" : "moveTo",
        "click .newCategory" : "newCategory"
    },
    newCategory : function(e){
        e.preventDefault();
        global.models.newP = new global.Models.Poche({
            id: guid(),
            title: $(this.el).find(".category_title").val(),
            user : "clem",
            color : "#FF0000",
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
        // SPARQL
        // socket.post(
        //     '/sparql/query',
        //     {category: global.models.newP.get('title')}, 
        //     function (response) {
        //         console.log('Hits! ',response)
        //         response.results.bindings.forEach(function(row){
        //             console.log(row.r,row.p)
        //         })
        //     }
        // );
        this.render();
    },
    moveTo : function(e){
        // Init
        e.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        knowledge_id = e.target.getAttribute("data-knowledge-id");
        knowledgeToSet = this.knowledges.get(knowledge_id);
        
        knowledgeToSet.set({'tags':_.union(knowledgeToSet.get('tags'),[target])});
        knowledgeToSet.save();
        this.render();
    },
    removeFilter: function(e){
        e.preventDefault();
        this.filters.remove(this.filters.get(e.target.getAttribute('data-id-filter')));
    },
    addFilter: function(e){
        e.preventDefault();
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
        // this.knowledges.each(function(k){
        //     console.log(k.get('title'));
        //     console.log(k.get('tags'))
        // })
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
        leftPart_view = new categoriesList.Views.Main({
            className       : "small-2 medium-2 large-2 columns",
            knowledges:this.knowledges,
            poches:this.poches,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(leftPart_view.render().el);
        // Middle part
        middlePart_view = new category.Views.MiddlePart({
            notifications:this.notifications,
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
        this.modal_view.render();
        
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
          });

        $(document).foundation();

        return this;
    }
});
/***************************************/
