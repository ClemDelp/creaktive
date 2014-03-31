/////////////////////////////////////////
// Main
/////////////////////////////////////////
conceptsmap.Views.Main = Backbone.View.extend({
    el:"#conceptsmap_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.project            = json.project;
        this.eventAggregator    = json.eventAggregator;

        // Events                 
        this.concepts.bind("reset", this.render);
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);
        this.eventAggregator.on('change',this.action,this)

        this.template = _.template($("#conceptsmap_template").html()); 
    },
    events : {
        "click .resetView" : "resetView",
        "click .scaleUp" : "scaleUp",
        "click .scaleDown" : "scaleDown",
        "click .addSubIdea" : "addSubIdea",
        "click .removeSubIdea" : "removeSubIdea",
        "click .undo" : "undo",
        "click redo" : "redo",     
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
    action:function(actions,mapJson){
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
        //else if (actions instanceof MM.Action.AppendItem){console.log(actions._parent,actions._item);}
        else if (actions instanceof MM.Action.MoveItem){ 
            console.log(actions._item, actions._newParent, actions._newIndex, actions._newSide);
            this.concepts.get(actions._item._id).set({'id_father':actions._newParent._id}).save();
        }
        else if (actions instanceof MM.Action.RemoveItem){ 
            console.log(actions._item);
            this.concepts.get(actions._item._id).destroy(); 
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
    render : function(){
        var _this = this;
        var renderTemplate = function(){
            console.log("renderTemplate")
            var renderedContent = _this.template();
            $(_this.el).append(renderedContent)
        };
        var initMap = function(){
            console.log("initMap")
            MM.App.init(_this.eventAggregator);

            socket.get("/conceptmap/generateTree", function(data) {
                console.log(JSON.stringify(data.tree));
                MM.App.setMap(MM.Map.fromJSON(data.tree));
                MM.publish("load-done", this);
            });   
        }

        var dfd = $.Deferred();
        dfd.done(renderTemplate).done(initMap);

        dfd.resolve();

        // console.log("tutu")
        // var renderedContent = this.template();
        // $(this.el).append(renderedContent)


        $(document).foundation();


        return this;
    }
});
/***************************************/
