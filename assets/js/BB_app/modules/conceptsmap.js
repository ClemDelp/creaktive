/////////////////////////////////////////
// Main
/////////////////////////////////////////
conceptsmap.Views.Main = Backbone.View.extend({
    el:"#conceptsmap_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.project            = json.project;
        this.poches             = json.poches;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;

        // Modals
        this.CKLayoutModal_view = new CKLayout.Views.Modal({
            notifications : this.notifications,
            type : "concept",
            user : this.user,
            concepts : this.concepts,
            eventAggregator : this.eventAggregator
        });

        this.CKLinkModal_view = new cklink.Views.Modal({
            knowledges : this.knowledges,
            poches : this.poches,
            concepts : this.concepts,
            links : this.links,
            eventAggregator : this.eventAggregator
        })


        // Backbone events              
        this.concepts.bind("reset", this.render);
        this.notifications.on('reset',this.actualizeNotification,this)
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);
        
        // CKLayout events
        this.eventAggregator.on("colorChanged", this.resetMap, this);
        this.eventAggregator.on("titleChanged", this.resetMap, this);
        this.eventAggregator.on("removeKnowledge", this.resetMap, this);
        
        // My-mind events
        this.eventAggregator.on('change',this.action,this);
        this.eventAggregator.on("undo", this.performUndo, this);

        this.template = _.template($("#conceptsmap_template").html()); 
    },
    events : {
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
    actualizeNotification : function(){
        _this = this;
        concept_notifs = {};
        this.notifications.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){
                if(notif.get('object') == "Concept"){
                    if(concept_notifs[notif.get('to')]){ 
                        concept_notifs[notif.get('to')] = concept_notifs[notif.get('to')]+1;
                    }else{
                        concept_notifs[notif.get('to')] = 1;
                    } 
                } 
            }
        });
        _.keys(concept_notifs).forEach(function(key){
            $("#concept_notif_"+key).append('<span class="top-bar-unread">'+concept_notifs[key]+'</span>')
        }) 
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
        this.eventAggregator.trigger('add_button')
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
        if (actions instanceof MM.Action.InsertNewItem){
            new_c = new global.Models.ConceptModel({
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
                attachment:[]
            });
            new_c.save();
            this.concepts.add(new_c);

        }
        else if (actions instanceof MM.Action.AppendItem){
            console.log(actions._parent,actions._item);
            var copy = this.concepts.findWhere({title : actions._item._dom.text.innerText})
            copy.set({
                id : actions._item._id,
                id_father : actions._parent._id,
                user: this.user,
            });
            copy.save();
            this.concepts.add(copy)
        }
        else if (actions instanceof MM.Action.MoveItem){ 
            console.log(actions._item, actions._newParent, actions._newIndex, actions._newSide);
            this.concepts.get(actions._item._id).set({'id_father':actions._newParent._id}).save();
        }
        else if (actions instanceof MM.Action.RemoveItem){ 
            _this = this;
            console.log(actions._item);
            this.concepts.get(actions._item._id).destroy(); 
            
            _.each(actions._item._children, function(child){
                _this.concepts.get(child._id).destroy(); 
            });
        }
        else if (actions instanceof MM.Action.SetColor){ 
            console.log(actions._item, actions._color);
            this.concepts.get(actions._item._id).set({'color':actions._color}).save();
        }
        //else if (actions instanceof MM.Action.SetLayout){console.log(actions._item, actions._layout);}
        //else if (actions instanceof MM.Action.SetShape){console.log(actions._item, actions._shape);}
        //else if (actions instanceof MM.Action.SetSide){ console.log(actions._item, actions._side);}
        //else if (actions instanceof MM.Action.SetStatus){console.log(actions._item, actions._status);}
        else if (actions instanceof MM.Action.SetText){ 
            console.log(actions._item, actions._text);
            this.concepts.get(actions._item._id).set({'title':actions._text}).save();
        }
        //else if (actions instanceof MM.Action.SetValue){ console.log(actions._item, actions._value);}

    },
    resetMap : function(){
        MM.App.init(_this.eventAggregator);
       socket.get("/concept/generateTree", function(data) {
            MM.App.setMap(MM.Map.fromJSON(data.tree));
        });   
    },
    render : function(){
        var _this = this;
        var renderTemplate = function(){
            var renderedContent = _this.template();
            $(_this.el).append(renderedContent)
        };
        var initMap = function(){
            MM.App.init(_this.eventAggregator);

            socket.get("/concept/generateTree", function(data) {
                MM.App.setMap(MM.Map.fromJSON(data.tree));
            });   
        }

        var dfd = $.Deferred();
        dfd.done(renderTemplate).done(initMap);
        dfd.resolve();
        
        $(document).foundation();

        return this;
    }
});
/***************************************/
