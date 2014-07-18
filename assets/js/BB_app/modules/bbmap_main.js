/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        // el
        this.bar_el = $(this.el).find('#actionbar');
        this.map_el = $(this.el).find('#map');
        this.editor_el = $(this.el).find('#editor');
        this.editModel_el = $(this.el).find('#editModel');
        this.attachementModel_el = $(this.el).find('#attachementModel');
        this.discussionModel_el = $(this.el).find('#discussionModel');
        this.activitiesModel_el = $(this.el).find('#activitiesModel');
        this.css3Model_el = $(this.el).find('#css3Model');
        // Objects
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.project            = json.project;
        this.poches             = json.poches;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        this.lastModel          = new Backbone.Model();
        this.nodes_views        = {};
        // Parameters
        this.mode               = "visu";
        this.filter             = "ck";
        this.KcontentVisibility = true;
        this.CcontentVisibility = false;
        this.ckOperator         = true;
        this.positionRef        = 550;
        this.color              = "#27AE60";
        // Templates
        this.template_actionbar = _.template($('#bbmap-actionbar-template').html());
        this.template_joyride = _.template($('#bbmap-joyride-template').html());
        ////////////////////////////
        // JsPlumb
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:1 },
            EndpointStyle : { radius:5, fillStyle:this.color },
            HoverPaintStyle : {strokeStyle:"#27AE60" },
            EndpointHoverStyle : {fillStyle:"#27AE60" },
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
        // Events
        this.listenTo(bbmap.zoom,'change',this.updateZoomDisplay,this);
        global.eventAggregator.on('concept:create',this.addConceptToView,this);
        global.eventAggregator.on('concept:remove',this.removeModelToView,this);
        global.eventAggregator.on('concept:update',this.modelUpdate,this);
        global.eventAggregator.on('knowledge:create',this.addKnowledgeToView,this);
        global.eventAggregator.on('knowledge:remove',this.removeModelToView,this);
        global.eventAggregator.on('knowledge:update',this.modelUpdate,this);
        this.map_el.mousewheel(function(event) {
            event.preventDefault();
            console.log(event.deltaY);
            if(event.deltaY == -1)bbmap.views.main.zoomin()
            else bbmap.views.main.zoomout()
        });
    },
    events : {
        "change #modeSelection" : "setMode",
        "change #filterSelection" : "setFilter",
        "mouseup .dropC" : "newConceptUnlinked",
        "mouseup .dropK" : "newKnowledgeUnlinked",
        "click .addUnlinkedC" : "createUnlinkedConcept",
        "click .addUnlinkedK" : "createUnlinkedKnowledge",
        "click .ckOperator" : "setCKOperator",
        "click .zoomin" : "zoomin",
        "click .zoomout" : "zoomout",
        "click .reset" : "resetInterface",
        "mouseenter .window.knowledge" : "showIcon2", 
        "mouseenter .window.concept" : "showIcon", 
        "click .ep3" : "structureTree",
        "mouseleave .window" : "hideIcon", 
        "click .closeEditor" : "hideEditor",
        "click #okjoyride" : "changeTitleLastModel",
        "click .screenshot" : "screenshot"
    },
    /////////////////////////////////////////
    // Modes & Filters
    /////////////////////////////////////////
    setMode : function(e){
        e.preventDefault();
        this.mode = $(e.target).val();
        if(this.mode == "visu") this.editor_el.hide('slow');
        this.render();
    },
    setFilter : function(e){
        e.preventDefault();
        this.filter = $(e.target).val();
        this.render();
    },
    /////////////////////////////////////////
    // Screenshot
    /////////////////////////////////////////
    screenshot : function(flag){
        _this = this;
        /**
        Repositionne la screenshot sur tout le graphe
        **/
        var zoomscale = bbmap.zoom.get('val');  //before take screenshot should change to the origin size
        var project_id = this.project.get('id');
        var moveLeft = (-$("#map")[0].offsetLeft)*(1-1.0/zoomscale);  //if zoomscale>1 we should move it to right else move to left
        var moveTop = (-$("#map")[0].offsetTop)*(1-1.0/zoomscale);
        var originLeft = $("#map")[0].offsetLeft;
        var originTop = $("#map")[0].offsetTop;
        var tmpscale = zoomscale;
        if(tmpscale>1){                           //resize
            while(bbmap.zoom.get('val')>1){
                _this.zoomin();
            }
        }else{
            while(bbmap.zoom.get('val')<1){
                _this.zoomout();
            }
        }
        $("#map").offset({left:originLeft+moveLeft});   //change position
        $("#map").offset({top:originTop+moveTop+$("#map_container")[0].offsetTop});
        
        html2canvas($("#map.demo"), {
            width: $("#map")[0].offsetWidth,      //screenshot has the same size with #map
            height: $("#map")[0].offsetHeight,
            onrendered: function(canvas) {       //html2canvas can only find nodes not svgs
                /**
                Remet la vue à l'état initial
                **/
                $("#map").offset({left:originLeft});       //once finished return back to present state
                $("#map").offset({top:originTop+$("#map_container")[0].offsetTop});              
                if(tmpscale>1){
                    while(bbmap.zoom.get('val')<tmpscale){
                        _this.zoomout();
                    }
                }else{
                    while(bbmap.zoom.get('val')>tmpscale){
                        _this.zoomin();
                    }
                }

                /**
                Ajoute les lignes et les points qui sont au format SVG
                * canvas : les bulles
                * canvas0 : tous les points et les lignes
                **/
                var canvas0 = document.createElement("canvas");  //another canvas we will draw all the things left together to reproduce #map
                var context = canvas0.getContext("2d");
                canvas0.width = $("#map")[0].offsetWidth;
                canvas0.height = $("#map")[0].offsetHeight;

                var svgArray = $("#map>svg");                   // first we draw all the lines
                for (var i = 0; i < svgArray.length; i++) {
                    var top = parseFloat(svgArray[i].style.top);
                    var left = parseFloat(svgArray[i].style.left);
                    var height = svgArray[i].getAttribute("height");
                    var width = svgArray[i].getAttribute("width");
                    var canvas1 = document.createElement("canvas");
                    canvas1.width = width;
                    canvas1.height = height;
                    var svgTagHtml = svgArray[i].innerHTML;
                    canvg(canvas1,svgTagHtml);                  //canvg is a library which can parse svg to canvas

                    context.drawImage(canvas1,left,top);
                };

                var pointArray = $("._jsPlumb_endpoint>svg");   //than we are ganna draw all the points to canvas0
                var divArray = $("._jsPlumb_endpoint");         //cause the we can't get the position of points directly, we look at his parent div
                //console.log(divArray.length);
                for (var i = 0; i < divArray.length; i++) {
                    var top = parseFloat(divArray[i].style.top);
                    var left = parseFloat(divArray[i].style.left);
                    var height = parseFloat(divArray[i].style.height);
                    var width = parseFloat(divArray[i].style.width);
                    var canvas1 = document.createElement("canvas");
                    canvas1.width = width;
                    canvas1.height = height;
                    var svgTagHtml = pointArray[i].innerHTML;
                    canvg(canvas1,svgTagHtml);

                    context.drawImage(canvas1,left,top);
                };

                /**
                merger canvas and canvas0
                **/
                context = canvas.getContext("2d");                
                context.drawImage(canvas0,0,0);                
                console.log(canvas.toDataURL("image/png"));
                /**
                Centre le canvas sur la zone dessinée et couper le reste
                **/
                var x1 = -parseFloat($("#map")[0].offsetLeft)/zoomscale;   // here we r ganna take the right part of canvas
                var y1 = -parseFloat($("#map")[0].offsetTop )/zoomscale;
                var x2 = x1+$("#map_container")[0].offsetWidth/zoomscale;
                var y2 = y1+$("#map_container")[0].offsetHeight/zoomscale;
                var canvas2 = document.createElement("canvas");
                canvas2.width = (x2-x1);
                canvas2.height = (y2-y1);
                var context2 = canvas2.getContext("2d");  
                if((x1<0)&&(y1<0)){                                       //get data of canvas and put them to a new one(canvas2) according to the different situations of position between screen and #map
                    var imgData=context.getImageData(0,0,x2,y2);  
                    context2.putImageData(imgData,-x1,-y1);
                }else{
                    if(x1<0){
                        var imgData=context.getImageData(0,y1,x2,y2);
                        context2.putImageData(imgData,-x1,0);
                    }else{
                        if(y1<0){
                            var imgData=context.getImageData(x1,0,x2,y2);
                            context2.putImageData(imgData,0,-y1);
                        }else{
                            var imgData=context.getImageData(x1,y1,x2,y2);
                            context2.putImageData(imgData,0,0);
                        }
                    }
                }
                var screenshot;
                //console.log(canvas2.toDataURL( "image/png" ));
                screenshot = canvas2.toDataURL( "image/png" ).replace(/data:image\/png;base64,/,'');   //save screenshot
                var uintArray = Base64Binary.decode(screenshot);;
                _this.uploadFile(uintArray, flag);
            }
        });    
    },
    uploadFile : function(file,flag){
        _this = this;
        var s3upload = new S3Upload({
            file : file,
            s3_sign_put_url: '/S3/upload_sign',
            onProgress: function(percent, message) {
                console.log(percent, " ***** ", message);
            },
            onFinishS3Put: function(amz_id, file) {
                console.log("File uploaded ", amz_id);
                //Si c'est un screenshot servant d'image pour le projet
                if(flag){
                    _this.project.save({
                        image : amz_id
                    })
                }
                // Si c'est un screenshot
                else{
                    global.Models.Screenshot.create({
                        id : guid(),
                        src : amz_id,
                        date : getDate(),
                        project_id : _this.project.get('id')
                    });
                }             
            },
            onError: function(status) {
                console.log(status)
            }
        });

    },
    /////////////////////////////////////////
    // Drop new data on map
    /////////////////////////////////////////
    newConceptUnlinked : function(e){
        var pos = $('#dropC').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        this.createUnlinkedConcept(left,top);
        this.renderActionBar();
    },
    newKnowledgeUnlinked : function(e){
        var pos = $('#dropK').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        this.createUnlinkedKnowledge(left,top);
        this.renderActionBar();
    },
    startJoyride : function(){
        $("#joyride_id").attr('data-id',this.lastModel.get('id')+'_joyride')
        $(document).foundation('joyride', 'start');
    },
    updateLastModelTitle : function(title){
        if(title == ""){
            this.nodes_views[this.lastModel.get('id')].removeNode();
        }else{
            this.lastModel.save({title:title});
        }
    },
    /////////////////////////////////////////
    // Sliding editor bar
    /////////////////////////////////////////
    updateEditor : function(model){
        if(this.mode == "edit"){
            this.editor_el.show('slow');
            // Model editor module
            if(bbmap.views.modelEditor)bbmap.views.modelEditor.remove();
            bbmap.views.modelEditor = new modelEditor.Views.Main({
                user            : this.user,
                model           : model
            });
            // Templates list
            if(bbmap.views.templatesList)bbmap.views.templatesList.remove();
            if(!this.project.get('templates')) this.project.save({templates : bbmap.default_templates},{silent:true});
            bbmap.views.templatesList = new templatesList.Views.Main({
                templates : this.project.get('templates'),
                model : model
            });
            // IMG List module
            if(bbmap.views.imagesList)bbmap.views.imagesList.remove();
            bbmap.views.imagesList = new imagesList.Views.Main({
                model           : model
            });
            // Attachment module
            if(bbmap.views.attachment)bbmap.views.attachment.remove();
            bbmap.views.attachment = new attachment.Views.Main({
                model           : model
            });
            // Comments module
            if(bbmap.views.comments)bbmap.views.comments.remove();
            bbmap.views.comments = new comments.Views.Main({
                model           : model,
                user            : this.user
            });
            // notification module
            if(bbmap.views.activitiesList)bbmap.views.activitiesList.remove();
            bbmap.views.activitiesList = new activitiesList.Views.Main({
                model           : model
            });
            // Render & Append
            this.editModel_el.html(bbmap.views.modelEditor.render().el);
            this.editModel_el.append(bbmap.views.templatesList.render().el);
            this.attachementModel_el.html(bbmap.views.imagesList.render().el);
            this.attachementModel_el.append(bbmap.views.attachment.render().el);
            this.discussionModel_el.append(bbmap.views.comments.render().el);
            this.activitiesModel_el.html(bbmap.views.activitiesList.render().el);
        }
    },
    hideEditor : function(e){
        e.preventDefault();
        this.editor_el.hide('slow');
    },
    /////////////////////////////////////////
    // Zoom system
    /////////////////////////////////////////
    zoomin : function(e){
        //e.preventDefault();
        new_zoom = Math.round((bbmap.zoom.get('val') - 0.1)*100)/100;
        bbmap.zoom.set({val : new_zoom});
        this.setZoom(bbmap.zoom.get('val'));
    },
    zoomout : function(e){
        //e.preventDefault();
        new_zoom = Math.round((bbmap.zoom.get('val') + 0.1)*100)/100;
        bbmap.zoom.set({val : new_zoom});
        this.setZoom(bbmap.zoom.get('val'));
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
    updateZoomDisplay : function(){
        this.bar_el.find('#zoom_val').html(bbmap.zoom.get('val'))
    },
    resetZoom : function(){
        bbmap.zoom.set({val : 1});
        this.setZoom(bbmap.zoom.get('val'));
    },
    /////////////////////////////////////////
    // Tree re-structure
    /////////////////////////////////////////
    structureTree : function(e){
        e.preventDefault();
        var id = e.target.id;
        this.reorganizeTree(id);
    },
    reorganizeTree : function(id){
        var model = this.concepts.get(id)
        var tree = this.buildTree(model.toJSON())
        // tree = random_tree(3, 2)
        // Label it with node offsets and get its extent.
        e = tree.extent()
        // Retrieve a bounding box [x,y,width,height] from the extent.
        bb = bounding_box(e)
        // Label each node with its (x,y) coordinate placing root at given location.
        //tree.place(-bb[0] + horizontal_gap, -bb[1] + horizontal_gap)
        var origin = this.nodes_views[model.get('id')].getPosition();
        tree.place(origin.left , origin.top )
        // Draw using the labels.
        this.draw(tree);
        this.instance.repaintEverything();
    },
    buildTree : function(model) {
        var childs = [];
        var childrens = this.concepts.where({id_father : model.id});
        if(childrens.length > 0){
            childrens.forEach(function(child){
                childs.push(bbmap.views.main.buildTree(child));
            });    
        }
        var tree = new Tree(model.id, childs);
        return tree;
    },
    // Draw a graph node.
    draw : function (tree) {
      var n_children = tree.children.length
      for (var i = 0; i < n_children; i++) {
        var child = tree.children[i]
        //arc(this.x, this.y + 0.5 * node_size + 2, child.x, child.y - 0.5 * node_size)
        this.draw(child)
      }
      this.node(tree.lbl, tree.x, tree.y)
    },
    node: function(lbl, x, y, sz) {
        if (!sz) sz = bbmap.node_size()/bbmap.zoom.get('val');
        var h = sz / 2;
        var z = bbmap.zoom.get('val');
        this.nodes_views[lbl].setPosition(x/z, y/z, sz/z, h/z, true);
    },
    /////////////////////////////////////////
    // Hover bulle effect
    /////////////////////////////////////////
    showIcon : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit") $("#"+id+" .icon").show();
        this.selectBulle(id)
    },
    showIcon2 : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit") $("#"+id+" .sup").show();
    },
    hideIcon : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit") this.$(".icon").hide();
        this.unselectBulle(id);
    },
    selectBulle : function(id){
        var conceptsList = this.concepts.where({id_father : id});
        $("#"+id).css({border:'0.2em solid green',color:'green'});
        conceptsList.forEach(function(concept){
            $("#"+concept.get('id')).css({border:'0.2em solid green',color:'green'});
            bbmap.views.main.selectBulle(concept.get('id'));
        });
    },
    unselectBulle : function(id){
        var conceptsList = this.concepts.where({id_father : id})
        bbmap.views.main.nodes_views[id].applyStyle();
        conceptsList.forEach(function(concept){
            bbmap.views.main.nodes_views[concept.get('id')].applyStyle();
            bbmap.views.main.unselectBulle(concept.get('id'));
        });
    },
    /////////////////////////////////////////
    // Reset
    /////////////////////////////////////////
    reset : function(e){
        this.instance.repaintEverything();
        this.setZoom(bbmap.zoom.get('val'));
    },
    resetInterface : function(e){
        e.preventDefault();
        this.resetZoom();
        this.resetPosition();
    },
    resetPosition : function(){
        $(this.map_el).attr( "style","top:-"+this.positionRef+"px;left:-"+this.positionRef+"px");
    },
    /////////////////////////////////////////
    // Real-time
    /////////////////////////////////////////
    setCKOperator : function(e){
        e.preventDefault();
        if(this.ckOperator == true){this.ckOperator = false}else{this.ckOperator = true;}
        this.render();
    },
    modelUpdate : function(model){
        var attributesUpdated = [];
        if(model.get('type') == "concept") attributesUpdated = global.Functions.whatChangeInModel(this.concepts.get(model.get('id')),model);
        if(model.get('type') == "knowledge") attributesUpdated = global.Functions.whatChangeInModel(this.knowledges.get(model.get('id')),model);

        if((_.indexOf(attributesUpdated,"left") != -1)||(_.indexOf(attributesUpdated,"top") != -1)){
            // Si c'est la position qui a changée
            $(this.nodes_views[model.get('id')].el).attr( "style","top: "+model.get('top')+"px;left:"+model.get('left')+"px");
        }else if(_.indexOf(attributesUpdated,"title") != -1){
            // Si cest le title
            alert("title updated")
        }
        this.instance.repaintEverything();
    },
    createUnlinkedKnowledge : function(left,top){
        new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            top : top,
            left: left,
            project: this.project.get('id'),
            title: "new knowledge",
            user: this.user
        });
        new_knowledge.save();
        this.knowledges.add(new_knowledge);
        this.addModelToView(new_knowledge,"knowledge");
    },
    createUnlinkedConcept : function(left,top){
        new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: "none",
            top : top,
            left: left,
            project: this.project.get('id'),
            title: "new concept",
            user: this.user
        });
        new_concept.save();
        this.concepts.add(new_concept);
        this.addModelToView(new_concept,"concept");
    },
    addModelToView : function(model,type){
        this.lastModel = model;
        new_view = new bbmap.Views.Node({
            className : "window "+type,
            id : model.get('id'),
            model : model,
        });
        this.map_el.append(new_view.render().el);
        new_view.addEndpoint();
        new_view.addLink();
        new_view.makeTarget();
        new_view.addFollowFather();
        this.instance.draggable($(new_view.el));
        this.nodes_views[model.get('id')] = new_view;
        this.startJoyride();
    },
    removeModelToView : function(model){
        model_view = this.nodes_views[model.get('id')]
        model_view.endpoints.forEach(function(ep){
            bbmap.views.main.instance.deleteEndpoint(ep);
        })
        bbmap.views.main.instance.detachAllConnections($(model_view.el));
        // put all the child node parent_id attributes to none
        if(model.get('type') == 'concept'){
            childrens = bbmap.views.main.concepts.where({id_father : model.get('id')})
            childrens.forEach(function(child){
                child.set({id_father : "none"}).save();
            });
        } 
        model_view.remove();
    },
    /////////////////////////////////////////
    // jsPlumb
    /////////////////////////////////////////
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
    },
    renderActionBar : function(){
        this.bar_el.empty();
        this.bar_el.append(this.template_actionbar({
            filter  : this.filter,
            mode    : this.mode
        }));
        this.bar_el.find("#zoom_val").html(bbmap.zoom.get('val'));
        $( "#dropC" ).draggable();
        $( "#dropK" ).draggable();
    },
    renderConceptsBulle : function(){
        var _this = this;
        // Views
        this.concepts.each(function(concept){
            bbmap.views.main.nodes_views[concept.get('id')] = new bbmap.Views.Node({
                className : "window concept bulle",
                id : concept.get('id'),
                model : concept,
            });
        });
        // Render
        this.concepts.forEach(function(model){
            _this.map_el.append(bbmap.views.main.nodes_views[model.get('id')].render().el);    
        });
        // EndPoint
        this.concepts.forEach(function(model){
            bbmap.views.main.nodes_views[model.get('id')].addEndpoint();    
        });
        // Add links
        this.concepts.forEach(function(model){
            bbmap.views.main.nodes_views[model.get('id')].addLink();    
        });
        if(this.mode == "edit"){
            // Make its target
            this.concepts.forEach(function(model){
                bbmap.views.main.nodes_views[model.get('id')].makeTarget();    
            });
            // Set concept following his father
            this.concepts.forEach(function(model){
                bbmap.views.main.nodes_views[model.get('id')].addFollowFather();
            });
            // Draggable
            this.concepts.forEach(function(model){
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el));
            });
        }
    },
    renderKnowledgesBulle : function(){
        var _this = this;
        // Views
        this.knowledges.each(function(knowledge){
            bbmap.views.main.nodes_views[knowledge.get('id')] = new bbmap.Views.Node({
                className : "window knowledge bulle",
                id : knowledge.get('id'),
                model : knowledge,
            });
        });
        // Render
        this.knowledges.forEach(function(model){
            _this.map_el.append(bbmap.views.main.nodes_views[model.get('id')].render().el);    
        });
        // EndPoint
        this.knowledges.forEach(function(model){
            bbmap.views.main.nodes_views[model.get('id')].addEndpoint();    
        });
        if(this.mode == "edit"){
            // Make its target
            this.knowledges.forEach(function(model){
                bbmap.views.main.nodes_views[model.get('id')].makeTarget();    
            });
            // Draggable
            this.knowledges.forEach(function(model){
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el));
            });
        }
    },
    renderPochesBulle : function(){
        var _this = this;
        // Views
        this.poches.each(function(poche){
            bbmap.views.main.nodes_views[poche.get('id')] = new bbmap.Views.Node({
                className : "window poche bulle",
                id : poche.get('id'),
                model : poche,
            });
        });
        // Render
        this.poches.forEach(function(model){
            _this.map_el.append(bbmap.views.main.nodes_views[model.get('id')].render().el);    
        });
        // Draggable
        if(this.mode == "edit"){
            this.poches.forEach(function(model){
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el));
            });
        }
    },
    renderCKLinks : function(){
        this.knowledges.forEach(function(model){
            bbmap.views.main.nodes_views[model.get('id')].addLink();    
        });
    },
    renderPKLinks : function(){

    },
    render : function(){        
        ///////////////////////
        // init
        var _this = this;
        this.map_el.empty();
        ///////////////////////
        // Action bar
        this.renderActionBar();
        $(this.el).append(this.template_joyride());
        ///////////////////////
        // Modes
        if(this.filter == "c"){
            this.renderConceptsBulle();
        }
        if(this.filter == "k"){
            this.renderKnowledgesBulle();
        }
        if(this.filter == "p"){
            this.renderPochesBulle();
        }
        if(this.filter == "ck"){
            this.renderConceptsBulle();
            this.renderKnowledgesBulle();
            this.renderCKLinks();
        }
        if(this.filter == "kp"){
            this.renderKnowledgesBulle();
            this.renderPochesBulle();   
        }
        if(this.filter == "ckp"){
            this.renderConceptsBulle();
            this.renderKnowledgesBulle();
            this.renderPochesBulle();
            this.renderCKLinks();
        }
        ///////////////////////
        // Initialize jsPlumb events
        this.jsPlumbEventsInit();
        ///////////////////////
        $( "#map" ).draggable();
        // css3 generator
        if(bbmap.views.css3)bbmap.views.css3.remove();
        bbmap.views.css3 = new CSS3GENERATOR.Views.Main();
        // CSS3 Button generator
        this.css3Model_el.html(bbmap.views.css3.render().el);
        CSS3GENERATOR.attach_handlers();
        CSS3GENERATOR.initialize_controls();
        CSS3GENERATOR.update_styles();


        $.get('/BBmap/image', function(hasChanged){
            if (_this.project.image=="" || hasChanged == true){
                _this.screenshot(true);
            }
        });
        return this;
    }
});
/////////////////////////////////////////////////