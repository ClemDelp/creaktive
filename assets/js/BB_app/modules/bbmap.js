bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','editTitle','addEndpoint','addLink','makeTarget');
        // Variables
        this.model = json.model;
        this.endpoints = [];
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change", this.render); 
        //style
        $(this.el).attr( "style","top: "+this.model.get('top')+"px;left:"+this.model.get('left')+"px");
        
    },
    savePosition: function(e){
        if(($(this.el).position().top != 0)&&($(this.el).position().left != 0)){
            // Si la view n'a pas été supprimée on save
            this.model.set({
                top:$(this.el).position().top / bbmap.views.main.zoom,
                left:$(this.el).position().left / bbmap.views.main.zoom
            }).save();    
        }

        //console.log("offset : x"+$(this.el).offset().left+" - y"+$(this.el).offset().top)
        console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
    },
    events : {
        "dblclick .editTitle" : "editTitle",
        "dblclick .content" : "editTitle",
        // "keydown": "theHandler",
        // "focusout" : "focusout",
        "click .sup" : "removeModel",
        "click .ep" : "addConceptChild",
        "click .ep2" : "addKnowledgeChild"
    },
    addConceptChild : function(e){
        e.preventDefault();
        new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.views.main.zoom,
            left : $(this.el).position().left / bbmap.views.main.zoom,
            project: bbmap.views.main.project.get('id'),
            title: "new concept",
            user: bbmap.views.main.user
        });
        new_concept.save();
        bbmap.views.main.concepts.add(new_concept);

        new_view = new bbmap.Views.Node({
            className : "window concept",
            id : new_concept.get('id'),
            model : new_concept,
        });
        bbmap.views.main.map_el.append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeTarget();
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.views.main.zoom,
            left : $(this.el).position().left / bbmap.views.main.zoom,
            project: bbmap.views.main.project.get('id'),
            title: "new knowledge",
            user: bbmap.views.main.user
        });
        new_knowledge.save();
        bbmap.views.main.knowledges.add(new_knowledge);

        new_view = new bbmap.Views.Node({
            className : "window knowledge",
            id : new_knowledge.get('id'),
            model : new_knowledge,
        });
        bbmap.views.main.map_el.append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeTarget();
    },
    removeModel : function(e){
        e.preventDefault();
        model = this.model;
        if(confirm("this "+model.get('type')+" will be remove, would you continue?")){
            this.endpoints.forEach(function(ep){
                bbmap.views.main.instance.deleteEndpoint(ep);
            })
            bbmap.views.main.instance.detachAllConnections($(this.el));
            // put all the child node parent_id attributes to none
            if(model.get('type') == 'concept'){
                childrens = bbmap.views.main.concepts.where({id_father : model.get('id')})
                childrens.forEach(function(child){
                    child.set({id_father : "none"}).save();
                });
            } 
            this.remove();
            // $(this.el).hide('slow');
            model.destroy();
        }
    },
    // focusout : function(e){
    //     bbmap.views.main.instance.toggleDraggable($(this.el));
    //     $(this.el).find(".editTitle").attr('contenteditable','false');
    //     this.model.set({title:$(this.el).find(".editTitle").html()}).save();
    // },
    // theHandler : function(e){
    //     if(e.keyCode == 13){
    //         bbmap.views.main.instance.toggleDraggable($(this.el));
    //         $(this.el).find(".editTitle").attr('contenteditable','false');
    //         this.model.set({title:$(this.el).find(".editTitle").html()}).save();
    //     }
    // },
    editTitle : function(e){
        e.preventDefault();
        bbmap.views.editBox.openEditBox(this.model.get('id'),this.model.get('type'));
        // bbmap.views.main.instance.toggleDraggable($(this.el));
        // $(this.el).find(".editTitle").attr('contenteditable','true');
    },
    addEndpoint : function(){
        // Add endpoints
        if(this.model.get('type') == 'concept'){
            this.endpoints.unshift(bbmap.views.main.instance.addEndpoint(
                $(this.el), {
                    uuid:this.model.get('id') + "-bottom",
                    anchor:"Bottom",
                    isSource:true,
                    maxConnections:-1
                }
            ));
            this.endpoints.unshift(bbmap.views.main.instance.addEndpoint($(this.el), {
                uuid:this.model.get('id') + "-top",
                anchor:"Top",
                maxConnections:-1
            }));
            this.endpoints.unshift(bbmap.views.main.instance.addEndpoint(
                $(this.el), 
                {
                    uuid:this.model.get('id') + "-right",
                    anchor:"Right",
                    isSource:true,
                    scope:"cTok",
                    maxConnections:-1
                },
                {
                    connectorStyle : { strokeStyle:"red", lineWidth:0.5,dashstyle:"2 2" },
                    endpoint:["Dot", { radius:5 }],
                    paintStyle:{ fillStyle:"red" },
                }
            ));
        }else if(this.model.get('type') == 'knowledge'){
            this.endpoints.unshift(bbmap.views.main.instance.addEndpoint(
                $(this.el), {
                    uuid:this.model.get('id') + "-left",
                    anchor:"Left",
                    maxConnections:-1
                },
                {
                    connectorStyle : { strokeStyle:"red", lineWidth:0.5,dashstyle:"2 2" },
                    endpoint:["Dot", { radius:5 }],
                    paintStyle:{ fillStyle:"red" },
                }
            ));
        }
        
    },
    addLink : function(){
        // Add Link
        if((this.model.get('id_father')) && (this.model.get('id_father') != "none")){
            try{
                if(this.model.get('type') == "concept"){
                    bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-bottom", this.model.get('id')+"-top" ]}); 
                }else if(this.model.get('type') == "knowledge"){
                    bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-right", this.model.get('id')+"-left" ]}); 
                }
            }catch(err){
                console.log(err);
            }  
        }   
        // Enable drag&drop
        //bbmap.views.main.instance.draggable($(this.el));  
    },
    makeTarget : function(){
        ///////////////////////
        // make el a source  
        // bbmap.views.main.instance.makeTarget(this.model.get('id'), {
        //     filter:".ep",
        //     anchor:"Continuous",
        //     Connector : [ "Bezier", { curviness:50 } ]
        // });
        ///////////////////////
        // initialise as connection target.
        if(this.model.get('type') == "concept"){
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                anchor:"Top"             
            });
        }else if(this.model.get('type') == "knowledge"){
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                scope:"cTok",
                anchor:"Left"             
            });
        }
        
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append('<span class="editTitle">'+this.model.get('title')+'</span>');
        $(this.el).append('<span class="content">'+this.model.get('content')+'</span>');
        if(this.model.get('type') == 'concept') $(this.el).append('<div class="ep">+</div>')
        if(this.model.get('type') == 'concept') $(this.el).append('<div class="ep2">+</div>')
        $(this.el).append('<div class="sup">x</div>')
        return this;
    }
});
/***************************************/
bbmap.Views.EditBox = Backbone.View.extend({
    initialize : function(e){
        _.bindAll(this, 'render','saveEdition');
        this.model = new Backbone.Model();
        $(this.el).dialog({autoOpen: false});
    },
    saveEdition : function(e){
        e.preventDefault();
        this.model.save({
            user : bbmap.views.main.user,
            title:this.editBox_el.find("#title").val(),
            content:CKEDITOR.instances.editor.getData(),
            date: getDate(),
            date2:new Date().getTime()
        });
        $(this.el).dialog( "close" );
    },
    openEditBox : function(id_model, type){
        _this = this;
        $(this.el).empty();
        if(type == "knowledge"){
            this.model = bbmap.views.main.knowledges.get(id_model);

        }else if(type == "concept"){
            this.model = bbmap.views.main.concepts.get(id_model);
        }
        this.render(function(){
            $(_this.el).dialog( "open" );
            CKEDITOR.replaceAll('ckeditor');
            CKEDITOR.config.toolbar = [
               ['Bold','Italic','Underline','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','Image','Table','-','Link','Smiley','TextColor','BGColor']
            ] ;
            // $( "#editBox" ).draggable();
        });
        
        $("#save").click(this.saveEdition)
    },
    render : function(callBack){
        $(this.el).empty();
        $(this.el).append('<input id="title" type="text" value="'+this.model.get("title")+'">');
        $(this.el).append('<textarea class="ckeditor"  name="editor" rows="10" cols="80">'+this.model.get('content')+'</textarea>');
        $(this.el).append('<br><a href="#" id="save" class="button tiny expand secondary" style="margin-bottom:0px">save</a>');
        callBack();
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
        this.color = "green";
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:1 },
            EndpointStyle : { radius:5, fillStyle:this.color },
            HoverPaintStyle : {strokeStyle:"#ec9f2e" },
            EndpointHoverStyle : {fillStyle:"#ec9f2e" },
            ConnectionOverlays : [
                // [ "Arrow", { 
                //     location:1,
                //     id:"arrow",
                //     length:14,
                //     foldback:0.8
                // } ],
                [ "Label", { label:"x", id:"label", cssClass:"aLabel" }]
            ],
            Container:"map"
        });  
        //this.instance.setSuspendDrawing(false,true);
        ////////////////////////////
        // Boite d'édition
        bbmap.views.editBox = new bbmap.Views.EditBox({el : "#editBox"});
        ////////////////////////////
        // Events
        this.listenTo(this.notifications,'change',this.actualizeNotification,this);
        this.listenTo(this.notifications,'add',this.actualizeNotification,this);
        this.listenTo(this.notifications,'remove',this.actualizeNotification,this);     
    },
    events : {
        "click .addUnlinkedC" : "addUnlinkedConcept",
        "click .addUnlinkedK" : "addUnlinkedKnowledge",
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
    addUnlinkedKnowledge : function(e){
        e.preventDefault();
        new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            id_father: "none",
            project: this.project.get('id'),
            title: "new knowledge",
            user: this.user
        });
        new_knowledge.save();
        this.knowledges.add(new_knowledge);

        new_view = new bbmap.Views.Node({
            className : "window knowledge",
            id : new_knowledge.get('id'),
            model : new_knowledge,
        });

        this.map_el.append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeTarget();
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

        new_view = new bbmap.Views.Node({
            className : "window concept",
            id : new_concept.get('id'),
            model : new_concept,
        });

        this.map_el.append(new_view.render().el);
        
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeTarget();

    },
    jsPlumbEventsInit : function(){
        ///////////////////////
        // init
        _this = this;
        instance = _this.instance;
        //this.instance.unbind();
        //var windows = jsPlumb.getSelector(".chart-demo .window");
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
            console.log('connection: ',info.connection.scope)
            if(info.connection.scope == "cTok"){
                _this.knowledges.get(info.targetId).set({id_father : info.sourceId}).save();
            }else{
                _this.concepts.get(info.targetId).set({id_father : info.sourceId}).save();
            }
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
        //this.map_el.empty();
        views = [];
        ///////////////////////
        // Action bar
        this.bar_el.append(this.template_actionbar());
        ///////////////////////
        // Concepts views
        this.concepts.each(function(concept){
            views.unshift(new bbmap.Views.Node({
                className : "window concept",
                id : concept.get('id'),
                model : concept,
            }));
        });
        // knowledges views
        this.knowledges.each(function(knowledge){
            views.unshift(new bbmap.Views.Node({
                className : "window knowledge",
                id : knowledge.get('id'),
                model : knowledge,
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
            view.makeTarget();
        })
        ///////////////////////
        // Initialize jsPlumb events
        this.jsPlumbEventsInit();
        $( "#map" ).draggable();
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