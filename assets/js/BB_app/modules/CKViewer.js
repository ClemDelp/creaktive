/////////////////////////////////////////////////
var CKViewer = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({
        backups : global.collections.Backups,
        project           : global.models.currentProject,
        links : global.collections.Links,
        knowledges : global.collections.Knowledges,
        concepts : global.collections.Concepts,
        eventAggregator : global.eventAggregator,
        poches : global.collections.Poches,
        user : global.models.current_user,
    });   
    this.views.main.renderActionbar();
    this.views.main.render();
  }
};
////////////////////////////////////////////////////////////
// VIEWS
CKViewer.Views.Modal = Backbone.View.extend({
    el:"#ckviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.model = new Backbone.Model();
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_content = _.template($('#CKViewer_modalContent_templates').html());
        // Events
        this.eventAggregator.on("openModal", this.openModal, this);
    },
    openModal : function(model){
        this.model = model;
        this.render(function(){
            $('#ckviewerModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html(''); 
        $(this.el).append(this.template_content({
            knowledge : this.model.toJSON()
        }));
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
CKViewer.Views.Category = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.user               = json.user;
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.poche              = json.poche;
        this.eventAggregator    = json.eventAggregator;
        // Templates
        this.template_list = _.template($('#CKViewer_knowledgesmap_template').html());
    },
    render:function(){
        $(this.el).html('');
        _this = this;
        // Category template
        $(this.el).html(this.template_list({
            knowledges : this.knowledges.toJSON(), 
            category : this.poche.toJSON(),
            categories : this.poches.toJSON()
        }));
        return this;
    }
});
/***************************************/
CKViewer.Views.Categories = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variable
        this.knowledges         = json.knowledges;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
    },

    render:function(){
        $(this.el).html('');
        //init
        knowledges = this.knowledges;
        user = this.user;
        poches = this.poches;
        el = this.el;
        eventAggregator_ = this.eventAggregator;
        // For each poches
        notcategorized_view = new CKViewer.Views.NotCategorized({
            knowledges:this.knowledges,
            eventAggregator:this.eventAggregator
        });
        $(this.el).append(notcategorized_view.render().el);
        
        this.poches.each(function(poche){
            list_of_knowledges = new Backbone.Collection();
            this.knowledges.each(function(knowledge){
                knowledge.get('tags').forEach(function(tag){
                    if(poche.get('title') == tag){list_of_knowledges.add(knowledge);}
                });
            });
            if(list_of_knowledges.length){
            list_view = new CKViewer.Views.Category({
                knowledges      : list_of_knowledges,
                poche           : poche,
                poches          : poches,
                user            : user,
                eventAggregator : eventAggregator_
            });
            $(this.el).append(list_view.render().el);}
        });
        
        

        return this;
    }
});
/***************************************/
CKViewer.Views.NotCategorized = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.knowledges_render = this.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($('#CKViewer-notcategorized-template').html());
    },

    render : function(){
        // Init
        $(this.el).html('');
        el_notcategorized_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // For each poche
         this.knowledges_render.each(function(knowledge_){
             if(knowledge_.get('tags').length == 0){
                 $(el_notcategorized_part).append(template({
                     knowledge : knowledge_.toJSON(),
                 }));
             }
         });
        return this;
    }
});
/***************************************/
CKViewer.Views.KnowledgesMap = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.links = json.links;
        this.knowledges = json.knowledges;
        this.knowledges_to_render = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.user = json.user;
        this.project = json.project;
        // Templates
        this.eventAggregator.on("selectK",this.filterKnowledge,this);
        this.eventAggregator.on("resetK",this.allknowledges,this);
    },
    events : {
        "dblclick .openModal" : "openModal",
    },
    filterKnowledge : function(concept_id){
        _this = this;
        var klinks = new Backbone.Collection;
        if(modflag){
            var links= _.filter(this.links.toJSON(), function(model){
             return model.concept==concept_id;
            });
            _.each(links, function(model){
                k1 = _this.knowledges.get(model.knowledge);
                klinks.add(k1);
            });
        }else{
            var j;
            for(j=0;j<concept_id.length;j++){
                var links= _.filter(this.links.toJSON(), function(model){
                    return model.concept==concept_id[j];
                });
                _.each(links, function(model){
                    k1 = _this.knowledges.get(model.knowledge);
                    klinks.add(k1);
                });
            }
        }
        this.knowledges_to_render=klinks;
        this.render();
    },
    allknowledges : function(){
        this.knowledges_to_render=this.knowledges;
        this.render();
    },
    openModal : function(e){
        e.preventDefault();
        knowledge = this.knowledges.get(e.target.getAttribute("data-knowledge-id"));
        if(!knowledge){knowledge = this.poches.get(e.target.getAttribute("data-category-id"));}
        this.eventAggregator.trigger("openModal",knowledge);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(_.template($("#CKViewer-Khead-template").html())({project: this.project}));
        lists_view = new CKViewer.Views.Categories({
            id              : "categories_grid",
            className       : "row  custom_row gridalicious",
            knowledges      : this.knowledges_to_render,
            poches          : this.poches,
            user            : this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(lists_view.render().el);
        $("#categories_grid").gridalicious({
             gutter: 10,
             width: 150
           });
        return this;
    }
});
/////////////////////////////////////////
CKViewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($("#CKViewer_action_template").html()); 
    },
    events : {
        "click #allknowledges" : "resetK",
        "click #allconcepts" : "resetC",
        "click #all" : "resetAll",
        "click #level" : "chooselevel",
        "click #mod1" : "mod1",
        "click #mod2" : "mod2"
    },
    mod1 : function(e){
        e.preventDefault;
        if(!modflag){
            $("#mod2").removeClass('disabled');
            $("#mod1").addClass('disabled');
            modflag=true;
        }
    },
    mod2 : function(e){
        e.preventDefault;
        if(modflag){
            $("#mod1").removeClass('disabled');
            $("#mod2").addClass('disabled');
            modflag=false;
        }
    },
    resetAll : function(e){
        e.preventDefault;
        this.eventAggregator.trigger("resetAll");
    },
    resetC : function(e){
        e.preventDefault;
        MM.App.expandall(MM.App.map.getRoot());
    },
    resetK : function(e){
        e.preventDefault();
        this.eventAggregator.trigger("resetK");
    },
    chooselevel : function(e){
        e.preventDefault();
        var l=e.target.getAttribute("level");
        MM.App.levelcollapse(MM.App.map.getRoot(),l);
    },
    render : function(){
        $(this.el).append(this.template());
        return this;
    }
});


/////////////////////////////////////////
CKViewer.Views.MiddlePart = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.links = json.links;
        this.eventAggregator = json.eventAggregator;  
        this.poches = json.poches;
        this.user = json.user;
        this.project = json.project;
    },
    render : function(){
        
        // Concepts map
        if(CKViewer.views.conceptsmap){CKViewer.views.conceptsmap.remove();}
        CKViewer.views.conceptsmap = new CKViewer.Views.ConceptsMap({
            className        : "large-7 medium-7 small-7 columns",
            id               : "conceptes",
            eventAggregator  : this.eventAggregator,
            concepts         : this.concepts
        });
        $(this.el).append(CKViewer.views.conceptsmap.render().el);

        // Knowledge map
        if(CKViewer.views.knowledgesmap){CKViewer.views.knowledgesmap.remove();}
        CKViewer.views.knowledgesmap = new CKViewer.Views.KnowledgesMap({
            className        : "large-5 medium-5 small-5 columns",
            links            : this.links,
            knowledges       : this.knowledges,
            eventAggregator  : this.eventAggregator,
            poches           : this.poches,
            user             : this.user,
            project          : this.project
        });
        $(this.el).append(CKViewer.views.knowledgesmap.render().el);

        return this;
    }
});
/////////////////////////////////////////

/////////////////////////////////////////
CKViewer.Views.ConceptsMap = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.concepts = json.concepts;
        // Templates
        this.template = _.template($("#CKViewer_conceptsmap_template").html()); 
    },
    events : {
        "dblclick .text" : "openModal",
        "click .text" : "select",
    },
    select : function(e){
        e.preventDefault();
        if(modflag){this.eventAggregator.trigger("selectK",e.target.getAttribute("id_c"));}
        else{
            var item = MM.App.map.getItemFor(e.target);
            var list_of_ids = new Array();
            list_of_ids.push(item.getId());
            while(!item.isRoot()){
                item=item.getParent();
                list_of_ids.push(item.getId());
            }
            this.eventAggregator.trigger("selectK",list_of_ids);
        }       
    },
    openModal : function(e){
        e.preventDefault();
        concept = this.concepts.get(e.target.getAttribute("id_c"));
        this.eventAggregator.trigger("openModal",concept);
    },
    render : function(){
        $(this.el).append(this.template());
        return this;
    }
});
/////////////////////////////////////////
// MAIN
/////////////////////////////////////////
CKViewer.Views.Main = Backbone.View.extend({
    el:"#ckviewer_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.bar_el = $(this.el).find('#ckviewer-actionBar');
        this.grid_el = $(this.el).find('#ckviewer-grid');
        this.backups = json.backups;
        this.project  = json.project;
        this.links = json.links;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.user = json.user;
        this.width = 0;
        this.deep = 0;
        // Modals
        if(CKViewer.views.modal){CKViewer.views.modal.remove();}
            CKViewer.views.modal = new CKViewer.Views.Modal({
            eventAggregator : this.eventAggregator
        });
        this.eventAggregator.on("resetAll", this.resetAll, this);
    },
    events : {

    },
    resetAll : function(){
        this.links = newCklinks;
        this.concepts = newConceptsTree;
        this.knowledges = newKnowledges;
        this.poches = newCategories;
        this.renderActionbar();
        iniflag = false;
        this.render();
    },
    reloadBackup : function(model){
        var backup_id = model.id;
        _this = this;
        //var backup_id = id;
        // Concept tree
        socket.post(
            '/backup/getData',
            {backup_id: backup_id}, 
            function (data) {
                var conceptsTree = data.conceptsTree;
                var knowledges = data.knowledges;
                var categories = data.categories;
                var cklinks = data.cklinks;
                //console.log("successs!",conceptsTree);
                // console.log("successs!",knowledges);
                // console.log("successs!",categories);
                // console.log("successs!",cklinks);
                _this.links = new global.Collections.CKLinks(cklinks);
                _this.concepts = conceptsTree;
                _this.knowledges = new global.Collections.Knowledges(knowledges);
                _this.poches = new global.Collections.Poches(categories);
                iniflag = false;
                _this.render();
            }
        );
    },
    renderActionbar : function(){
        this.bar_el.empty();
        //Action map
        if(CKViewer.views.actions_view){CKViewer.views.actions_view.remove();}
        CKViewer.views.actions_view = new CKViewer.Views.Actions({
            eventAggregator  : this.eventAggregator
        });
        $(this.el).append(CKViewer.views.actions_view.render().el);
        $('#datepicker').Zebra_DatePicker({
            //format: 'd/m/Y',
            onChange: function(view, elements) {
                if (view == 'days') {
                    elements.each(function() {
                        dateArr = $(this).data('date').split('-');
                        v1 = new Date(dateArr[0],(parseInt(dateArr[1])-1).toString(),dateArr[2]);
                        date = $(this);
                        CKViewer.views.main.backups.each(function(model) {
                            backupdateArr = model.attributes.date.split('-')[0].split('/');
                            v2 = new Date(backupdateArr[2],backupdateArr[1],backupdateArr[0]);
                            if((v2-v1)==0){
                                date.css({
                                    color:              'red'
                                });
                            }
                        });
                    });
                }
            },
            onSelect: function(date){
                dateArr = date.split('-');
                hasBackup = false;
                v1 = new Date(dateArr[0],(parseInt(dateArr[1])-1).toString(),dateArr[2]);
                CKViewer.views.main.backups.each(function(model) {
                    backupdateArr = model.attributes.date.split('-')[0].split('/');
                    v2 = new Date(backupdateArr[2],backupdateArr[1],backupdateArr[0]);
                    if((v2-v1)==0){
                        CKViewer.views.main.reloadBackup(model);
                        hasBackup  = true;
                    }
                });
                if(!hasBackup){
                    alert("No backup");
                }else{
                    hasBackup = true;
                }
            }
        });

    },
    render : function(){
        this.grid_el.empty();
        // Middle part
        // Concept map
        if(CKViewer.views.middle_part_view){CKViewer.views.middle_part_view.remove();}
        CKViewer.views.middle_part_view = new CKViewer.Views.MiddlePart({
            className        : "panel large-12 medium-12 small-12 columns",
            knowledges : this.knowledges,
            concepts : this.concepts,
            links : this.links,
            eventAggregator  : this.eventAggregator,
            poches : this.poches,
            user : this.user,
            project : this.project
        });
        $(this.el).append(CKViewer.views.middle_part_view.render().el);

        // Get Map and generate it

        if (iniflag) {
        MM.App.init(this.eventAggregator);
        socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));    

            this.width= MM.App.width;
            var frame=document.getElementById("main").offsetWidth;
            var scale=Math.floor(10*(frame/this.width))-10;
            MM.App.adjustFontSize1(scale);
            MM.App.map.center();
            while(MM.App.width>frame){
                MM.App.adjustFontSize1(-1);
                MM.App.map.center();
            }

            var s = (frame - $("canvas")[0].width)/2;
            $("#map.current")[0].style.left=s+"px";
            $("#map.current")[0].style.top="20px";

            this.deep=MM.App.deep(MM.Map.fromJSON(data.tree).getRoot());
            for(var i=1; i<this.deep; i++){
                document.getElementById("drop1").innerHTML += '<li>' + '<a id="level" href="#" level="' + i + '">' + 'Level' + i + '</a>' + '</li>';
            }

            document.getElementById("conceptes").style.overflow="hidden";

            newConceptsTree = data.tree;
            newLeft = s;
        });

            newKnowledges = this.knowledges;
            newCategories = this.poches;
            newCklinks = this.links;
        }else{
            MM.App.init(this.eventAggregator);
            MM.App.setMap(MM.Map.fromJSON(this.concepts));    
            var frame=document.getElementById("main").offsetWidth;

            MM.App.adjustFontSize1(0);
            if($("canvas")[0].width>frame){
                while($("canvas")[0].width>frame){
                    MM.App.adjustFontSize1(-1);
                    MM.App.map.center();
                }            
            }else{
                while($("canvas")[0].width<frame){
                    MM.App.adjustFontSize1(1);
                    MM.App.map.center();
                }
                MM.App.adjustFontSize1(-1);
                MM.App.map.center();
            }
            $("#map.current")[0].style.left=newLeft+"px";
            $("#map.current")[0].style.top="20px";



            this.deep=MM.App.deep(MM.Map.fromJSON(this.concepts).getRoot());
            for(var i=1; i<this.deep; i++){
                document.getElementById("drop1").innerHTML += '<li>' + '<a id="level" href="#" level="' + i + '">' + 'Level' + i + '</a>' + '</li>';
            }

            document.getElementById("conceptes").style.overflow="hidden";
        }


         $("#categories_grid").gridalicious({
             gutter: 10,
             width: 150
           });

        $(document).foundation();


    }
});
/***************************************/









