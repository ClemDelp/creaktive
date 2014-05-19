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
            //console.log(notification.get('to').id," ",_this.poche.get('id'))
            if(notification.get('to').id == _this.poche.get('id')){_notifNbr = _notifNbr+1;}
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
        _.bindAll(this, 'render',"openModal");
        // Variable
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        this.template_notCategorized = _.template($('#category-notCategorized-template').html());
    },
    events : {
        "click .addKnowledge" : "addKnowledge",
        "click .openModal"  : "openModal"
    },
    openModal : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openModelEditorModal',e.target.getAttribute("data-model-id"));
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
    },
    render:function(){
        $(this.el).html('');
        //init
        _this = this;
        // Build the dictionary k-catg
        dictionary = {};
        this.poches.each(function(poche){
            dictionary[poche.get('title')] = {"model":poche,"knowledges":[]};
        })
        this.knowledges.each(function(k){
            k.get('tags').forEach(function(tag){
                dictionary[tag].knowledges = _.union(dictionary[tag].knowledges,[k])
            });
        });
        for(var key in dictionary){
            $(_this.el).append(new category.Views.Category({
                notifications   : _this.notifications,
                knowledges      : new Backbone.Collection(dictionary[key].knowledges),
                poche           : dictionary[key].model,
                poches          : _this.poches,
                user            : _this.user,
                eventAggregator : _this.eventAggregator
            }).render().el);
        }
        // Knowledge not categorized
        template = this.template_notCategorized;
        this.knowledges.each(function(knowledge_){
            if(knowledge_.get('tags').length == 0){
                console.log(_this.template_notCategorized)
                $(_this.el).append(template({
                    knowledge : knowledge_.toJSON()
                }));
            }
        });
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
        this.mode = "move";
        // Events
        this.eventAggregator.on("openMoveCopyModal", this.openModal);
        // Templates
        this.template_modal = _.template($('#category-modal-template').html()); 
    },
    events: {
        "click .move" : "moveTo",
        "click .copy" : "copyTo",
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
    openModal : function(mode){
        this.mode = mode;
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
            poches : this.poches.toJSON(),
            mode : this.mode
        }));
        // Render it in our div
        if(callback) callback();
    }
});
/////////////////////////////////////////
// Main
/////////////////////////////////////////
category.Views.ActionBar = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;   
        // Templates
        this.template = _.template($('#category-actionBar-template').html());
    },
    events : {
        "click .remove" : "removeKselected",
        "click .newUnlinkedK" : "newUnlinkedK",
        "click .openMoveModal" : "openMoveModal",
        "click .openCopyModal" : "openCopyModal",
        "click .uncategorized" : "uncategorized"
    },
    uncategorized : function(e){
        e.preventDefault();
        if(confirm(category.views.main.Kselected.length+" knowledges will be uncategorized, would you continue?")){
            category.views.main.Kselected.each(function(k){
                k.set({tags : []}).save();
            });
        }
    },
    openMoveModal : function(e){
        e.preventDefault();
        category.views.main.eventAggregator.trigger("openMoveCopyModal","move");
    },
    openCopyModal : function(e){
        e.preventDefault();
        category.views.main.eventAggregator.trigger("openMoveCopyModal","copy");
    },
    removeKselected : function(e){
        e.preventDefault();
        if(confirm(category.views.main.Kselected.length+" knowledges will be remove, would you continue?")){
            while (model = category.views.main.Kselected.first()) {
                model.destroy();
            }
        }
    },
    newUnlinkedK : function(e){
        e.preventDefault();
        // Create the knowledge
        newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
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
        $(this.el).html('');
        // Add ActionBar
        $(this.el).append(this.template({
            poches : this.poches.toJSON()
        }));

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
        this.all_notifications  = json.a_notifications;
        this.cat_notifications  = json.c_notifications;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.project            = json.project;
        this.user               = json.user;

        this.eventAggregator    = json.eventAggregator;
        this.Kselected          = new Backbone.Collection();
        // Modals
        this.modal_view = new category.Views.Modal({
            poches: this.poches,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        this.CKLayoutModal_view = new CKLayout.Views.Modal({
            notifications : this.all_notifications,
            user : this.user,
            collection : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        // Events                 
        this.cat_notifications.bind("reset", this.render);

        this.knowledges.bind("add", this.render);
        this.knowledges.bind("change", this.render);
        this.knowledges.bind("remove", this.render);

        this.poches.on('remove',this.render,this)
        this.poches.on('change',this.render,this)
        this.eventAggregator.on('categories_list_render', this.render, this);

    },
    events : {
        "click .newCategory" : "newCategory",
        "click .Kselectable" : "setSelectedK"
    },
    setSelectedK : function(e){
        e.preventDefault();
        if(this.Kselected.where({id : e.target.getAttribute('data-knowledge-id')}).length > 0){
            this.Kselected.remove(this.knowledges.get(e.target.getAttribute('data-knowledge-id')))
            $(e.target).addClass("secondary");
        }else{
            this.Kselected.add(this.knowledges.get(e.target.getAttribute('data-knowledge-id')))
            $(e.target).removeClass("secondary")
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
    render : function(){
        $(this.el).html("");
        // init
        
        // Action Bar
        category.views.actionBar = new category.Views.ActionBar({
            poches : this.poches,
        });
        $(this.el).append(category.views.actionBar.render().el);
        // Category de cards
        lists_view = new category.Views.Categories({
            id              : "categories_grid",
            className       : "panel expand gridalicious",
            notifications   : this.cat_notifications,
            knowledges      : this.knowledges,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
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
