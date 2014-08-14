/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        // el
        this.top_el = $(this.el).find('#top_container');
        this.bottom_el = $(this.el).find('#bottom_container');
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
        this.mode               = json.mode;
        this.filter             = json.filter;
        // Parameters
        this.isopen             = false;
        this.ckOperator         = true;
        this.positionRef        = 550;
        this.color              = "gray";
        // Templates
        this.template_top = _.template($('#bbmap-top-element-template').html());
        this.template_bottom = _.template($('#bbmap-bottom-element-template').html());
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
        // Real-time : knowledge & poche & concept
        global.eventAggregator.on('model:create',this.addModelToView,this);
        global.eventAggregator.on('model:remove',this.removeModelToView,this);
        // Real-time : Link
        global.eventAggregator.on('link:create',this.addLinkToView,this);
        global.eventAggregator.on('link:remove',this.removeLinkToView,this);
        // zoom-in & zoom-out avec la moulette
        this.map_el.mousewheel(function(event) {
            event.preventDefault();
            //console.log(event.deltaY);
            if(event.deltaY == -1)bbmap.views.main.zoomin()
            else bbmap.views.main.zoomout()
        });
    },
    events : {
        "change #modeSelection" : "setMode",
        "change #filterSelection" : "setFilter",
        "mouseup .dropC" : "newConceptUnlinked",
        "mouseup .dropK" : "newKnowledgeUnlinked",
        "mouseup .dropP" : "newPocheUnlinked",
        "click .ckOperator" : "setCKOperator",
        "click .zoomin" : "zoomin",
        "click .zoomout" : "zoomout",
        "click .reset" : "resetInterface",
        "click .window.poche" : "showIconPoche", 
        "click .window.knowledge" : "showIconKnowledge", 
        "mouseenter .window.concept" : "showDependances", 
        "click .window.concept" : "showIconConcept", 
        "click .structureSubTree" : "structureTree",
        "mouseleave .window" : "hideIcon", 
        //"click .closeEditor" : "hideEditor",
        "click #okjoyride" : "changeTitleLastModel",
        "click .screenshot" : "screenshot",
        "click .downloadimage" : "downloadimage",
        "click #showMenu" : "eventMenu"
    },
    /////////////////////////////////////////
    // Overlays sur les connections
    /////////////////////////////////////////
    hideOverLays : function(){
        var connections = bbmap.views.main.instance.getAllConnections()
        connections.forEach(function(connection){
            connection.hideOverlays();
        }) 
    },
    showOverLays : function(){
        var connections = bbmap.views.main.instance.getAllConnections()
        connections.forEach(function(connection){
            connection.showOverlays();
        }) 
    },
    /////////////////////////////////////////
    // Modes & Filters
    /////////////////////////////////////////
    setMode : function(e){
        e.preventDefault();
        this.mode = $(e.target).val();
        if(this.mode == "visu"){
            $('#cbp-spmenu-s1').hide('slow');
            $('#showMenu').hide('slow');
            if(this.isopen==true){
                var menu = document.getElementById( 'cbp-spmenu-s1' );
                classie.toggle( menu, 'cbp-spmenu-open' ); 
                this.hideMenu();
            }

        } 
        this.render();
    },
    setFilter : function(e){
        e.preventDefault();
        this.filter = $(e.target).val();
        this.render();
    },
    /////////////////////////////////////////
    // Downdloadimage
    /////////////////////////////////////////
    downloadimage : function(e){
        _this = this;
        //var aLink = e.target; 
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
        $("#map").offset({top:originTop+moveTop});
        
        html2canvas($("#map.demo"), {
            width: $("#map")[0].offsetWidth,      //screenshot has the same size with #map
            height: $("#map")[0].offsetHeight,
            onrendered: function(canvas) {       //html2canvas can only find nodes not svgs
                /**
                Remet la vue à l'état initial
                **/
                $("#map").offset({left:originLeft});       //once finished return back to present state
                $("#map").offset({top:originTop});              
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
                //console.log(canvas.toDataURL("image/png"));
                /**
                Centre le canvas sur la zone dessinée et couper le reste
                **/

                var currentWidth = $("#map_container")[0].offsetWidth;
                var currentHeight = $("#creaktive_window")[0].offsetHeight-$(".tab-bar")[0].offsetHeight-$("#bottom_container")[0].offsetHeight;
                var x1 = -parseFloat($("#map")[0].offsetLeft)/zoomscale;   // here we r ganna take the right part of canvas
                var y1 = (-parseFloat($("#map")[0].offsetTop )+$(".tab-bar")[0].offsetHeight)/zoomscale;
                var x2 = x1+currentWidth/zoomscale;
                var y2 = y1+currentHeight/zoomscale; 
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

                screenshot = canvas2.toDataURL( "image/png" );

                var aLink = document.createElement('a');
                aLink.download = "screenshot";
                aLink.href = screenshot;
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink);

            }
        });    
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
        $("#map").offset({top:originTop+moveTop});
        
        html2canvas($("#map.demo"), {
            width: $("#map")[0].offsetWidth,      //screenshot has the same size with #map
            height: $("#map")[0].offsetHeight,
            onrendered: function(canvas) {       //html2canvas can only find nodes not svgs
                /**
                Remet la vue à l'état initial
                **/
                $("#map").offset({left:originLeft});       //once finished return back to present state
                $("#map").offset({top:originTop});              
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
                ////console.log(divArray.length);
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
                ////console.log(canvas.toDataURL("image/png"));
                /**
                Centre le canvas sur la zone dessinée et couper le reste
                **/
                var currentWidth = $("#map_container")[0].offsetWidth;
                var currentHeight = $("#creaktive_window")[0].offsetHeight-$(".tab-bar")[0].offsetHeight-$("#bottom_container")[0].offsetHeight;
                var x1 = -parseFloat($("#map")[0].offsetLeft)/zoomscale;   // here we r ganna take the right part of canvas
                var y1 = (-parseFloat($("#map")[0].offsetTop)+$(".tab-bar")[0].offsetHeight)/zoomscale;
                var x2 = x1+currentWidth/zoomscale;
                var y2 = y1+currentHeight/zoomscale; 
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
                screenshot = canvas2.toDataURL( "image/png" );   //save screenshot

                global.Functions.uploadScreenshot(screenshot, function(data){
                    //console.log(data);
                    if(flag==true){
                        global.models.currentProject.save({
                            image : data
                        });
                    }else{
                        var s = new global.Models.Screenshot({
                            id : guid(),
                            src : data,
                            date : getDate(),
                            project_id : global.models.currentProject.get('id')
                        });
                        s.save();
                    }
                });

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
    newPocheUnlinked : function(e){
        var pos = $('#dropP').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        this.createUnlinkedPoche(left,top);
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
    eventMenu : function(e){
        e.preventDefault();
        $('#cbp-spmenu-s1').show('slow');
        var menu = document.getElementById( 'cbp-spmenu-s1' );
        var button = document.getElementById( 'showMenu' );
        //var body = document.getElementById('map_container');
        classie.toggle( button, 'active' );
        //classie.toggle( body, 'cbp-spmenu-push-toright' );
        classie.toggle( menu, 'cbp-spmenu-open' );              //ouvrir ou fermer fenetre
        //change et bouger icon de button
        if(this.isopen==false) this.showMenu();            
        else this.hideMenu();
    },
    showMenu : function(){
        $("#showMenu").animate({right:"20%"});
        $("#cbp-openimage")[0].src="/img/icones/Arrow-Right.png";
        this.isopen=true;
    },
    hideMenu : function(){
        $("#showMenu").animate({right:"0px"});
        $("#cbp-openimage")[0].src="/img/icones/Arrow-Left.png";
        this.isopen=false;
    },
    updateEditor : function(model){
        if(this.mode == "edit"){
            $('#showMenu').show('slow');
            // Model editor module
            if(bbmap.views.modelEditor)bbmap.views.modelEditor.close();
            bbmap.views.modelEditor = new modelEditor.Views.Main({
                user            : this.user,
                model           : model
            });
            // Templates list
            if(bbmap.views.templatesList)bbmap.views.templatesList.close();
            bbmap.views.templatesList = new templatesList.Views.Main({
                templates : this.project.get('templates'),
                model : model
            });
            // check for template
            if(!this.project.get('templates')) this.project.save({templates : bbmap.default_templates},{silent:true});
            // IMG List module
            if(bbmap.views.imagesList)bbmap.views.imagesList.close();
            bbmap.views.imagesList = new imagesList.Views.Main({
                model           : model,
                eventAggregator : this.eventAggregator
            });
            // Attachment module
            if(bbmap.views.attachment)bbmap.views.attachment.close();
            bbmap.views.attachment = new attachment.Views.Main({
                model           : model,
                eventAggregator : this.eventAggregator
            });
            // Comments module
            if(bbmap.views.comments)bbmap.views.comments.close();
            bbmap.views.comments = new comments.Views.Main({
                model           : model,
                user            : this.user
            });
            // notification module
            if(bbmap.views.activitiesList)bbmap.views.activitiesList.close();
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
        this.top_el.find('#zoom_val').html(bbmap.zoom.get('val'))
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
        var id = e.target.id.split('_action')[0];
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
        this.nodes_views[lbl].setPosition(x/z, y/z, sz/z, h/z, true, "srtucture_function_origin");
    },
    /////////////////////////////////////////
    // Hover bulle effect
    /////////////////////////////////////////
    showDependances : function(e){
        e.preventDefault();
        var id = e.target.id;
        this.selectBulle(id);
    },
    showIconConcept : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit") $("#"+id+" .icon").show();
    },
    showIconPoche : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit"){
            $("#"+id+" .sup").show();  
            $("#"+id+" .ep3").show();  
            $("#"+id+" .ep2").show();  
        }
    },
    showIconKnowledge : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(this.mode == "edit"){
            $("#"+id+" .sup").show();  
            $("#"+id+" .ep3").show();  
            $("#"+id+" .ep").show();  
        }
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
    setCKOperator : function(e){
        e.preventDefault();
        if(this.ckOperator == true){this.ckOperator = false}else{this.ckOperator = true;}
        this.render();
    },
    /////////////////////////////////////////
    // Create unlinked model
    /////////////////////////////////////////
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
        this.addModelToView(new_knowledge);
    },
    createUnlinkedPoche : function(left,top){
        var model = new global.Models.Poche({
            id : guid(),
            type : "poche",
            top : top,
            left: left,
            project: this.project.get('id'),
            title: "new category",
            user: this.user
        });
        model.save();
        this.poches.add(model);
        this.addModelToView(model);
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
        this.addModelToView(new_concept);
    },
    /////////////////////////////////////////
    // Add remove model/link to view
    /////////////////////////////////////////
    addModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        var type = model.get('type');
        this.lastModel = model;
        new_view = new bbmap.Views.Node({
            className : "window "+type,
            id : model.get('id'),
            model : model,
        });
        this.map_el.append(new_view.render().el);
        new_view.addEndpoint();
        new_view.makeTarget();
        this.instance.draggable($(new_view.el));
        this.nodes_views[model.get('id')] = new_view;
        new_view.addLink();
        if(origin == "client") this.startJoyride();
    },
    removeModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        this.nodes_views[model.get('id')].removeView();
    },
    addLinkToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        bbmap.views.main.instance.connect({
            source:bbmap.views.main.nodes_views[model.get('source')].el, 
            target:bbmap.views.main.nodes_views[model.get('target')].el, 
            anchor:"AutoDefault",
            scope : "cklink"
        });
    },
    removeLinkToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        var source = model.get('source')
        var target = model.get('target')
        var connections = this.instance.getAllConnections();
        connections.forEach(function(conn){
            if((conn.targetId == target)&&(conn.sourceId == source))conn.setVisible(false)//bbmap.views.main.instance.detach({source:source, target:target, fireEvent:false});
        })
        //this.nodes_views[model.get('source')].removeView();    
    },
    /////////////////////////////////////////
    // jsPlumb
    /////////////////////////////////////////
    jsPlumbEventsInit : function(){
        ///////////////////////
        // Remove link process        
        this.instance.bind("beforeDetach", function(conn) {
            var resp = confirm("Delete connection?");
            if(conn.scope == "cklink"){
                if(resp == true){
                    var links_to_remove = bbmap.views.main.links.where({source : conn.sourceId, target : conn.targetId});
                    links_to_remove.forEach(function(link){
                        link.destroy();
                    });
                    var links_to_remove = bbmap.views.main.links.where({source : conn.targetId, target : conn.sourceId});
                    links_to_remove.forEach(function(link){
                        link.destroy();
                    });
                } 
            }else{
                if(resp == true){
                    bbmap.views.main.concepts.get(conn.targetId).set({id_father : "none"}).save();      
                } 
            }
            
            return resp;
        });
        this.instance.bind("click", function(conn) {
            bbmap.views.main.instance.detach(conn);
        });
        ///////////////////////
        // New link process
        this.instance.bind("beforeDrop", function(conn) {
            // if(_this.concepts.get(conn.targetId).get('id_father') != "none"){
            //     alert("This concept already has a parent, please remove the old relationship before assign a new parent");
            //     return false;
            // }else{
            //     return true;
            // }
            return true;   
        });
        this.instance.bind("connection", function(info, originalEvent) {
            if(originalEvent){
                if(info.connection.scope == "cklink"){
                    var new_cklink = new global.Models.CKLink({
                        id :guid(),
                        user : bbmap.views.main.user,
                        date : getDate(),
                        source : info.sourceId,
                        target : info.targetId
                    });
                    new_cklink.save();
                    bbmap.views.main.links.add(new_cklink);

                }else{
                    bbmap.views.main.concepts.get(info.targetId).set({id_father : info.sourceId}).save();
                }    
            }
        });     
    },
    renderActionBar : function(){
        this.top_el.empty();
        this.bottom_el.empty();
        this.top_el.append(this.template_top({
            mode    : this.mode
        }));
        this.bottom_el.append(this.template_bottom({
            filter  : this.filter,
            mode    : this.mode
        }));
        this.top_el.find("#zoom_val").html(bbmap.zoom.get('val'));
        $( "#dropC" ).draggable();
        $( "#dropK" ).draggable();
        $( "#dropP" ).draggable();
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
            // this.concepts.forEach(function(model){
            //     bbmap.views.main.nodes_views[model.get('id')].addFollowFather();
            // });
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
        // EndPoint
        this.poches.forEach(function(model){
            bbmap.views.main.nodes_views[model.get('id')].addEndpoint();    
        });
        if(this.mode == "edit"){
            // Make its target
            this.poches.forEach(function(model){
                bbmap.views.main.nodes_views[model.get('id')].makeTarget();    
            });
            // Draggable
            this.poches.forEach(function(model){
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el));
            });
        }
    },
    renderCKLinks : function(){
        if(this.ckOperator == true){
            bbmap.views.main.links.each(function(l){
                try{
                    bbmap.views.main.instance.connect({
                        source:bbmap.views.main.nodes_views[l.get('source')].el, 
                        target:bbmap.views.main.nodes_views[l.get('target')].el, 
                        anchor:"AutoDefault",
                        scope : "cklink"
                    });
                }catch(err){
                    console.log("Missing element to etablish graphical connection...")
                }
            });    
        }
    },
    render : function(){        
        ///////////////////////
        // init
        if(this.nodes_views){
            _.each(this.nodes_views,function(view){
                view.removeView();
            });
            this.nodes_views = {};
        }
        this.instance.unbind('connection');
        this.instance.unbind('click');
        this.instance.unbind('beforeDetach');
        this.instance.unbind('beforeDrop')
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
        else if(this.filter == "k"){
            this.renderKnowledgesBulle();
        }
        else if(this.filter == "p"){
            this.renderPochesBulle();
        }
        else if(this.filter == "ck"){
            this.renderConceptsBulle();
            this.renderKnowledgesBulle();
            this.renderCKLinks();
        }
        else if(this.filter == "kp"){
            this.renderKnowledgesBulle();
            this.renderPochesBulle();   
            this.renderCKLinks();
        }
        else if(this.filter == "ckp"){
            this.renderConceptsBulle();
            this.renderKnowledgesBulle();
            this.renderPochesBulle();
            this.renderCKLinks();
        }
        ///////////////////////
        if(this.mode == "edit") this.showOverLays();
        else this.hideOverLays();
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
            if (_this.project.image == undefined || _this.project.image=="" || hasChanged == true){
                _this.screenshot(true);
            }
        });

        // $("#map_container").height(bbmap.window_height);

        return this;
    }
});
/////////////////////////////////////////////////