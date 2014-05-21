bbmap.Views.Child = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','editTitle','theHandler','addEndpoint','addLink','makeSource');
        // Variables
        this.concept = json.concept;
        this.endpoints = [];
        // Events
        $(this.el).click(this.savePosition)
        //style
        $(this.el).attr( "style","top: "+this.concept.get('top')+"px;left:"+this.concept.get('left')+"px");
        
    },
    savePosition: function(e){
        if(($(this.el).position().top != 0)&&($(this.el).position().left != 0)){
            // Si la view n'a pas été supprimée on save
            this.concept.set({
                top:$(this.el).position().top / bbmap.views.main.zoom,
                left:$(this.el).position().left / bbmap.views.main.zoom
            }).save();    
        }

        //console.log("offset : x"+$(this.el).offset().left+" - y"+$(this.el).offset().top)
        console.log("position : x"+this.concept.get('left')+" - y"+this.concept.get('top'))
    },
    events : {
        "dblclick .editTitle" : "editTitle",
        "keydown": "theHandler",
        "focusout" : "focusout",
        "click .sup" : "removeConcept"
    },
    removeConcept : function(e){
        e.preventDefault();
        concept = this.concept;
        if(confirm("this concept will be remove, would you continue?")){
            this.endpoints.forEach(function(ep){
                bbmap.views.main.instance.deleteEndpoint(ep);
            })
            bbmap.views.main.instance.detachAllConnections($(this.el));
            // put all the child node parent_id attributes to none
            childrens = bbmap.views.main.concepts.where({id_father : concept.get('id')})
            childrens.forEach(function(child){
                child.set({id_father : "none"}).save();
            })
            this.remove();
            // $(this.el).hide('slow');
            this.concept.destroy();
        }
    },
    focusout : function(e){
        bbmap.views.main.instance.toggleDraggable($(this.el));
        $(this.el).find(".editTitle").attr('contenteditable','false');
        this.concept.set({title:$(this.el).find(".editTitle").html()}).save();
    },
    theHandler : function(e){
        if(e.keyCode == 13){
            bbmap.views.main.instance.toggleDraggable($(this.el));
            $(this.el).find(".editTitle").attr('contenteditable','false');
            this.concept.set({title:$(this.el).find(".editTitle").html()}).save();
        }
    },
    editTitle : function(e){
        e.preventDefault();
        bbmap.views.main.instance.toggleDraggable($(this.el));
        $(this.el).find(".editTitle").attr('contenteditable','true');
    },
    addEndpoint : function(){
        // Add endpoints
        this.endpoints.unshift(bbmap.views.main.instance.addEndpoint($(this.el), {
            uuid:this.concept.get('id') + "-bottom",
            anchor:"Bottom",
            maxConnections:-1
        }));
        this.endpoints.unshift(bbmap.views.main.instance.addEndpoint($(this.el), {
            uuid:this.concept.get('id') + "-top",
            anchor:"Top",
            maxConnections:-1
        }));
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
        $(this.el).append('<span class="editTitle">'+this.concept.get('title')+'</span>');
        $(this.el).append('<div class="ep">-></div>')
        $(this.el).append('<div class="sup">x</div>')
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
        this.zoom               = 1;
        // Templates
        this.bar_el = $(this.el).find('#actionbar');
        this.map_el = $(this.el).find('#map');
        this.template_actionbar = _.template($('#bbmap-actionbar-template').html());
        ////////////////////////////
        // JsPlumb
        this.color = "gray";
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:1 },
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
            Container:"map"
        });  
        //this.instance.setSuspendDrawing(false,true);
        ////////////////////////////
        // Events
        this.listenTo(this.notifications,'change',this.actualizeNotification,this);
        this.listenTo(this.notifications,'add',this.actualizeNotification,this);
        this.listenTo(this.notifications,'remove',this.actualizeNotification,this);     
    },
    events : {
        "click .addUnlinked" : "addUnlinkedConcept",
        "click .zoomin" : "zoomin",
        "click .zoomout" : "zoomout",
    },
    zoomin : function(e){
        e.preventDefault();

        this.zoom = this.zoom - 0.1;
        this.setZoom(this.zoom);
    },
    zoomout : function(e){
        e.preventDefault();
        this.zoom = this.zoom + 0.1;
        this.setZoom(this.zoom);
    },
    setZoom : function(zoom) {
      transformOrigin = [ 0.5, 0.5 ];
      console.log(this.el)
      console.log(this.map_el[0])
      el = this.map_el[0];
      var p = [ "webkit", "moz", "ms", "o" ],
          s = "scale(" + zoom + ")",
          // oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
          oString = "0 0";

      for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
      }

      el.style["transform"] = s;
      el.style["transformOrigin"] = oString;

      this.instance.setZoom(zoom);    
    },
    addUnlinkedConcept : function(e){
        e.preventDefault();
        new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
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

        this.map_el.append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeSource();

    },
    jsPlumbEventsInit : function(){
        ///////////////////////
        // init
        _this = this;
        instance = _this.instance;
        //this.instance.unbind();
        var windows = jsPlumb.getSelector(".chart-demo .window");
        ///////////////////////
        // Add child
        this.instance.bind("endpointClick", function(endpoint, originalEvent){
            new_concept = new global.Models.ConceptModel({
                id : guid(),
                type : "concept",
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
            _this.map_el.append(new_view.render().el);
            
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
        //this.instance.draggable(windows);        
    },
    render : function(){
        ///////////////////////
        // Init
        _this = this;
        this.bar_el.empty();
        this.map_el.empty();
        views = [];
        ///////////////////////
        // Action bar
        this.bar_el.append(this.template_actionbar());
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
            _this.map_el.append(view.render().el);
        });
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

        return this;
    }
});


// window.setZoom = function(zoom, instance, transformOrigin, el) {
//   transformOrigin = transformOrigin || [ 0.5, 0.5 ];
//   el = el || instance.Defaults.Container;
//   var p = [ "webkit", "moz", "ms", "o" ],
//       s = "scale(" + zoom + ")",
//       oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

//   for (var i = 0; i < p.length; i++) {
//     el.style[p[i] + "Transform"] = s;
//     el.style[p[i] + "TransformOrigin"] = oString;
//   }

//   el.style["transform"] = s;
//   el.style["transformOrigin"] = oString;

//   instance.setZoom(zoom);    
// };