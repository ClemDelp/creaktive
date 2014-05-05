/***************************************/
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
    savePosition: function(){
        this.concept.set({
            top:$(this.el).position().top,
            left:$(this.el).position().left
        }).save();
    },
    events : {},
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.concept.get('title'))

        return this;
    }
});
/***************************************/
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','jsPlumb_init');
        // Variables
        this.concepts = json.concepts;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // JsPlumb
        this.color = "gray";
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:2 },
            EndpointStyle : { radius:9, fillStyle:this.color },
            HoverPaintStyle : {strokeStyle:"#ec9f2e" },
            EndpointHoverStyle : {fillStyle:"#ec9f2e" },
            Container:"bbmap_container",
            ConnectionOverlays : [
                [ "Arrow", { 
                    location:1,
                    id:"arrow",
                    length:14,
                    foldback:0.8
                } ],
                [ "Label", { label:"x", id:"label", cssClass:"aLabel" }]
            ]
        });
        // Events
        
        // Templates
        
    },
    events : {

    },
    jsPlumb_init : function(){
        
        _this = this;
        // suspend drawing and initialise.
        this.instance.doWhileSuspended(function() {      
            instance = _this.instance;

            // add endpoints, giving them a UUID.
            // you DO NOT NEED to use this method. You can use your library's selector method.
            // the jsPlumb demos use it so that the code can be shared between all three libraries.
            var windows = jsPlumb.getSelector(".chart-demo .window");
            for (var i = 0; i < windows.length; i++) {
                _this.instance.addEndpoint(windows[i], {
                    uuid:windows[i].getAttribute("id") + "-bottom",
                    anchor:"Bottom",
                    maxConnections:-1
                });
                _this.instance.addEndpoint(windows[i], {
                    uuid:windows[i].getAttribute("id") + "-top",
                    anchor:"Top",
                    maxConnections:-1
                });
            }

            
            _this.concepts.each(function(concept){
                console.log(concept.get('id_father'))
                if((concept.get('id_father')) && (concept.get('id_father') != "none")){
                  instance.connect({uuids:["chartWindow"+concept.get('id_father')+"-bottom", "chartWindow"+concept.get('id')+"-top" ]});  
                } 
            });
            
            // bind click listener; delete connections on click         
            instance.bind("click", function(conn) {
                instance.detach(conn);
            });
            
            // bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
            // will be prompted to confirm deletion.
            instance.bind("beforeDetach", function(conn) {
                return confirm("Delete connection?");
            });
            

            _this.instance.draggable(windows);        
        });
    },
    render : function(){
        $(this.el).empty();
        _this = this;
        this.concepts.each(function(concept){
            $(_this.el).append(new bbmap.Views.Child({
                className : "window",
                id : "chartWindow"+concept.get('id'),
                concept : concept
            }).render().el);
        });
        this.jsPlumb_init();

        return this;
    }
});
/***************************************/