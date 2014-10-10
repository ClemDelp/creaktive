/////////////////////////////////////////////////
// ROUTER
/////////////////////////////////////////////////
bbmap.router = Backbone.Router.extend({
    routes: {
        ""  : "init",
        "visu": "visu",
        "edit": "edit",
        "timeline": "timeline"
    },
    init: function() {if(bbmap.views.main.init == true) bbmap.views.main.setMode("visu");},
    visu: function() {
        // Dès qu'on charge le mode visu, on prend un screenshot

        $.get("/bbmap/screenshot", function(data){
            console.log(data);
        })
        bbmap.views.main.setMode("visu");
    },
    edit: function() {bbmap.views.main.setMode("edit");},
    timeline: function() {bbmap.views.main.setMode("timeline");},
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','backInTimeline','advanceInTimeline','advanceInHistory','backInHistory','updateLastModelTitle','setLastModel');
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
        ////////////////////////////////
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
        this.notifications      = json.notifications;
        this.init               = json.init; // if true mean launch for the first time
        this.ckOperator         = json.ckOperator;
        ////////////////////////////////
        // Router
        this.workspace = new bbmap.router();
        ////////////////////////////////
        // Parameters
        this.isopen             = false;
        this.positionRef        = 550;
        this.color              = "gray";
        this.cursorX            = 0;
        this.cursorY            = 0;
        ////////////////////////////////
        // Timeline & history parameter
        this.timeline_pos       = 0;
        this.history_pos        = 0;
        this.localHistory       = new global.Collections.LocalHistory();
        this.sens               = "init";
        this.listener           = new window.keypress.Listener();
        this.flag               = "acceptLastNotif"
        ////////////////////////////////
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
                [ "Arrow", { 
                    location:1,
                    id:"arrow",
                    length:10,
                    foldback:0.5
                } ],
                [ "Label", { label:"x", id:"label", cssClass:"aLabel" }]
            ],
            Container:"map"
        });
        ////////////////////////////
        // Events
        this.listenTo(bbmap.zoom,'change',this.updateZoomDisplay,this);
        // this.listenTo(this.notifications,'add',this.timelineAdd,this);
        // this.listenTo(this.notifications,'remove',this.timelineRemove,this);
        this.listenTo(global.eventAggregator,'notification:add',this.updateLocalHistory,this);
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
            bbmap.views.main.cursorX = event.pageX;
            bbmap.views.main.cursorY = event.pageY;
            if(event.deltaY == -1)bbmap.views.main.zoomin()
            else bbmap.views.main.zoomout()

        });

        this.listener.simple_combo("ctrl z", this.backInHistory);
        this.listener.simple_combo("ctrl y", this.advanceInHistory);
        // Cursor position
        // $( document ).on( "mousemove", function( event ) {
        //     bbmap.views.main.cursorX = event.pageX;
        //     bbmap.views.main.cursorY = event.pageY;
        // });
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
        "click .reset" : "resetToCentroid",
        "click .window.poche" : "showIconPoche", 
        "click .window.knowledge" : "showIconKnowledge", 
        "mouseenter .window.concept" : "showDependances", 
        "click .window.concept" : "showIconConcept", 
        "click .structureSubTree" : "structureTree",
        "mouseleave .window" : "hideIcon", 
        //"click .closeEditor" : "hideEditor",
        "click #okjoyride" : "updateLastModelTitle",
        "click .screenshot" : "screenshot",
        "click .downloadimage" : "downloadimage",
        "click #showMenu" : "eventMenu",
        "click .prev" : "backInTimeline",
        "click .next" : "advanceInTimeline",
        "click .prevH" : "backInHistory",
        "click .nextH" : "advanceInHistory",
        "click .structureSubTree" : "structureTree"
    },
    /////////////////////////////////////////
    // Timeline gestion
    /////////////////////////////////////////
    initTimelineHistoryParameters : function(){
        this.timeline_pos       = 0;
        this.history_pos        = 0;
        this.sens               = "init";
    },
    backInTimeline : function(e){
        e.preventDefault();
        // console.log('backInTimeline')
        if(this.sens == "back") this.timeline_pos = this.timeline_pos + 1;
        if(this.timeline_pos >= this.notifications.length) this.timeline_pos = this.notifications.length - 1;
        else this.nextPrevActionController("back","timeline");
        if(this.sens != "back")this.sens = "back"; 
    },
    advanceInTimeline : function(e){
        e.preventDefault();
        // console.log('advanceInTimeline')
        if(this.sens == "next") this.timeline_pos = this.timeline_pos - 1;
        if(this.timeline_pos < 0) this.timeline_pos = 0;
        else this.nextPrevActionController("go","timeline");
        if(this.sens != "next")this.sens = "next";
    },
    /////////////////////////////////////////
    // LocalHistory gestion
    /////////////////////////////////////////
    displayHistoric : function(){
        console.log('history pos : ',this.history_pos,' - sens : ',this.sens)
        this.localHistory.each(function(h){
            console.log(h)           
        })
    },
    updateLocalHistory : function(model,from){
        if((model.get('from').id == global.models.current_user.get('id'))&&(this.flag == "acceptLastNotif")){
            if(this.sens != "init"){
                // on supprime tout ce qui est en dessous de history_pos (si on est à la psoition 2 on supprime 1 et 0)
                var new_array = _.rest(this.localHistory.toArray(),this.history_pos);
                this.localHistory.reset(new_array);
            }
            if(this.sens == "back"){ // on supprime la case courrant et on la remplace par la nouvelle action
                var new_array = _.rest(this.localHistory.toArray());
                this.localHistory.reset(new_array);
            }
            // on se remet à la position 0
            this.history_pos = 0;
            this.sens = 'init';
            // on ajoute l'action
            this.localHistory.unshift(model);
        }
        this.flag = "acceptLastNotif";
    },
    backInHistory : function(e){
        e.preventDefault();
        this.flag = "refuseLastNotif";
        if(this.sens == "back") this.history_pos = this.history_pos + 1;
        else this.sens = "back";
        // console.log(this.history_pos,this.sens,this.flag)
        if(this.history_pos >= this.localHistory.length) this.history_pos = this.localHistory.length - 1;
        else this.nextPrevActionController("back","history");
    },
    advanceInHistory : function(e){
        e.preventDefault();
        this.flag = "refuseLastNotif";
        if(this.sens == "next") this.history_pos = this.history_pos - 1;
        else this.sens = "next";
        // console.log(this.history_pos,this.sens,this.flag)
        // this.displayHistoric()
        if(this.history_pos < 0) this.history_pos = 0;
        else this.nextPrevActionController("go","history");
    },
    /////////////////////////////////////////
    // Action prev/next timeline/history gestion
    /////////////////////////////////////////
    nextPrevActionController : function(sens,from){
        var historic = {};
        var save = false;
        if(from == "history"){
            historic = this.localHistory.toArray()[this.history_pos];
            save = true;
        }
        else if(from == "timeline"){
            historic = this.notifications.toArray()[this.timeline_pos];
            $("#timeline_date").html(historic.get('date'));
        }
        var action = historic.get('action');
        var type = historic.get('object');
        var model = this.getTimelineHitoryModel(historic,type,sens,action);
        // Control sens to chose the right action
        if(((sens == "go")&&(action == "create")&&(type != "Link"))||((sens == "back")&&(action == "remove")&&(type != "Link"))){
            this.addModelToView(model,"history");
            if(save == true) model.save();
        }
        else if(((sens == "go")&&(action == "create")&&(type == "Link"))||((sens == "back")&&(action == "remove")&&(type == "Link"))){
            this.addLinkToView(model);
            if(save == true) model.save();
        }
        else if(((sens == "go")&&(action == "remove")&&(type != "Link"))||((sens == "back")&&(action == "create")&&(type != "Link"))){
            this.removeModelToView(model,"history");
            if(save == true) model.destroy();
        }
        else if(((sens == "go")&&(action == "remove")&&(type == "Link"))||((sens == "back")&&(action == "create")&&(type == "Link"))){
            this.removeLinkToView(model);
            if(save == true) model.destroy();
        }
        else if(action == "update"){
            global.eventAggregator.trigger(model.get('id')+"_server",model.toJSON(),save);
            if(save == true) model.save();
        }
    },
    getTimelineHitoryModel : function(historic,type,sens,action){
        // Creation du model
        // console.log(historic,type,sens,action)
        var type = type.toLowerCase();
        var model = new Backbone.Model();
        if((action == "update")&&(sens == "go")){
            if(type == "concept"){model = new global.Models.ConceptModel(historic.get('to'));}
            else if(type == "knowledge") model = new global.Models.Knowledge(historic.get('to'));
            else if(type == "poche") model = new global.Models.Poche(historic.get('to'));
            else if(type == "link") model = new global.Models.CKLink(historic.get('to'));
            // console.log("sens : go - get next model - model id: ",model.get('id'),model.get('title'));
        }else if((action == "update")&&(sens == "back")){
            if(type == "concept") model = new global.Models.ConceptModel(historic.get('old'));
            else if(type == "knowledge") model = new global.Models.Knowledge(historic.get('old'));
            else if(type == "poche") model = new global.Models.Poche(historic.get('old'));
            //else if(type == "link") model = new global.Models.CKLink(historic.get('old'));
        }else{
            if(type == "concept") model = new global.Models.ConceptModel(historic.get('to'));
            else if(type == "knowledge") model = new global.Models.Knowledge(historic.get('to'));
            else if(type == "poche") model = new global.Models.Poche(historic.get('to'));
            else if(type == "link") model = new global.Models.CKLink(historic.get('to'));
        }
        return model;
    },
    /////////////////////////////////////////
    // Overlays sur les connections
    /////////////////////////////////////////
    hideOverLays : function(){
        var connections = bbmap.views.main.instance.getAllConnections()
        connections.forEach(function(connection){
            //connection.hideOverlays();
            var overlay = connection.getOverlay("label");
            // now you can hide this Overlay:
            overlay.setVisible(false);
        });
    },
    showOverLays : function(){
        var connections = bbmap.views.main.instance.getAllConnections()
        connections.forEach(function(connection){
            //connection.showOverlays();
            var overlay = connection.getOverlay("label");
            overlay.setVisible(true);
        });
    },
    /////////////////////////////////////////
    // Modes & Filters
    /////////////////////////////////////////
    setMode : function(mode){
        // e.preventDefault();
        // this.mode = $(e.target).val();
        this.mode = mode;
        if(this.mode != "edit"){
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

        var zoomscale = bbmap.zoom.get('val');  //before take screenshot should change to the origin size
        var project_id = this.project.get('id');
        var moveLeft = (-$("#map")[0].offsetLeft)*(1-1.0/zoomscale);  //if zoomscale>1 we should move it to right else move to left
        var moveTop = (-$("#map")[0].offsetTop)*(1-1.0/zoomscale);
        var originLeft = $("#map")[0].offsetLeft;
        var originTop = $("#map")[0].offsetTop;
        var tmpscale = zoomscale;
        
        //On met le zoom à 1 sinon c'est le bazar dans les bulles
        if(tmpscale>1){                           //resize
            while(bbmap.zoom.get('val')>1){
                _this.zoomin("downloadimage");
            }
        }else{
            while(bbmap.zoom.get('val')<1){
                _this.zoomout("downloadimage");
            }
        }
        $("#map").offset({left:originLeft+moveLeft});   //change position
        $("#map").offset({top:originTop+moveTop});
        
        html2canvas($("#map.demo"), {
            width: $("#map")[0].offsetWidth,      
            height: $("#map")[0].offsetHeight,
            onrendered: function(bulleCanvas) {       //html2canvas can only find nodes not svgs
                /**
                On remet le zoom à l'état inital
                **/
                $("#map").offset({left:originLeft});       
                $("#map").offset({top:originTop});              
                if(tmpscale>1){
                    while(bbmap.zoom.get('val')<tmpscale){
                        _this.zoomout("downloadimage");
                    }
                }else{
                    while(bbmap.zoom.get('val')>tmpscale){
                        _this.zoomin("downloadimage");
                    }
                }

                /**
                Ajoute les lignes et les points qui sont au format SVG
                * canvas : les bulles
                * svgCanvas : tous les points et les lignes
                **/
                var svgCanvas = document.createElement("canvas");  //another canvas we will draw all the things left together to reproduce #map
                var context = svgCanvas.getContext("2d");
                svgCanvas.width = $("#map")[0].offsetWidth;
                svgCanvas.height = $("#map")[0].offsetHeight;

                var svgArray = $("#map>svg");                   // first we draw all the lines
                for (var i = 0; i < svgArray.length; i++) {
                    var top = parseFloat(svgArray[i].style.top);
                    var left = parseFloat(svgArray[i].style.left);
                    var height = svgArray[i].getAttribute("height");
                    var width = svgArray[i].getAttribute("width");
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = width;
                    tmpCanvas.height = height;
                    var svgTagHtml = svgArray[i].innerHTML;
                    canvg(tmpCanvas,svgTagHtml);                  //canvg is a library which can parse svg to canvas

                    context.drawImage(tmpCanvas,left,top);
                };

                var pointArray = $("._jsPlumb_endpoint>svg");   //than we are ganna draw all the points to svgCanvas
                var divArray = $("._jsPlumb_endpoint");         //cause the we can't get the position of points directly, we look at his parent div
                //console.log(divArray.length);
                for (var i = 0; i < divArray.length; i++) {
                    var top = parseFloat(divArray[i].style.top);
                    var left = parseFloat(divArray[i].style.left);
                    var height = parseFloat(divArray[i].style.height);
                    var width = parseFloat(divArray[i].style.width);
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = width;
                    tmpCanvas.height = height;
                    var svgTagHtml = pointArray[i].innerHTML;
                    canvg(tmpCanvas,svgTagHtml);

                    context.drawImage(tmpCanvas,left,top);
                };

                /**
                merger bulleCanvas and svgCanvas
                **/
                context = bulleCanvas.getContext("2d");                
                context.drawImage(svgCanvas,0,0);                
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
                //console.log(screenshot)
                // var aLink = document.createElement('a');
                // aLink.download = "screenshot";
                // aLink.href = screenshot;
                // document.body.appendChild(aLink);
                // aLink.click();
                // document.body.removeChild(aLink);

            }
        });    
    },
    /////////////////////////////////////////
    // Screenshot
    /////////////////////////////////////////
    screenshot : function(flag){
        $.get("/bbmap/screenshot", function(data){
            console.log(data);
        })
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
    /////////////////////////////////////////
    // LastModel actions
    /////////////////////////////////////////
    updateLastModelTitle : function(title){
        // if(title == ""){
        //     this.nodes_views[this.lastModel.get('id')].removeNode();
        // }else{
            this.lastModel.save({title:title});
        // }
    },
    setLastModel : function(model,from){
        this.lastModel = model;
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
        $("#showMenu").animate({right:"25%"});
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
            if(bbmap.views.templatesList) bbmap.views.templatesList.close();
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
            // Render & Append
            this.editModel_el.html(bbmap.views.modelEditor.render().el);
            this.editModel_el.append(bbmap.views.templatesList.render().el);
            this.attachementModel_el.html(bbmap.views.imagesList.render().el);
            this.attachementModel_el.append(bbmap.views.attachment.render().el);
            this.discussionModel_el.append(bbmap.views.comments.render().el);
        }
    },
    /////////////////////////////////////////
    // Zoom system
    /////////////////////////////////////////
    getZoomParameters : function(ref1,ref2){
        var json = {};
        json.deltaLeft = ref1.left - ref2.left; // deplacement en x d'un element de ref
        json.deltaTop  = ref1.top - ref2.top; // deplacement en y d'un element de ref
        var clientX = bbmap.views.main.cursorX; // position en x du cursor par rapport au document
        var clientY = bbmap.views.main.cursorY; // position en y du cursor par rapport au document
        var screenH = $(window).height();  // hauteur de la fenetre
        var screenW = $(window).width(); // largeur de la fenetre
        json.mapPosT = $("#map").offset().top; // position en x de la map
        json.mapPosL = $("#map").offset().left; // position en y de la map
        var zoom    = bbmap.zoom.get('val'); // zoom actuel
        json.deltaX  = ((screenW/2)-clientX) * 0.1; // valeur en x de la distance cursor centre de l'ecran
        json.deltaY  = ((screenH/2)-clientY) * 0.1; // valeur en y de la distance cursor centre de l'ecran
        return json;
    },
    targetToCursor : function(sens,json){    
        //console.log(deltaLeft,deltaTop,clientX,clientY,screenH,screenW,mapPosT,mapPosL,zoom,deltaX,deltaY,sens)
        if(sens == "out")$('#map').offset({ top: json.mapPosT+json.deltaTop+json.deltaY, left: json.mapPosL+json.deltaLeft+json.deltaX });
        if(sens == "in")$('#map').offset({ top: json.mapPosT+json.deltaTop-json.deltaY, left: json.mapPosL+json.deltaLeft-json.deltaX });
    },
    focusZoom : function(json){
        $('#map').offset({ top: json.mapPosT+json.deltaTop, left: json.mapPosL+json.deltaLeft });
    },
    zoomin : function(from){
        new_zoom = Math.round((bbmap.zoom.get('val') - 0.1)*100)/100;
        var ref1 = this.getOffsetRef();
        this.setZoom(new_zoom);
        var ref2 = this.getOffsetRef();
        var zoomParameters = this.getZoomParameters(ref1,ref2);
        if(!from) this.targetToCursor('in',zoomParameters);
        else this.focusZoom(zoomParameters);
    },
    zoomout : function(from){
        new_zoom = Math.round((bbmap.zoom.get('val') + 0.1)*100)/100;
        var ref1 = this.getOffsetRef();
        this.setZoom(new_zoom);
        var ref2 = this.getOffsetRef();
        var zoomParameters = this.getZoomParameters(ref1,ref2);
        if(!from) this.targetToCursor('out',zoomParameters);
        else this.focusZoom(zoomParameters);
    },
    getOffsetRef : function(){
        var ref = {'top':0, 'left':0}
        for (var k in bbmap.views.main.nodes_views){
            ref = bbmap.views.main.nodes_views[k].$el.offset();
            break;
        }
        return ref;
    },
    setZoom : function(zoom) {
        if((zoom > 0)&&(zoom<5)){
            zoom = Math.round(zoom* 10) / 10;
            bbmap.zoom.set({val : zoom});
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
            this.updateZoomDisplay();    
        }
    },
    updateZoomDisplay : function(zoom){
        this.top_el.find('#zoom_val').html(bbmap.zoom.get('val'))
    },
    resetZoom : function(){
        this.setZoom(bbmap.zoom.get('val'));
    },
    /////////////////////////////////////////
    // Tree re-structure
    /////////////////////////////////////////
    structureTree : function(e){
        e.preventDefault();
        //var id = e.target.id.split('_action')[0];
        var id = this.lastModel.get('id');
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
        if(e.target.getAttribute("data-type") == "title"){
            this.setLastModel(this.concepts.get(id),'showIconConcept')
            this.$(".icon").hide();
            if(this.mode == "edit") $("#"+id+" .icon").show();    
        }
    },
    showIconPoche : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(e.target.getAttribute("data-type") == "title"){
            this.setLastModel(this.poches.get(id),'showIconPoche');
            this.$(".icon").hide();
            if(this.mode == "edit"){
                $("#"+id+" .sup").show();  
                $("#"+id+" .ep3").show();  
                $("#"+id+" .ep2").show();  
            }
        }
        
    },
    showIconKnowledge : function(e){
        e.preventDefault();
        var id = e.target.id;
        if(e.target.getAttribute("data-type") == "title"){
            this.setLastModel(this.knowledges.get(id),'showIconKnowledge');
            this.$(".icon").hide();
            if(this.mode == "edit"){
                $("#"+id+" .sup").show();  
                $("#"+id+" .ep3").show();  
                $("#"+id+" .ep").show();  
            }
        }
    },
    hideIcon : function(e){
        e.preventDefault();
        var id = e.target.id;
        // if(this.mode == "edit") this.$(".icon").hide();
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
    // Intelligent restructuration :
    // superpose centroid Map and centroid screen and recenter data
    /////////////////////////////////////////
    intelligentRestructuring : function(){
        this.superposeMapCenterToScreenCenter();
        //this.moveDataCentroidToMapCentroid();
        this.resetToCentroid();
        this.instance.repaintEverything();
    },
    superposeMapCenterToScreenCenter : function(){
        var zoom = bbmap.zoom.get('val');
        var screenCentroid = api.getScreenCentroid();
        var mapCentroid = api.getMapCentroid($('#map').width(),$('#map').height());
        var mapOffset = $('#map').offset(); // position relative to the document
        var screenCentroid = api.getScreenCentroid();
        var delta_left = - mapOffset.left + (screenCentroid.left - mapCentroid.left*zoom);
        var delta_top = - mapOffset.top + (screenCentroid.top - mapCentroid.top*zoom);
        $('#map').offset({ top: mapOffset.top + delta_top, left: mapOffset.left + delta_left });
    },
    
    /////////////////////////////////////////
    // Centroid functions
    /////////////////////////////////////////
    resetToCentroid : function(){
        if(api.getJsonSize(bbmap.views.main.nodes_views)>5) this.findRightZoom();
        if(api.getJsonSize(bbmap.views.main.nodes_views)>2) this.findRightCentroid();
    },
    findRightCentroid : function(){
        var zoom = bbmap.zoom.get('val');
        var dataCentroid = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()); // coordonnée du barycentre des nodes
        var screenCentroid = api.getScreenCentroid(); // coordonnée du barycentre de l'ecran
        var delta = {}; // distance in x,y that map have to move to center dataCentroid to screen
        // calcul delta 
        delta.top = screenCentroid.top - dataCentroid.top;
        delta.left = screenCentroid.left - dataCentroid.left;
        // superpose data and screen centroid 
        $('#map').offset({ top: delta.top, left: delta.left });
    },
    findRightZoom : function(Data,Screen){
        var Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()); // coordonnée du barycentre des données
        var Screen = api.getScreenCentroid(); // coordonnée du barycentre de l'ecran
        var zoom = bbmap.zoom.get('val');
        var k = 1.5;
        if(Data.width>Data.height){
            // width > height
            if(Data.width>Screen.width){
                // dezoom
                while(k*Data.width>Screen.width){
                    zoom = zoom - 0.1;
                    bbmap.views.main.setZoom(zoom);
                    Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews())
                }

            }else if(Data.width<Screen.width){
                // zoom
                while(k*Data.width<Screen.width){
                    zoom = zoom + 0.1;
                    bbmap.views.main.setZoom(zoom);
                    Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews())
                }
            }
        }else{
            // width < height
            if(Data.height>Screen.height){
                // dezoom
                while(k*Data.height>Screen.height){
                    zoom = zoom - 0.1;
                    bbmap.views.main.setZoom(zoom);
                    Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews())
                }
            }else if(Data.height<Screen.height){
                // zoom
                while(k*Data.height<Screen.height){
                    zoom = zoom + 0.1;
                    bbmap.views.main.setZoom(zoom);
                    Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews())
                }
            }
        }
    },
    moveDataCentroidToMapCentroid : function(){
        var delta = api.getXYTranslationBtwTwoPoints(api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()),api.getMapCentroid($('#map').width(),$('#map').height()));
        for (var id in bbmap.views.main.nodes_views){
            var view = bbmap.views.main.nodes_views[id];
            var position = view.getPosition();
            var x = position.left + delta.x;
            var y = position.top + delta.y;
            view.setPosition(x/bbmap.zoom.get('val'),y/bbmap.zoom.get('val'),0,0,true,"restructuration");
        }
    },
    // getScreenCentroid : function(){
    //     var screenCentroid = {};
    //     var windowWidth = $('body').width();
    //     var windowHeight = $('body').height();
    //     // Screen centroid calcul
    //     screenCentroid.top = windowHeight/2;
    //     screenCentroid.left = windowWidth/2;
    //     screenCentroid.width = windowWidth;
    //     screenCentroid.height = windowHeight;
    //     return screenCentroid;
    // },
    // getDataCentroid : function(){
    //     var topMax = 0;
    //     var topMin = 1000000000;
    //     var leftMax = 0;
    //     var leftMin = 1000000000;
    //     var dataCentroid = {};
    //     var views = bbmap.views.main.nodes_views;
    //     for (var id in views){
    //         var position = views[id].getPosition();
    //         if(position.top > topMax) topMax = position.top;
    //         if(position.top < topMin) topMin = position.top;
    //         if(position.left > leftMax) leftMax = position.left;
    //         if(position.left < leftMin) leftMin = position.left;
    //     }
    //     dataCentroid.top = ((topMax-topMin)/2)+topMin;
    //     dataCentroid.left = ((leftMax-leftMin)/2)+leftMin;
    //     dataCentroid.width = leftMax - leftMin;
    //     dataCentroid.height = topMax - topMin;
    //     return dataCentroid;
    // },
    getCoordinatesOfNodesViews : function(){
        var coordinates = [];
        // console.log("size : ",_.toArray(bbmap.views.main.nodes_views).length)
        for (var id in bbmap.views.main.nodes_views){
            var position = bbmap.views.main.nodes_views[id].getPosition();
            coordinates.unshift({'top':position.top,'left':position.left});
        }
        return coordinates;
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
        
        this.addModelToView(new_concept);
    },
    /////////////////////////////////////////
    // Add remove model/link to view
    /////////////////////////////////////////
    addModelToItsCollection : function(model){
        if(model.get('type') == "concept") this.concepts.add(model);
        else if(model.get('type') == "knowledge") this.knowledges.add(model);
        else if(model.get('type') == "poche") this.poches.add(model);
    },
    addModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        var type = model.get('type');
        this.setLastModel(model,'addModelToView');
        new_view = new bbmap.Views.Node({
            className : "window "+type,
            id : model.get('id'),
            model : model,
        });
        this.addModelToItsCollection(model);

        this.map_el.append(new_view.render().el);
        new_view.addEndpoint();
        new_view.makeTarget();

        this.instance.draggable($(new_view.el),{ containment: "#map", scroll: false });
        this.nodes_views[model.get('id')] = new_view;
        new_view.addLink();
        if(origin == "client"){
            this.startJoyride();
        }
    },
    removeModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        //console.log(this.nodes_views[model.get('id')])
        this.nodes_views[model.get('id')].removeView();
    },
    addLinkToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        // console.log("model : ",model)
        // console.log("model source : ",model.get('source'))
        // console.log(bbmap.views.main.nodes_views[model.get('source')])
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
        });
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
            bbmap.views.main.nodes_views[conn.targetId].unbindFollowFather();
        });
        ///////////////////////
        // New link process
        this.instance.bind("beforeDrop", function(conn) {
            if(conn.targetId == conn.sourceId){
                alert('impossible to link an object to itself');
                return false;
            }else{
                return true;
            }
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
                    bbmap.views.main.nodes_views[info.targetId].bindFollowFather();
                }    
            }
        });     
    },
    ////////////////////////////////////////
    // Drawin aid session
    ////////////////////////////////////////
    drawingAid : function(model){
        var currentView = bbmap.views.main.nodes_views[model.get('id')];
        var currentViewCentroid = currentView.getCentroid();
        var views = bbmap.views.main.nodes_views;
        for (var id in views){
            if ((id != model.get('id'))&&(views.hasOwnProperty(id))) {
                var zoom = bbmap.zoom.get('val');
                var view = views[id];
                var centroid = view.getCentroid();
                var width = 0;
                var height = 0;
                var left = 0;
                var top = 0;
                var x1 = 0;
                var x2 = 0;
                var y1 = 0;
                var y2 = 0;
                if(Math.floor(centroid.top) == Math.floor(currentViewCentroid.top)){
                    // console.log('horrizontal alignement!')
                    var width = abs(centroid.left - currentViewCentroid.left);
                    var height = 10;
                    if(centroid.left < currentViewCentroid.left){
                        left = centroid.left;
                        top = centroid.top;
                        x2 = currentViewCentroid.left;
                    }else{
                        left = currentViewCentroid.left;
                        top = currentViewCentroid.top;
                        x2 = centroid.left
                    }
                    this.drawSvgLine(model.get('id'),width,height,left,top,x1,x2,y1,y2,zoom);    
                }

                if(Math.floor(currentViewCentroid.left) == Math.floor(centroid.left)){
                    // console.log("vertical alignement!");
                    var width = 10;
                    var height = abs(centroid.top - currentViewCentroid.top);
                    if(centroid.top < currentViewCentroid.top){
                        left = centroid.left;
                        top = centroid.top;
                        y2 = height;
                    }else{
                        left = centroid.left;
                        top = currentViewCentroid.top;
                        y2 = height;
                    }
                    this.drawSvgLine(model.get('id'),width,height,left,top,x1,x2,y1,y2,zoom);
                }
                this.hideSvgLine(model.get('id'),id);
            }
        }
    },
    drawSvgLine : function(id_source,width,height,left,top,x1,x2,y1,y2,zoom){
        delta = 10;
        left = (left + delta )/ zoom;
        top = (top + delta )/ zoom;
        // x1 = x1 / zoom;
        // x2 = x2 / zoom;
        // y1 = y1 / zoom;
        // y2 = y2 / zoom;

        // console.log("width:",width,"- height:",height,"- left:",left,"- top:",top,"- x1:",x1,"- x2:",x2,"- y1:",y1,"- y2:",y2);               
        this.map_el.append('<svg class="'+id_source+'_svg" style="position:absolute;left:'+left+'px;top:'+top+'px" width="'+width+'" height="'+height+'" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml" class="_jsPlumb_connector"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:black;stroke-width:2px;" /></svg>')
    },
    hideSvgLine : function(id_source){
        $('.'+id_source+"_svg").hide('slow')
    },
    ////////////////////////////////////////
    renderActionBar : function(){
        this.top_el.empty();
        this.bottom_el.empty();
        this.top_el.append(this.template_top({
            filter  : this.filter,
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
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el),{ containment: "#map", scroll: false });
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
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el),{ 
                    containment: "#map", 
                    scroll: false,
                    drag : function(e){
                        if(global.drawingAid == true) bbmap.views.main.drawingAid(model);
                    }
                });
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
                bbmap.views.main.instance.draggable($(bbmap.views.main.nodes_views[model.get('id')].el),{ containment: "#map", scroll: false });
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
                    //console.log("Missing element to etablish graphical connection...")
                }
            });    
        }
    },
    render : function(){  //alert('render')
        var _this = this;
        this.map_el.empty();
        ///////////////////////
        // init
        if((this.init == false)&&(this.sens != "init")){ // Si on change de mode et on a utiliser le prev/next de la timeline ou de l'historic
            // console.log("--Mode ",this.mode," activated")
            // console.log("----start global fetching process...")
            bbmap.views.main.concepts.fetch({
                error: function () {},
                success: function () {
                    // console.log("------concept fetched...");
                },
                complete: function () {
                    bbmap.views.main.knowledges.fetch({
                        error: function () {},
                        success: function () {
                            // console.log("------knowledges fetched...");
                        },
                        complete: function () {
                            bbmap.views.main.poches.fetch({
                                error: function () {},
                                success: function () {
                                    // console.log("------poches fetched...");
                                },
                                complete: function () {
                                    bbmap.views.main.links.fetch({
                                        error: function () {},
                                        success: function () {
                                            // console.log("------links fetched...");
                                        },
                                        complete: function () {
                                            // console.log('----global fetching process done')
                                            bbmap.views.main.init = true;
                                            bbmap.views.main.render();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }else{
            // On supprime toutes les vues + les events sur tous les objets
            if(this.nodes_views){
                _.each(this.nodes_views,function(view){
                    view.removeView("init");
                });
                this.nodes_views = {};
            }
            this.instance.unbind('connection');
            this.instance.unbind('click');
            this.instance.unbind('beforeDetach');
            this.instance.unbind('beforeDrop')
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
             jsPlumb.draggable($('#map'))
            //$('#map').draggable();
            // css3 generator
            if(bbmap.views.css3)bbmap.views.css3.remove();
            bbmap.views.css3 = new CSS3GENERATOR.Views.Main();
            // CSS3 Button generator
            this.css3Model_el.html(bbmap.views.css3.render().el);
            CSS3GENERATOR.attach_handlers();
            CSS3GENERATOR.initialize_controls();
            CSS3GENERATOR.update_styles();
            // move DataCentroid To MapCentroid
            if((this.init == true)&&(this.sens == "init")){
                this.moveDataCentroidToMapCentroid();
            }
            //
            this.initTimelineHistoryParameters();
            
            if(this.mode == "edit") $('#map').css('background-image', 'url(/img/pattern.png)');
            else $('#map').css('background', 'transparent');


            // $.get('/BBmap/image', function(hasChanged){
            //     if (_this.project.image == undefined || _this.project.image=="" || hasChanged == true){
            //         _this.screenshot(true);
            //     }
            // });

            this.init = false; 
            this.intelligentRestructuring();
        }

        
        
        


        return this;
    }
});
/////////////////////////////////////////////////
