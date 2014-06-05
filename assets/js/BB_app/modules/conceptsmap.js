/////////////////////////////////////////
// Modals Part
/////////////////////////////////////////
conceptsmap.Views.ConceptsModal = Backbone.View.extend({
    el:"#conceptsmap_conceptsListModal_container",
    initialize:function(json){
        _.bindAll(this, 'render', 'openConceptsMappingModal',"linkCtoC");
        // Variables
        this.concepts = json.concepts;
        this.concept  = new Backbone.Model();
        this.eventAggregator = json.eventAggregator;
        // Events
        this.listenTo(this.eventAggregator,"openConceptsMappingModal", this.openConceptsMappingModal); 
    },
    events: {
        "click .action" : "linkCtoC"
    },
    linkCtoC : function(e){
        e.preventDefault();
        concept_child = this.concepts.get(e.target.getAttribute("data-id-from"));
        console.log(this.concepts,"    ", concept_child,"   ",e.target.getAttribute("data-id-from"))
        concept_child.set({id_father:e.target.getAttribute("data-id-to")});
        concept_child.save();
        this.eventAggregator.trigger('updateMap');
        $('#conceptsmap_conceptsListModal_container').foundation('reveal', 'close'); 
    },
    openConceptsMappingModal : function(concept){
        this.concept = concept;
        this.render(function(){
            $('#conceptsmap_conceptsListModal_container').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).empty();
        /////
        var c_categorized = new Backbone.Collection();
        this.concepts.each(function(concept){
            if(concept.get('id_father') != "none"){
                c_categorized.add(concept);
            }
        });
        ///
        if(nodesMapping.views.nodesMapping){
            nodesMapping.views.nodesMapping.remove();
        }
        ////
        nodesMapping.views.nodesMapping = new nodesMapping.Views.Main({
            model : this.concept,
            collection : c_categorized,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(nodesMapping.views.nodesMapping.render().el);

        // Render it in our div
        if(callback) callback();
    }
});
/////////////////////////////////////////
// Middle Part
/////////////////////////////////////////
// conceptsmap.Views.MiddlePart = Backbone.View.extend({
//     initialize : function(json) {
//         _.bindAll(this, 'render');
//         // Variables
//         this.notifications      = json.notifications;
//         this.concepts           = json.concepts;
//         this.user               = json.user;
//         this.eventAggregator    = json.eventAggregator;
//         // Backbone events              
//         this.concepts.bind("change",this.resetMap);
//         //this.concepts.bind("remove",this.resetMap);
//         // Events
//         this.listenTo(this.notifications,'change',this.actualizeNotification,this);
//         this.listenTo(this.notifications,'add',this.actualizeNotification,this);
//         this.listenTo(this.notifications,'remove',this.actualizeNotification,this);
//         this.listenTo(this.eventAggregator,'change',this.action,this);
//         this.listenTo(this.eventAggregator,"undo", this.performUndo, this);

//         this.template = _.template($("#conceptsmap_map_template").html());
//         // Style
//         //$(this.el).attr( "style","overflow:hidden")
//     },        
//     render : function(){
//         $(this.el).append(this.template());
//         return this;
//     }
// });
/////////////////////////////////////////
// Main
/////////////////////////////////////////
conceptsmap.Views.Main = Backbone.View.extend({
    el:"#conceptsmap_container",
    initialize : function(json) {
        _.bindAll(this, 'render','actualizeNotification','recursiveUnlink');
        // Variables
        this.all_notifs         = json.all_notifs;
        this.dic_notifs         = json.dic_notifs;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.project            = json.project;
        this.poches             = json.poches;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        ////////////////////////////
        // Concepts list modal
        if(conceptsmap.views.conceptsModal){
            conceptsmap.views.conceptsModal.remove();
        }
        conceptsmap.views.conceptsModal = new conceptsmap.Views.ConceptsModal({
            concepts : this.concepts,
            eventAggregator : this.eventAggregator
        });
        $("#"+conceptsmap.views.conceptsModal.el.id).on('close',this.againstFounderBug);
        // CKLayout
        conceptsmap.views.cklayout = new CKLayout.Views.Modal({
            all_notifs  : this.all_notifs, // Le déclancheur pour le real time
            dic_notifs  : this.dic_notifs, // Le dictionnaire des notifications
            user        : this.user,
            collection  : this.concepts,
            eventAggregator : this.eventAggregator
        });
        $("#"+conceptsmap.views.cklayout.el.id).on('close',this.againstFounderBug);
        // CKLinks
        conceptsmap.views.cklink = new cklink.Views.Modal({
            knowledges : this.knowledges,
            poches : this.poches,
            concepts : this.concepts,
            links : this.links,
            eventAggregator : this.eventAggregator
        });
        $("#"+conceptsmap.views.cklink.el.id).on('close',this.againstFounderBug);
        $("#helpModal").on('close',this.againstFounderBug);
        ////////////////////////////
        // Backbone events              
        //this.listenTo(this.concepts,"change",this.render);
        this.listenTo(this.concepts,"remove",this.resetMap);
        // Events
        // this.listenTo(this.all_notifs,'change',this.actualizeNotification,this);
        // this.listenTo(this.all_notifs,'add',this.actualizeNotification,this);
        // this.listenTo(this.all_notifs,'remove',this.actualizeNotification,this);
        this.eventAggregator.on('ModelsNotificationsDictionary',this.actualizeNotification,this);

        this.listenTo(this.eventAggregator,'change',this.action,this);
        this.listenTo(this.eventAggregator,"undo", this.performUndo, this);

        this.listenTo(this.eventAggregator, 'updateMap', this.resetMap, this);
        this.template = _.template($("#conceptsmap_map_template").html());
        this.template_actionsMap = _.template($("#conceptsmap_actionsMap_template").html());
    },
    events : {
        "click .unlink" : "unlinkConcept",
        "click .resetView" : "resetView",
        "click .scaleUp" : "scaleUp",
        "click .scaleDown" : "scaleDown",
        "click .addSubIdea" : "addSubIdea",
        "click .removeSubIdea" : "removeSubIdea",
        "click .undo" : "undo",
        "click .addUnlinked" : "addUnlinked",
        "click .editContent" : "editContent",
        "click .copy" : "copy",
        "click .cut" : "cut",
        "click .paste" : "paste",
        "click .linkK" : "linkK"
    },
    unlinkConcept : function(e){
        e.preventDefault();
        if (confirm("The children concepts will also be unlinked, do you want to continue?")) {
            conceptsToUnlink = [];
            this.recursiveUnlink(conceptsToUnlink,MM.App.current._id);
            conceptsToUnlink.forEach(function(concept){
                concept.set({id_father : "none"});
                concept.save();
            });
            this.eventAggregator.trigger('updateMap');
        }
    },
    recursiveUnlink : function(conceptsToUnlink,currentConceptId){
        conceptsToUnlink.unshift(this.concepts.get(currentConceptId));
        _this = this;
        this.concepts.where({id_father : currentConceptId}).forEach(function(concept){
            console.log(concept.get('title'));
            _this.recursiveUnlink(conceptsToUnlink,concept.get('id'));
        });
    },
    againstFounderBug : function(){
        MM.App.current.startEditing();
    },
    editContent : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openModelEditorModal',MM.App.current._id);
    },
    linkK : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openCKLinkModal',MM.App.current._id);
    },
    addUnlinked : function(e){
        e.preventDefault();
        var item = new MM.Item();
        item.setText("blabla");
        item.setLayout(MM.App.map._root.getLayout());
        MM.App.map._root.addUnlinked(item);
    },
    copy : function(e){
        e.preventDefault();
        MM.Clipboard.copy(MM.App.current);
    },
    cut : function(e){
        e.preventDefault();
        MM.Clipboard.cut(MM.App.current);
    },
    paste : function(e){
        e.preventDefault();
        MM.Clipboard.paste(MM.App.current);
    },
    performUndo : function(type, params){
        console.log("UNDO", type);       
        var item = params[0];
        if(type === "InsertNewItem"){
            this.concepts.get(item._id).destroy();      
        }
        else if (type === "MoveItem"){ 
            this.concepts.get(item._id).set({'id_father':params[1]}).save();
        }
        else if (type === "AppendItem"){
            this.concepts.get(item._id).destroy();  
        }
        else if (type === "RemoveItem"){ 
            _this = this;
            console.log(item._children)
            this.concepts.create({
                id:item._id,
                user: this.user,
                id_father : item._parent._id,
                title : item._dom.text.innerText,
                content : "",/*use for url post type*/
                tags : [],
                comments: [],
                date: getDate(),
                date2:new Date().getTime(),
                attachment: "",
                color: item._color || MM.Item.COLOR,
                members:[],
                attachment:[]
            });

            _.each(item._children, function(child){
                _this.concepts.create({
                    id:child._id,
                    user: _this.user,
                    id_father : child._parent._id,
                    title : child._dom.text.innerText,
                    content : "",/*use for url post type*/
                    tags : [],
                    comments: [],
                    date: getDate(),
                    date2:new Date().getTime(),
                    attachment: "",
                    color: child._color || MM.Item.COLOR,
                    members:[],
                    attachment:[]
                });
            });
        }
    },
    resetView : function(e){
       e.preventDefault();
       MM.App.map.center();
    },
    scaleUp : function(e){
       e.preventDefault();
       MM.App.adjustFontSize(1);
    },
    scaleDown : function(e){
        e.preventDefault();
        MM.App.adjustFontSize(-1);
    },
    addSubIdea : function(e){
        e.preventDefault();
        var item = MM.App.current;
        var action = new MM.Action.InsertNewItem(item, item.getChildren().length);
        MM.App.action(action);  
        MM.Command.Edit.execute();
        MM.publish("command-child");
    },
    removeSubIdea : function(e){
        e.preventDefault();
        var item = MM.App.current;
        var action = new MM.Action.RemoveItem(item, item.getChildren().length);
        MM.App.action(action);  
        MM.Command.Edit.execute();
        MM.publish("command-child");
    },
    undo : function(e){
        e.preventDefault();
        MM.App.history[MM.App.historyIndex-1].undo();
        MM.App.historyIndex--;
    },
    redo : function(e){
        e.preventDefault();
        MM.App.history[MM.App.historyIndex].perform();
        MM.App.historyIndex++;
    },
    action:function(actions){
        console.log("actions: ",actions);
        _this = this;
        if (actions instanceof MM.Action.InsertNewItem){
            this.concepts.create({
                id:actions._item._id,
                user: this.user,
                id_father : actions._parent._id,
                title : "",
                content : "",/*use for url post type*/
                tags : [],
                comments: [],
                date: getDate(),
                date2:new Date().getTime(),
                attachment: "",
                color: actions._item._color,
                members:[],
                attachment:[],
                siblingNumber : _this.concepts.where({id_father:actions._parent._id}).length +1
            },{silent:true});
        }
        else if (actions instanceof MM.Action.AppendItem){
            var copy = this.concepts.findWhere({title : actions._item._dom.text.innerText})
            copy.set({
                id : actions._item._id,
                id_father : actions._parent._id,
                user: this.user,
                siblingNumber : _this.concepts.where({id_father:actions._parent._id}).length +1
            });
            copy.save({silent:true});
            this.concepts.add(copy)
        }
        else if (actions instanceof MM.Action.MoveItem){ 
            this.concepts.get(actions._item._id).set({
                id_father:actions._newParent._id, 
                siblingNumber : _this.concepts.where({id_father:actions._newParent._id}).length +1
            }).save({silent:true});
        }
        else if (actions instanceof MM.Action.RemoveItem){ 
            _this = this;

            var concept = this.concepts.get(actions._item._id);
            var siblings = this.concepts.where({parent_id:concept.get("parent_id")})
            _.each(siblings, function(sibling){
                if(sibling.get("siblingNumber") > concept.get('siblingNumber')){
                    sibling.save({siblingNumber:sibling.get('siblingNumber')-1})
                }
            })
            

            concept.destroy({silent:true}); 
            
            _.each(actions._item._children, function(child){
                _this.concepts.get(child._id).destroy({silent:true}); 
            });
        }
        else if (actions instanceof MM.Action.SetColor){ 

            this.concepts.get(actions._item._id).set({'color':actions._color}).save({silent:true});
        }
        //else if (actions instanceof MM.Action.SetLayout){console.log(actions._item, actions._layout);}
        //else if (actions instanceof MM.Action.SetShape){console.log(actions._item, actions._shape);}
        //else if (actions instanceof MM.Action.SetSide){ console.log(actions._item, actions._side);}
        //else if (actions instanceof MM.Action.SetStatus){console.log(actions._item, actions._status);}
        else if (actions instanceof MM.Action.SetText){ 

            concept = this.concepts.get(actions._item._id).set({'title':actions._text}, {silent:true});
            concept.save({silent:true});
        }
        //else if (actions instanceof MM.Action.SetValue){ console.log(actions._item, actions._value);}

    },
    resetMap : function(model,collection,options){
            console.log("RESET ", options)
        // Si il n'y a pas d'options, c'est un élément renvoyé par le serveur via les sockets.

            MM.App.init(_this.eventAggregator);
            socket.get("/concept/generateTree", function(data) {
                MM.App.setMap(MM.Map.fromJSON(data.tree));
            });        
    },
    actualizeNotification : function(dic){
        if(dic)this.dic_notifs = dic;
        _this = this;
        this.concepts.each(function(concept){
            if(_this.dic_notifs[concept.get('id')].news.length > 0)$("#concept_notif_"+concept.get('id')).html('<span class="top-bar-unread">'+_this.dic_notifs[concept.get('id')].news.length+'</span>')
        })
        //MM.App.adjustFontSize(1);
    },
    render : function(){
        $(this.el).empty()
        var _this = this;
        // Left part
        $(this.el).append(this.template_actionsMap());
        // Middle part
        // if(conceptsmap.views.v){
        //     conceptsmap.views.v.remove();
        //     conceptsmap.views.v.undelegateEvents();
        //     conceptsmap.views.v.delegateEvents();
        // }
        // conceptsmap.views.v = new conceptsmap.Views.MiddlePart({
        //     className        : "panel large-12 medium-12 small-12 columns",
        //     notifications    : this.c_notifications,
        //     concepts         : this.concepts,
        //     user             : this.user,
        //     eventAggregator  : this.eventAggregator
        // });
        // $(this.el).append(conceptsmap.views.v.render().el);
            
        $(this.el).append(this.template());

        MM.App.init(this.eventAggregator);
        socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));
            _this.actualizeNotification(); 
        });
        
        
        
        $(document).foundation();
    }
});
/***************************************/
// render : function(){
//         var _this = this;
//         var renderTemplate = function(){
//             var renderedContent = _this.template();
//             $(_this.el).append(renderedContent)
//         };
//         var initMap = function(){
//             MM.App.init(_this.eventAggregator);

//             socket.get("/concept/generateTree", function(data) {
//                 MM.App.setMap(MM.Map.fromJSON(data.tree));
//             });   
//         }

//         var dfd = $.Deferred();
//         dfd.done(renderTemplate).done(initMap);
//         dfd.resolve();
        
//         $(document).foundation();

//         return this;
//     }