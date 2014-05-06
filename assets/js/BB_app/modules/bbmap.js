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
    events : {
        "click .editContent" : "editContent",
        "click .linkCK" : "linkCK"
    },
    editContent : function(e){
        e.preventDefault();
        bbmap.views.main.eventAggregator.trigger('openModelEditorModal',this.concept.get('id'));
    },
    linkCK : function(e){
        e.preventDefault();
        bbmap.views.main.eventAggregator.trigger('openCKLinkModal',this.concept.get('id'));
    },
    addEndpoint : function(){
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
    },
    addLink : function(){
        // Add Link
        if((this.concept.get('id_father')) && (this.concept.get('id_father') != "none")){
            try{
                bbmap.views.main.instance.connect({uuids:[this.concept.get('id_father')+"-bottom", this.concept.get('id')+"-top" ]}); 
            }catch(err){
                console.log(err);
            }  
        }
        
        // Enable drag&drop
        bbmap.views.main.instance.draggable($(this.el));  
    },
    makeSource : function(){
        ///////////////////////
        // make el a source  
        bbmap.views.main.instance.makeSource(this.concept.get('id'), {
            filter:".ep",
            anchor:"Continuous",
            Connector : [ "Bezier", { curviness:50 } ]
        });
        ///////////////////////
        // initialise as connection target.
        bbmap.views.main.instance.makeTarget(this.concept.get('id'), {
            dropOptions:{ hoverClass:"dragHover" },
            anchor:"Continuous"             
        });
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.concept.get('title'))
        $(this.el).append('<div class="ep"></div>')
        $(this.el).append('<div class="editContent">edit</div>')
        $(this.el).append('<div class="linkCK">link</div>')

        return this;
    }
});
/***************************************/
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        // Variables
        this.notifications      = json.notifications;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.project            = json.project;
        this.poches             = json.poches;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        this.mode               = "normal";
        ////////////////////////////
        // CKLayout
        conceptsmap.views.cklayout = new CKLayout.Views.Modal({
            notifications : this.notifications,
            user : this.user,
            collection : this.concepts,
            eventAggregator : this.eventAggregator
        });
        ////////////////////////////
        // CKLinks
        conceptsmap.views.cklink = new cklink.Views.Modal({
            knowledges : this.knowledges,
            poches : this.poches,
            concepts : this.concepts,
            links : this.links,
            eventAggregator : this.eventAggregator
        });
        ////////////////////////////
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
        ////////////////////////////
        // Events
        this.listenTo(this.notifications,'change',this.actualizeNotification,this);
        this.listenTo(this.notifications,'add',this.actualizeNotification,this);
        this.listenTo(this.notifications,'remove',this.actualizeNotification,this);     
    },
    events : {
        "click .addUnlinked" : "addUnlinkedConcept",
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
        this.concepts.add(new_concept);

        new_view = new bbmap.Views.Child({
            className : "window",
            id : new_concept.get('id'),
            concept : new_concept
        });

        $(_this.el).append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeSource();

    },
    jsPlumbEventsInit : function(){
        ///////////////////////
        // init
        _this = this;
        instance = _this.instance;
        var windows = jsPlumb.getSelector(".chart-demo .window");
        ///////////////////////
        // Add child
        this.instance.bind("endpointClick", function(endpoint, originalEvent){
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
            _this.concepts.add(new_concept);

            new_view = new bbmap.Views.Child({
                className : "window",
                id : new_concept.get('id'),
                concept : new_concept
            });

            $(_this.el).append(new_view.render().el);
            
            new_view.addEndpoint();
            new_view.addLink();
            new_view.makeSource();

        });
        ///////////////////////
        // Remove link process        
        this.instance.bind("beforeDetach", function(conn) {
            var resp = confirm("Delete connection?");
            if(resp == true) _this.concepts.get(conn.targetId).set({id_father : "none"}).save();
            return resp;
        });
        this.instance.bind("click", function(conn) {
            instance.detach(conn);
        });
        ///////////////////////
        // New link process
        this.instance.bind("beforeDrop", function(conn) {
            if(_this.concepts.get(conn.targetId).get('id_father') != "none"){
                alert("This concept already has a parent, please remove the old relationship before assign a new parent");
                return false;
            }else{
                return true;
            }
        });
        this.instance.bind("connection", function(info, originalEvent) {
            _this.concepts.get(info.targetId).set({id_father : info.sourceId}).save();
        });
        ///////////////////////
        // Enable drag&drop
        this.instance.draggable(windows);        
    },
    render : function(){
        ///////////////////////
        // Init
        $(this.el).empty();
        _this = this;
        $(this.el).append('<a href="#" class="tiny button secondary addUnlinked">Add a unlinked concept</a>')
        views = [];
        ///////////////////////
        // Views creation process
        this.concepts.each(function(concept){
            views.unshift(new bbmap.Views.Child({
                className : "window",
                id : concept.get('id'),
                concept : concept
            }));
        });
        ///////////////////////
        // Views render process
        views.forEach(function(view){
            $(_this.el).append(view.render().el);
        });

        //jsPlumb.doWhileSuspended(function() {
            ///////////////////////
            // Views addEndPoint process
            views.forEach(function(view){
                view.addEndpoint();
            })
            ///////////////////////
            // Views addEndLink process
            views.forEach(function(view){
                view.addLink();
            })
            ///////////////////////
            // Views addEndLink process
            views.forEach(function(view){
                view.makeSource();
            })
            ///////////////////////
            // Initialize jsPlumb events
            this.jsPlumbEventsInit();
        //}, true);

        return this;
    }
});
