/////////////////////////////////////////
// Middle Part
/////////////////////////////////////////
category.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.category           = json.category;
        // Templates
        this.template_list = _.template($('#category-list-template').html());
    },
    render:function(){
        $(this.el).html('');
        _this = this;
        // Category template
        $(this.el).html(this.template_list({
            notifs_nbr      : category.views.main.dic_notifs[this.category.get('id')].news.length,
            dic_notifs    : category.views.main.dic_notifs,
            knowledges      : this.knowledges.toJSON(), 
            category        : this.category.toJSON(),
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
        this.categories         = json.categories;
        // Templates
        this.template_notCategorized = _.template($('#category-notCategorized-template').html());
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "click .openKnowledgeModal"  : "openKnowledgeModal",
        "click .openCategoryModal"  : "openCategoryModal",
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
        $(this.el).html('');
        //init
        _this = this;
        ////////////////////////////
        // Knowledge not categorized
        template = this.template_notCategorized;
        this.knowledges.each(function(k){
            if(k.get('tags').length == 0){
                $(_this.el).append(template({
                    notifs_nbr    : category.views.main.dic_notifs[k.get('id')].news.length,
                    knowledge     : k.toJSON()
                }));
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
                dictionary[tag].knowledges = _.union(dictionary[tag].knowledges,[k])
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
        "click .removeFilter" : "removeFilter",
    },
    removeFilter : function(e){
        e.preventDefault();
        console.log(category.views.main.filters)
        category.views.main.filters.remove(e.target.getAttribute('data-filter-id'));
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
        console.log(category.views.main.filters);
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
        // Variables
        this.all_notifs         = json.all_notifs;
        this.dic_notifs         = json.dic_notifs;
        this.knowledges         = json.knowledges;
        this.categories         = json.categories;
        this.project            = json.project;
        this.links              = json.links;
        this.user               = json.user;
        this.users              = json.users;
        this.filters            = new Backbone.Collection();
        this.eventAggregator    = json.eventAggregator;
        this.Kselected          = new Backbone.Collection();     
        // CKLayout for knowledge 
        category.views.k_cklayout_modal = new CKLayout.Views.Modal({
            all_notifs : this.all_notifs, // Le déclancheur pour le real time
            dic_notifs : this.dic_notifs, // Le dictionnaire des notifications
            user : this.user,
            collection : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        // CKLayout for category
        category.views.c_cklayout_modal = new CKLayout.Views.Modal({
            all_notifs : this.all_notifs, // Le déclancheur pour le real time
            dic_notifs : this.dic_notifs, // Le dictionnaire des notifications
            user : this.user,
            collection : this.categories,
            eventAggregator : this.eventAggregator
        });
        // Events
        this.listenTo(this.filters,"add",this.render);  
        this.listenTo(this.filters,"remove",this.render);                  
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);
        this.categories.on('remove',this.render,this);
        this.categories.on('change',this.render,this);
        this.eventAggregator.on('categories_list_render', this.render, this);
    },
    events : {
        "click .newCategory" : "newCategory",
        "click .Kselectable" : "setSelectedK"
    },
    setSelectedK : function(e){
        e.preventDefault();
        k_id = e.target.getAttribute('data-knowledge-id');
        k = this.knowledges.get(k_id);
        if(this.Kselected.where({id : k_id}).length > 0){
            this.Kselected.remove(k);
            $(e.target).prop('checked',false);
            $(this.el).find("#bulle"+k_id).css("background-color","");            
        }else{
            k.set({category_origin : e.target.getAttribute('data-catg-origin')});
            this.Kselected.add(k);
            $(e.target).prop('checked',true);
            $(this.el).find("#bulle"+k_id).css("background-color","#bababa");            
        }
    },
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
        this.render();
    },
    ///////////////////////////////////////////////////////
    applyFilter : function(){
        _this = this;
        var ks = new global.Collections.Knowledges();
        this.knowledges.each(function(k){ks.add(k)});

        this.filters.each(function(f){
            if(f.get('type') == "concept"){        _this.filterByConcept(ks,_this.links,f);}
            if(f.get('type') == "project"){        _this.filterByProject(ks,f);}
            if(f.get('type') == "category"){       _this.filterByPoche(ks,_this.links,f);}
            if(f.get('type') == "user"){           _this.filterByExpert(ks,_this.links,f);}
            if(f.get('type') == "state"){          _this.filterByState(ks,_this.links,f);}
            if(f.get('type') == "notLinked"){      _this.filterByNotLinked(ks,_this.links);}
            if(f.get('type') == "notCategorised"){ _this.filterByNotCategorised(ks,_this.links);}
        });
        return ks;
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
    },
    filterByPoche : function(ks,links,f){
        var ks_filtered = [];
        ks.each(function(k){
            if(_.indexOf(k.get('tags'),f.get('model').get('title')) != -1) ks_filtered.unshift(k);
        });
        ks.reset();
        ks.add(ks_filtered);
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
        ks = ks_filtered;
    },
    filterByState : function(ks,links,f){
        var ks_filtered = new global.Collections.Knowledges();
        ks.each(function(k){
            if(k.get('color') == f.get('model')){
                ks_filtered.add(k);
                return false;
            } 
        });
        ks = ks_filtered;
    },
    ///////////////////////////////////////////////////////
    render : function(){
        $(this.el).html("");
        // init
        this.Kselected.reset();
        // Apply filters
        if(this.filters.length == 0){
            ks = this.knowledges;
        }else{
            ks = this.applyFilter();
        }
        // Action Bar
        category.views.actionBar = new category.Views.ActionBar({
            categories : this.categories,
        });
        $(this.el).append(category.views.actionBar.render().el);
        // Category de cards
        lists_view = new category.Views.Categories({
            id                  : "categories_grid",
            className           : "panel expand gridalicious",
            knowledges          : ks,
            categories          : this.categories
        });
        $(this.el).append(lists_view.render().el);
        
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });

        return this;
    }
});
/***************************************/
