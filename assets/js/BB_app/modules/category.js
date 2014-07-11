/////////////////////////////////////////////////
var category = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.main = new this.Views.Main({
      project               : global.models.currentProject,
      knowledges            : global.collections.Knowledges,
      categories            : global.collections.Poches,
      user                  : global.models.current_user,
      users                 : global.collections.Users,
      links                 : global.collections.Links,
      eventAggregator       : global.eventAggregator,
    });   
    this.views.main.renderActionBar();
    this.views.main.render();
  }
};
/////////////////////////////////////////
category.Views.Knowledge = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledge     = json.knowledge;
        this.categoryTitle = json.categoryTitle;
        // Event
        global.eventAggregator.on(this.knowledge.get('id'),this.actualize,this);
        this.knowledge.on('change',this.render,this);
        // Templates
        this.template_list = _.template($('#category-knowledge-template').html());
    },
    events : {
        "click .Kselectable" : "setSelectedK",
    },
    setSelectedK : function(e){
        e.preventDefault();
        var k_id = e.target.getAttribute('data-model-id');
        var catg_origin = e.target.getAttribute('data-catg-origin').replace(/ /g, '');
        k = category.views.main.knowledges.get(k_id);
        if(category.views.main.Kselected.where({id : k_id}).length > 0){
            console.log("unselect")
            category.views.main.Kselected.remove(k);
            $(this.el).find("#bulle"+k_id+"_"+catg_origin).css("background-color","");            
        }else{
            k.set({category_origin : catg_origin});
            category.views.main.Kselected.add(k);
            $(this.el).find("#bulle"+k_id+"_"+catg_origin).css("background-color","#bababa");  
        }
        console.log('knowledges selected:',category.views.main.Kselected);
    },
    actualize : function(k){
        this.knowledge.set(k);
    },
    render:function(){
        $(this.el).empty();
        var nbre_notifs = 0;
        try{nbre_notifs = global.ModelsNotificationsDictionary[this.knowledge.get('id')].news.length;}catch(err){console.error(err);}
        $(this.el).html(this.template_list({
            nbre_notifs     : nbre_notifs,
            knowledge       : this.knowledge.toJSON(),
            categoryTitle   : this.categoryTitle
        }));
        return this;
    }
});
/////////////////////////////////////////
category.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.category           = json.category;
        // Templates
        this.template_poche = _.template($('#category-poche-template').html());
        // Event
        global.eventAggregator.on(this.category.get('id'),this.actualize,this);
        //this.category.on('change',this.render,this);
    },
    actualize : function(c){
        this.category.set(c);
        //this.render();
    },
    render:function(){
        $(this.el).empty();
        _this = this;
        // Creation de l'item category vide
       $(this.el).html(this.template_poche({
            notifs_nbr      : global.ModelsNotificationsDictionary[this.category.get('id')].news.length,
            category        : this.category.toJSON(),
        }));
        // On lui ajoute les objects knowledges
        this.knowledges.each(function(knowledge){
            _this.$("#poche"+_this.category.get('id')+"container").append(new category.Views.Knowledge({
                knowledge : knowledge,
                categoryTitle : _this.category.get('title')
            }).render().el);   
        });
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });
        return this;
    }
});
/***************************************/
category.Views.Categories = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.categories         = json.categories;
        // Events
        this.listenTo(global.eventAggregator,"knowledge:create",this.rt_addKnowledge,this);
        this.listenTo(global.eventAggregator,"knowledge:remove",this.rt_removeKnowledge,this);
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "dblclick .openKnowledgeModal"  : "openKnowledgeModal",
        "click .openCategoryModal"  : "openCategoryModal",
    },
    rt_removeKnowledge : function(knowledge){
        // Create the knowledge (sign with category if categories are in context)
        category.views.main.knowledges.remove(knowledge);
    },
    rt_addKnowledge : function(knowledge){
        // Create the knowledge (sign with category if categories are in context)
        category.views.main.knowledges.add(knowledge);
    },
    openKnowledgeModal : function(e){
        e.preventDefault();
        category.views.k_cklayout_modal.openModelEditorModal(e.target.getAttribute("data-model-id"));
    },
    openCategoryModal : function(e){
        e.preventDefault();
        category.views.c_cklayout_modal.openModelEditorModal(e.target.getAttribute("data-model-id"));
    },
    addKnowledge : function(e){
        e.preventDefault()
        catg_id = e.target.getAttribute('data-id-category')
        categories_ = [e.target.getAttribute('data-title-category')];
        // Create the knowledge (sign with category if categories are in context)
        newK = new global.Models.Knowledge({
            id    :guid(),
            user  : category.views.main.user,
            title : $(this.el).find('#category_new_k_title_'+catg_id).val(),
            top   : 550,
            left  : 550,
            //content : CKEDITOR.instances.new_k_content.getData(),
            tags: categories_,
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        // Save the new knowledge
        newK.save();
        category.views.main.knowledges.add(newK);
    },
    render:function(){
        $(this.el).empty();
        //init
        _this = this;
        ////////////////////////////
        // Knowledge not categorized
        template = this.template_notCategorized;
        this.knowledges.each(function(k){
            if(k.get('tags').length == 0){
                $(_this.el).append(new category.Views.Knowledge({
                    className : "item",
                    knowledge : k,
                    categoryTitle : "none"
                }).render().el);
            }
        });
        ////////////////////////////
        // Build the dictionary k-catg
        dictionary = {};
        this.categories.each(function(category){
            dictionary[category.get('title')] = {"model":category,"knowledges":[]};
        })
        this.knowledges.each(function(k){
            k.get('tags').forEach(function(tag){
                try{
                    dictionary[tag].knowledges = _.union(dictionary[tag].knowledges,[k])    
                }catch(e){
                    console.log(tag," doesn't exit anymore")
                }
                
            });
        });
        // Category
        for(var key in dictionary){
            if((category.views.main.filters.length == 0)||((category.views.main.filters.length > 0)&&(dictionary[key].knowledges.length > 0))){
                $(_this.el).append(new category.Views.Category({
                    knowledges          : new Backbone.Collection(dictionary[key].knowledges),
                    category            : dictionary[key].model
                }).render().el);
            }
        }

        return this;
    }
});
/////////////////////////////////////////
category.Views.ActionBar = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.categories = json.categories; 
         
        // Templates
        this.template = _.template($('#category-actionBar-template').html());
        this.template_filters = _.template($('#category-filters-template').html());
    },
    events : {
        "click .remove" : "removeKselected",
        "click .newUnlinkedK" : "newUnlinkedK",
        "click .uncategorized" : "uncategorized",
        "click .copy" : "copyTo",
        "click .move" : "moveTo",
        "click .addFilter" : "addFilter",
        "click .changeFilterMode" : "changeFilterMode",
        "click .removeFilter" : "removeFilter",
    },
    removeFilter : function(e){
        e.preventDefault();
        console.log(category.views.main.filters)
        category.views.main.filters.remove(e.target.getAttribute('data-filter-id'));
    },
    changeFilterMode : function(e){
        e.preventDefault();
        category.views.main.filterMode.set({mode : e.target.getAttribute('data-filter-mode')});
    },
    addFilter : function(e){
        e.preventDefault();
        type = e.target.getAttribute('data-filter-type');
        val = e.target.getAttribute('data-filter-val');
        f = new global.Models.Filter();  
        if(type == 'user'){
            f.set({id : guid(),type : type,model :  category.views.main.users.get(val)});
        }else if(type == 'category'){
            f.set({id : guid(),type : type,model :  category.views.main.categories.get(val)});
        }else{
            f.set({id : guid(),type : type,model : val});
        }
        category.views.main.filters.add(f);
        console.log("filters : ",category.views.main.filters)
    },
    copyTo : function(e){
        e.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        if(confirm(category.views.main.Kselected.length+" knowledges will be duplicated into "+target+" catgory, would you continue?")){
            category.views.main.Kselected.each(function(model){
                model.set({'tags':_.union(model.get('tags'),[target])}).save();
            });
        }
        category.views.main.eventAggregator.trigger("categories_list_render");
    },
    moveTo : function(e){
        // Init
        e.preventDefault();
        target = e.target.getAttribute("data-catg-title");
        if(confirm(category.views.main.Kselected.length+" knowledges will be moved to "+target+" catgory, would you continue?")){
            category.views.main.Kselected.each(function(model){
                if(model.get('category_origin') != "none"){
                    // Si la K est dans une category on supprime le tag correspondant
                    model.set({'tags': _.without(model.get('tags'),model.get('category_origin'))});
                }
                // Dans tous les cas on ajoute le nouveau tag et on sauvegarde le model
                model.set({'tags':_.union(model.get('tags'),[target])}).save();
            }); 
        }

        category.views.main.eventAggregator.trigger("categories_list_render");
    },
    uncategorized : function(e){
        e.preventDefault();
        if(confirm(category.views.main.Kselected.length+" knowledges will be uncategorized and all instances of this knowledge will also be uncategorized, would you continue?")){
            category.views.main.Kselected.each(function(k){
                k.set({tags : []}).save();
            });
        }
        category.views.main.eventAggregator.trigger("categories_list_render");
    },
    removeKselected : function(e){
        e.preventDefault();
        if(confirm(category.views.main.Kselected.length+" knowledges will be remove, would you continue?")){
            modelsToDestroy = new Backbone.Collection();
            category.views.main.Kselected.each(function(model){
                if(model.get('tags').length == 0){
                    // Si la K n'est pas categorized on la supprime
                    modelsToDestroy.add(model);
                }else if(model.get('tags').length == 1){
                    // Si la K est dans une seul category on la supprime
                    modelsToDestroy.add(model);
                }else if(model.get('tags').length > 1){
                    // Si la K est dans not categorized + dans une categorie ou dans 2 categories en mm temps on supprime juste le tag
                    model.set({tags : _.without(model.get('tags'),model.get('category_origin'))}).save();
                }
            }); 
            // Puis on supprime un a un avec la une boucle while pour ne pas en supprimer que un sur deux
            while (model = modelsToDestroy.first()) {
                model.destroy();
            }

            category.views.main.eventAggregator.trigger("categories_list_render");
        }
    },
    newUnlinkedK : function(e){
        e.preventDefault();
        // Create the knowledge
        newK = new global.Models.Knowledge({
            id:guid(),
            user: category.views.main.user,
            top : 550,
            left : 550,
            title : $(this.el).find('#category_new_unlinked_k_title').val(),
            tags: [],
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        // Save the new knowledge
        newK.save();
        category.views.main.knowledges.add(newK);
        category.views.main.ks_to_render = category.views.main.knowledges;
        category.views.main.render();
    },
    render : function(){
        $(this.el).empty();
        // Add ActionBar
        $(this.el).append(this.template({
            categories : this.categories.toJSON(),
            users : category.views.main.users.toJSON()
        }));
        // Custom filters before send to the template
        filters_custom = new Backbone.Collection();
        category.views.main.filters.each(function(filter){
            if(filter.get('type') == 'user') filters_custom.add(new Backbone.Model({id:filter.get('id'),title:filter.get('model').get('name')}));
            else if(filter.get('type') == 'category') filters_custom.add(new Backbone.Model({id:filter.get('id'),title:filter.get('model').get('title')}));
            else filters_custom.add(new Backbone.Model({id:filter.get('id'),title:filter.get('model')}));
        });
        if(category.views.main.filters.length > 0) $(this.el).append(this.template_filters({filters_custom : filters_custom.toJSON()}));

        return this;
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
category.Views.Main = Backbone.View.extend({
    el:"#category_container",
    initialize : function(json) {
        _.bindAll(this, 'render',"newCategory");
        // Elements
        this.bar_el = $(this.el).find('#category-actionBar');
        this.grid_el = $(this.el).find('#category-grid');
        // Variables
        this.knowledges         = json.knowledges;
        this.ks_to_render       = this.knowledges;
        this.categories         = json.categories;
        this.project            = json.project;
        this.links              = json.links;
        this.user               = json.user;
        this.users              = json.users;
        this.filters            = new Backbone.Collection();
        this.eventAggregator    = json.eventAggregator;
        this.Kselected          = new Backbone.Collection();  
        this.filterMode         = new Backbone.Model({mode : "and"}) ;   
        // CKLayout for knowledge 
        category.views.k_cklayout_modal = new CKLayout.Views.Modal({
            user : this.user,
            collection : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        // CKLayout for category
        category.views.c_cklayout_modal = new CKLayout.Views.Modal({
            user : this.user,
            collection : this.categories,
            eventAggregator : this.eventAggregator
        });
        // Events
        this.listenTo(this.filterMode,"change",this.globalRender);  
        
        this.listenTo(this.filters,"add",this.globalRender);  
        this.listenTo(this.filters,"remove",this.globalRender);

        this.knowledges.on("add", this.render,this);
        //this.knowledges.on("remove", this.render,this);

        this.categories.on('add',this.globalRender,this);
        this.categories.on('remove',this.globalRender,this);
        //this.categories.on('change',this.render,this);
        this.eventAggregator.on('categories_list_render', this.globalRender, this);
        this.eventAggregator.on('knowledge_search', this.actualize, this);

        
    },
    events : {
        "click .newCategory" : "newCategory",
        "click .Kselectable" : "setSelectedK",
        "keyup .search" : "search",
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.knowledges.each(function(k){
            if(research.toLowerCase() == k.get('title').substr(0,research_size).toLowerCase()){
                matched.add(k);
            }
        });
        this.ks_to_render = matched;
        this.render();
    },
    // setSelectedK : function(e){
    //     e.preventDefault();
    //     k_id = e.target.getAttribute('data-model-id');
    //     k = this.knowledges.get(k_id);
    //     if(this.Kselected.where({id : k_id}).length > 0){
    //         this.Kselected.remove(k);
    //         $(e.target).prop('checked',false);
    //         $(this.el).find("#bulle"+k_id).css("background-color","");            
    //     }else{
    //         k.set({category_origin : e.target.getAttribute('data-catg-origin')});
    //         this.Kselected.add(k);
    //         $(e.target).prop('checked',true);
    //         $(this.el).find("#bulle"+k_id).css("background-color","#bababa");            
    //     }
    // },
    newCategory : function(e){
        e.preventDefault();
        global.models.newP = new global.Models.Poche({
            id: guid(),
            project: this.project.get('id'),
            tags: [],
            title: $(this.el).find(".category_title").val(),
            user : this.user,
            attachment: [],
            comments: new Backbone.Collection(),
            content: "",
            date : getDate(),
            date2:new Date().getTime()

        });
        global.models.newP.save();
        this.categories.add(global.models.newP);
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
        
        //this.render();
    },
    ///////////////////////////////////////////////////////
    applyFilter : function(){
        _this = this;
        var ks_cloned = global.Functions.cloneCollection(this.ks_to_render);

        this.filters.each(function(f){
            if(f.get('type') == "concept"){        ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByConcept(ks_cloned,_this.links,f));}
            if(f.get('type') == "project"){        ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByProject(ks_cloned,f));}
            if(f.get('type') == "category"){       ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByPoche(ks_cloned,_this.links,f));}
            if(f.get('type') == "user"){           ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByExpert(ks_cloned,_this.links,f));}
            if(f.get('type') == "state"){          ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByState(ks_cloned,_this.links,f));}
            if(f.get('type') == "notLinked"){      ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByNotLinked(ks_cloned,_this.links));}
            if(f.get('type') == "notCategorised"){ ks_cloned = _this.applyFilterMode(ks_cloned,_this.filterByNotCategorised(ks_cloned,_this.links));}
        });
        return ks_cloned;
    },
    applyFilterMode : function(old_collection,last_collection){
        var new_collection = new Backbone.Collection();
        var mode = this.filterMode.get('mode');
        // Si il n'y a q'un filtre on applique le mode "and"
        if(this.filters.length > 1){
            if(mode == "and"){
                new_collection = last_collection;
            }else if(mode == "or"){
                old_array = old_collection.toArray();
                last_array = last_collection.toArray();
                new_array = _.uniq(old_array,last_array);
                new_collection.add(new_array);
            }    
        }else{
            new_collection = last_collection;
        }
        
        return new_collection;
    },
    filterByNotLinked : function(ks,links){
        var list_to_remove = [];
        ks.each(function(k){
            links.filter(function(link){
                if(link.get('knowledge') == k.get('id')){
                    list_to_remove.unshift(k);
                }
            });  
        }); 
        list_to_remove.forEach(function(k){
            ks.remove(k);
        });
        return ks;
    },
    filterByNotCategorised : function(ks,links){
        var list_to_remove = [];
        ks.each(function(k){
            if(k.get('tags').length > 0){
                list_to_remove.unshift(k);
            }   
        });
        list_to_remove.forEach(function(k){
            ks.remove(k);
        });
        return ks;
    },
    filterByPoche : function(ks,links,f){
        var ks_filtered = new Backbone.Collection();
        ks.each(function(k){
            if(_.indexOf(k.get('tags'),f.get('model').get('title')) != -1) ks_filtered.add(k);
        });
        return ks_filtered;
    },
    filterByExpert : function(ks,links,f){
        var ks_filtered = new global.Collections.Knowledges();
        ks.each(function(k){
            console.log(k.attributes)
            if(k.get('user').id == f.get('model').get('id')){
                ks_filtered.add(k);
                return false;
            }
        });
        return ks_filtered;
    },
    filterByState : function(ks,links,f){
        var ks_filtered = new global.Collections.Knowledges();
        ks.each(function(k){
            if(k.get('color') == f.get('model')){
                ks_filtered.add(k);
                return false;
            } 
        });
        return ks_filtered;
    },
    ///////////////////////////////////////////////////////
    formatGrid : function(){
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });
    },
    globalRender : function(){
        this.renderActionBar();
        this.render();
    },
    renderActionBar : function(){
        this.bar_el.empty();
        // Action Bar
        category.views.actionBar = new category.Views.ActionBar({
            categories : this.categories,
        });
        this.bar_el.append(category.views.actionBar.render().el);
    },
    render : function(){
        this.grid_el.empty();
        // init
        this.Kselected.reset();
        // Apply filters
        var knows = new Backbone.Collection();
        if(this.filters.length == 0){
            knows = this.ks_to_render;
        }else{
            knows = this.applyFilter();
        }
        // Category de cards
        lists_view = new category.Views.Categories({
            id                  : "categories_grid",
            className           : "panel expand gridalicious",
            knowledges          : knows,
            categories          : this.categories
        });
        $(this.grid_el).append(lists_view.render().el);
        
        this.formatGrid();

        return this;
    }
});
/***************************************/
