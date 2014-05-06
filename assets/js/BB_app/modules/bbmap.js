/***********************************/
bbmap.Views.Child = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition');
        // Variables
        this.concept = json.concept;
        // Events
        $(this.el).click(this.savePosition)
        // Templates

        //style
        $(this.el).attr( "style","top: "+this.concept.get('top')+"px;left:"+this.concept.get('left')+"px");
        
    },
    events : {},
    savePosition: function(){
        this.concept.set({
            top:$(this.el).position().top,
            left:$(this.el).position().left
        }).save();
    },
    events : {},
    addjsPlumb : function(){
        // Add endpoints
        bbmap.views.main.instance.addEndpoint($(this.el), {
            uuid:this.concept.get('id') + "-bottom",
            anchor:"Bottom",
            maxConnections:-1
        });
        bbmap.views.main.instance.addEndpoint($(this.el), {
            uuid:this.concept.get('id') + "-top",
            anchor:"Top",
            maxConnections:-1
        });
        // Add Link
        if((this.concept.get('id_father')) && (this.concept.get('id_father') != "none")){
            try{
                bbmap.views.main.instance.connect({uuids:[this.concept.get('id_father')+"-bottom", this.concept.get('id')+"-top" ]}); 
            }catch(err){
                console.log(err);
            }  
        }
        // make each ".ep" div a source and give it some parameters to work with.  
        bbmap.views.main.instance.makeSource($(this.el), {
            filter:".ep",
            anchor:"Continuous",
            Connector : [ "Bezier", { curviness:50 } ]
        });
        
        // initialise all '.window' elements as connection targets.
        // bbmap.views.main.instance.makeTarget($(this.el), {
        //     dropOptions:{ hoverClass:"dragHover" },
        //     anchor:"Continuous"             
        // }); 
        // Enable drag&drop
        bbmap.views.main.instance.draggable($(this.el));  
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.concept.get('title'))
        $(this.el).append('<div class="ep"></div>')

        return this;
    }
});
/***************************************/
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','jsPlumb_init');
        // Variables
        this.concepts = json.concepts;
        this.project = json.project;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // JsPlumb
        this.color = "gray";
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:2 },
            EndpointStyle : { radius:5, fillStyle:this.color },
            HoverPaintStyle : {strokeStyle:"#ec9f2e" },
            EndpointHoverStyle : {fillStyle:"#ec9f2e" },
            ConnectionOverlays : [
                [ "Arrow", { 
                    location:1,
                    id:"arrow",
                    length:14,
                    foldback:0.8
                } ],
                [ "Label", { label:"x", id:"label", cssClass:"aLabel" }]
            ],
            Container:"bbmap_container"
        });
        // Events
        
        // Templates
        
    },
    events : {
        "click .addUnlinked" : "addUnlinkedConcept"
    },
    addUnlinkedConcept : function(e){
        e.preventDefault();

        new_concept = new global.Models.ConceptModel({
            id : guid(),
            id_father: "none",
            project: this.project.get('id'),
            title: "new concept",
            user: this.user
        });
        new_concept.save();

        new_view = new bbmap.Views.Child({
            className : "window",
            id : new_concept.get('id'),
            concept : new_concept
        });

        $(_this.el).append(new_view.render().el);
        new_view.addjsPlumb();
        //this.jsPlumb_init();
        //jsPlumb.draggable($(".window"));

    },
    
    jsPlumb_init : function(){
        _this = this;
        // suspend drawing and initialise.
        this.instance.doWhileSuspended(function() {      
            // init
            instance = _this.instance;
            var windows = jsPlumb.getSelector(".chart-demo .window");
            
            // add endpoints, giving them a UUID.
            for (var i = 0; i < windows.length; i++) {
                console.log(windows[i])
                instance.addEndpoint(windows[i], {
                    uuid:windows[i].getAttribute("id") + "-bottom",
                    anchor:"Bottom",
                    maxConnections:-1
                });
                instance.addEndpoint(windows[i], {
                    uuid:windows[i].getAttribute("id") + "-top",
                    anchor:"Top",
                    maxConnections:-1
                });
            }

            // Draw links
            _this.concepts.each(function(concept){
                if((concept.get('id_father')) && (concept.get('id_father') != "none")){
                    try{
                        instance.connect({uuids:[concept.get('id_father')+"-bottom", concept.get('id')+"-top" ]}); 
                    }catch(err){
                        console.log(err);
                    }  
                } 
            });
            
            // Add child
            instance.bind("endpointClick", function(endpoint, originalEvent){
                new_concept = new global.Models.ConceptModel({
                    id : guid(),
                    id_father: endpoint.elementId,
                    top : $("#"+endpoint.elementId).position().top + 50,
                    left : $("#"+endpoint.elementId).position().left,
                    project: _this.project.get('id'),
                    title: "new concept",
                    user: _this.user
                });
                new_concept.save();

                new_view = new bbmap.Views.Child({
                    className : "window",
                    id : new_concept.get('id'),
                    concept : new_concept
                });

                $(_this.el).append(new_view.render().el);
                new_view.addjsPlumb();

            });

            // Remove link process        
            instance.bind("beforeDetach", function(conn) {
                var resp = confirm("Delete connection?");
                if(resp == true) _this.concepts.get(conn.targetId).set({id_father : "none"}).save();
                return resp;
            });
            instance.bind("click", function(conn) {
                instance.detach(conn);
            });

            // New link process
            instance.bind("beforeDrop", function(conn) {
                if(_this.concepts.get(conn.targetId).get('id_father') != "none"){
                    alert("This concept already has a parent, please remove the old relationship before assign a new parent");
                    return false;
                }else{
                    return true;
                }
            });

            instance.bind("connection", function(info, originalEvent) {
                _this.concepts.get(info.targetId).set({id_father : info.sourceId}).save();
            });
            
            // Enable drag&drop
            _this.instance.draggable(windows);        

            // make each ".ep" div a source and give it some parameters to work with.  
            instance.makeSource(windows, {
                filter:".ep",
                anchor:"Continuous",
                Connector : [ "Bezier", { curviness:50 } ]
            });
            
            // initialise all '.window' elements as connection targets.
            instance.makeTarget(windows, {
                dropOptions:{ hoverClass:"dragHover" },
                anchor:"Continuous"             
            });

        });
    },
    render : function(){
        $(this.el).empty();
        _this = this;
        $(this.el).append('<a href="#" class="tiny button secondary addUnlinked">Add a unlinked concept</a>')
        this.concepts.each(function(concept){
            $(_this.el).append(new bbmap.Views.Child({
                className : "window",
                id : concept.get('id'),
                concept : concept
            }).render().el);
        });
        this.jsPlumb_init();

        return this;
    }
});
/***********************************/