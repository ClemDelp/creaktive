bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','editTitle','addEndpoint','addLink','makeTarget');
        // Variables
        this.model = json.model;
        this.endpoints = []; 
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change", this.render); 
    },
    savePosition: function(e){
        if(($(this.el).position().top != 0)&&($(this.el).position().left != 0)){
            // Si la view n'a pas été supprimée on save
            this.model.set({
                top:$(this.el).position().top / bbmap.views.main.zoom.get('val'),
                left:$(this.el).position().left / bbmap.views.main.zoom.get('val')
            }).save();    
        }
        console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
    },
    events : {
        "dblclick .editTitle" : "editTitle",
        "dblclick .content" : "editTitle",
        "click .sup" : "removeModel",
        "click .ep" : "addConceptChild",
        "click .ep2" : "addKnowledgeChild",
        "click .ep3" : "reorganize",
    },
    reorganize : function(e){
        e.preventDefault();
        el_top = this.model.get('top');
        el_left = this.model.get('left');
        child_top = this.model.get('top') + 125;
        el_childs = bbmap.views.main.concepts.where({id_father : this.model.get('id')});
        nbr_childs = el_childs.length;
        max_width = 100; // max width per element
        space = 100;
        L_childs = (max_width + space) * nbr_childs;
        left_pos = (el_left + (max_width/2)) - (L_childs/2) + (space/2);
        console.log("L_childs: ",L_childs," - el_left: ",el_left," - left_pos: ",left_pos)
        // Set child position
        el_childs.forEach(function(el){
            el.set({top : child_top,left:left_pos}).save();
            left_pos = left_pos+max_width+space;
        });
        bbmap.views.main.reset();
    },
    addConceptChild : function(e){
        e.preventDefault();
        new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.views.main.zoom.get('val'),
            left : $(this.el).position().left / bbmap.views.main.zoom.get('val'),
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
        // On crée la K
        new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            //id_fathers: [this.model.get('id')],
            top : ($(this.el).position().top + 100) / bbmap.views.main.zoom.get('val'),
            left : $(this.el).position().left / bbmap.views.main.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new knowledge",
            user: bbmap.views.main.user
        });
        new_knowledge.save();
        // On l'ajoute à la collection
        bbmap.views.main.knowledges.add(new_knowledge);
        // On crée le link entre C et K
        new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user,
            date : getDate(),
            concept : this.model.get('id'),
            knowledge : new_knowledge.get('id')
        });
        new_cklink.save();
        // On ajoute le link à la collection
        bbmap.views.main.links.add(new_cklink);
        // On crée la vue
        new_view = new bbmap.Views.Node({
            className : "window knowledge",
            id : new_knowledge.get('id'),
            model : new_knowledge,
        });
        // On l'ajoute à la map
        bbmap.views.main.map_el.append(new_view.render().el);
        // Puis on ajoute les elements de la bulle
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
    editTitle : function(e){
        e.preventDefault();
        bbmap.views.editBox.openEditBox(this.model.get('id'),this.model.get('type'));
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
        _this = this;
        try{
            if((this.model.get('type') == "concept")&&(this.model.get('id_father')) && (this.model.get('id_father') != "none")){
                bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-bottom", this.model.get('id')+"-top" ]}); 
            }else if((this.model.get('type') == 'knowledge') && (bbmap.views.main.ckOperator == true)){
                // Get all CKLink 
                k_links = bbmap.views.main.links.where({knowledge : this.model.get('id')});
                k_links.forEach(function(link){
                    bbmap.views.main.instance.connect({uuids:[link.get('concept')+"-right", _this.model.get('id')+"-left" ]});     
                });         
            }
        }catch(err){
            console.log(err);
        }
        // Enable drag&drop
        bbmap.views.main.instance.draggable($(this.el));  
    },
    makeTarget : function(){
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
        //style
        $(this.el).attr( "style","top: "+this.model.get('top')+"px;left:"+this.model.get('left')+"px");
        // Init
        $(this.el).empty();
        $(this.el).append('<span class="editTitle">'+this.model.get('title')+'</span>');
        if((this.model.get('type') == "knowledge")&&(bbmap.views.main.KcontentVisibility == true))$(this.el).append('<span class="content">'+this.model.get('content')+'</span>');
        if((this.model.get('type') == "concept")&&(bbmap.views.main.CcontentVisibility == true))$(this.el).append('<span class="content">'+this.model.get('content')+'</span>');
        if(this.model.get('type') == 'concept') $(this.el).append('<div class="ep">+</div>')
        if(this.model.get('type') == 'concept') $(this.el).append('<div class="ep2">+</div>')
        if(this.model.get('type') == 'concept') $(this.el).append('<div class="ep3">*</div>')
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
            title:$(this.el).find("#title").val(),
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
        this.zoom               = new Backbone.Model({val : 1});
        this.KcontentVisibility = true;
        this.CcontentVisibility = false;
        this.ckOperator         = true;
        this.positionRef        = 550;
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
        ////////////////////////////
        // Boite d'édition
        bbmap.views.editBox = new bbmap.Views.EditBox({el : "#editBox"});
        ////////////////////////////
        // Events
        this.listenTo(this.zoom,'change',this.updateZoomDisplay,this)
        this.listenTo(this.notifications,'change',this.actualizeNotification,this);
        this.listenTo(this.notifications,'add',this.actualizeNotification,this);
        this.listenTo(this.notifications,'remove',this.actualizeNotification,this);     
    },
    events : {
        "click .addUnlinkedC" : "addUnlinkedConcept",
        "click .addUnlinkedK" : "addUnlinkedKnowledge",
        "click .Kcontent" : "setKcontentVisibility",
        "click .Ccontent" : "setCcontentVisibility",
        "click .ckOperator" : "setCKOperator",
        "click .zoomin" : "zoomin",
        "click .zoomout" : "zoomout",
        "click .resetZoom" : "resetZoom",
        "click .resetPosition" : "resetPosition",
        // "click .reorganize" : "reorganize",
    },
    updateZoomDisplay : function(){
        this.bar_el.find('#zoom_val').html(this.zoom.get('val'))
    },
    reset : function(e){
        this.instance.repaintEverything();
        this.setZoom(this.zoom.get('val'));
        //this.render();
    },
    resetPosition : function(e){
        e.preventDefault();
        $(this.map_el).attr( "style","top:-"+this.positionRef+"px;left:-"+this.positionRef+"px");
        this.setZoom(this.zoom.get('val'));
    },
    resetZoom : function(e){
        e.preventDefault();
        this.zoom.set({val : 1});
        this.setZoom(this.zoom.get('val'));
    },
    setCKOperator : function(e){
        e.preventDefault();
        if(this.ckOperator == true){this.ckOperator = false}else{this.ckOperator = true;}
        this.render();
    },
    setKcontentVisibility : function(e){
        e.preventDefault();
        if(this.KcontentVisibility == true){this.KcontentVisibility = false}else{this.KcontentVisibility = true;} 
        this.reset();
    },
    setCcontentVisibility : function(e){
        e.preventDefault();
        if(this.CcontentVisibility == true){this.CcontentVisibility = false}else{this.CcontentVisibility = true;} 
        this.reset();
    },
    zoomin : function(e){
        e.preventDefault();
        new_zoom = Math.round((this.zoom.get('val') - 0.1)*100)/100;
        this.zoom.set({val : new_zoom});
        this.setZoom(this.zoom.get('val'));
    },
    zoomout : function(e){
        e.preventDefault();
        new_zoom = Math.round((this.zoom.get('val') + 0.1)*100)/100;
        this.zoom.set({val : new_zoom});
        this.setZoom(this.zoom.get('val'));
    },
    setZoom : function(zoom) {
      transformOrigin = [ 0.5, 0.5 ];
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
            top : this.positionRef,
            left: this.positionRef,
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
            top : this.positionRef,
            left: this.positionRef,
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
            if(conn.scope == "cTok"){
                if(resp == true){
                    // k_target = _this.knowledges.get(conn.targetId);
                    // k_target.set({id_fathers : _.without(k_target.get('id_fathers'), conn.sourceId)}).save(); 
                    links_to_remove = _this.links.where({concept : conn.sourceId, knowledge : conn.targetId});
                    links_to_remove.forEach(function(link){
                        link.destroy();
                    });
                } 
            }else{
                if(resp == true){
                    _this.concepts.get(conn.targetId).set({id_father : "none"}).save();      
                } 
            }
            
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
            if(originalEvent){
                if(info.connection.scope == "cTok"){
                    console.log("source: ",info.sourceId," - target: ",info.targetId)
                    k_target = bbmap.views.main.knowledges.get(info.targetId);
                    console.log('k_target: ',k_target)
                    // CKLink
                    new_cklink = new global.Models.CKLink({
                        id :guid(),
                        user : _this.user,
                        date : getDate(),
                        concept : info.sourceId,
                        knowledge : info.targetId
                    });
                    new_cklink.save();
                    _this.links.add(new_cklink);

                }else{
                    bbmap.views.main.concepts.get(info.targetId).set({id_father : info.sourceId}).save();
                }    
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
        this.map_el.empty();
        views = [];
        ///////////////////////
        // Action bar
        this.bar_el.append(this.template_actionbar());
        this.bar_el.find("#zoom_val").html(this.zoom.get('val'))
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
