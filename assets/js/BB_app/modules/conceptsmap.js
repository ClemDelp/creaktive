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

        MM.App.init(this.eventAggregator);
    },
    action:function(actions,mapJson){
        console.log("actions: ",actions);
        if (actions instanceof MM.Action.InsertNewItem){
            new_c = new global.Models.ConceptModel({
                id:actions._item._id,
                user: this.user,
                parent_id : actions._parent._id,
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
            this.concepts.get(actions._item._id).set({'parent_id':actions._newParent._id}).save();
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

        //SAVE THE JSON PROJECT!!!!!!!!!
        this.project.set({'conceptsMapJson':mapJson}).save();
    },
    events : {

    },
    render : function(){
        $(this.el).html("");
        MM.App.setMap(MM.Map.fromJSON(this.project.get('conceptsMapJson')));

        $(document).foundation();

        return this;
    }
});
/***************************************/
