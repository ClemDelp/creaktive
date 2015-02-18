/////////////////////////////////////////////////
// ROUTER
/////////////////////////////////////////////////
bbmap.router = Backbone.Router.extend({
    routes: {
        ""  : "init",
        //"visu/:zoom/:left/:top/:invisibility": "visuCustom",
        "controller": "controller",
        // "edit": "edit",
        // "timeline": "timeline"
    },
    controller : function(){
        var permissions = global.collections.Permissions;
        var currentUser = global.models.current_user;
        var perm = permissions.where({user_id : currentUser.get('id')})
        if((perm.length > 0)&&((perm[0].get('right') == "admin")||(perm[0].get('right') == "rw"))) bbmap.views.main.setMode("edit",true);
        else bbmap.views.main.setMode("visu",true);
    },
    init: function(){
        if(bbmap.views.main.init == true){
            var permissions = global.collections.Permissions;
            var currentUser = global.models.current_user;
            var perm = permissions.where({user_id : currentUser.get('id')})
            if((perm.length > 0)&&((perm[0].get('right') == "admin")||(perm[0].get('right') == "rw"))) bbmap.views.main.setMode("edit",true);
            else bbmap.views.main.setMode("visu",true);
        }
    },
    // visu: function() {
    //     bbmap.views.main.setMode("visu",true);
    // },
    // edit: function() {
    //     bbmap.views.main.setMode("edit",true);
    // },
    // timeline: function() {
    //     bbmap.views.main.setMode("timeline",true);
    // },
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','deleteButton','advanceInHistory','backInHistory','updateLastModelTitle','setLastModel');
        ////////////////////////////
        // el
        this.top_el = $(this.el).find('#top_container');
        this.bottom_el = $(this.el).find('#bbmap_bottom_ui');
        this.map_el = $(this.el).find('#map');
        this.timeline_el = $(this.el).find('#timeline_container');
        this.css3Model_el = $(this.el).find('#css3Model');
        this.googleSearchModel_el = $(this.el).find('#googleSearchModel');
        ////////////////////////////////
        // Objects
        this.elements           = json.elements;
        // this.knowledges         = json.knowledges;
        // this.concepts           = json.concepts;
        this.user               = json.user;
        this.users              = json.users;
        this.project            = json.project;
        //this.poches             = json.poches;
        this.links              = json.links;
        this.eventAggregator    = json.eventAggregator;
        this.lastModel          = new Backbone.Model();
        this.nodes_views        = {};
        this.mode               = json.mode;
        this.filter             = json.filter;
        this.notifications      = json.notifications;
        this.init               = json.init; // if true mean launch for the first time
        this.ckOperator         = json.ckOperator;
        this.news               = json.news;
        ////////////////////////////////
        // Router
        this.workspace = new bbmap.router();
        ////////////////////////////////
        // Parameters
        this.joyride            = false;
        this.deltaX             = 0;
        this.invisibility       = false; // if true hide all icone and menu
        this.isopen             = false;
        this.autOpen            = true;
        this.positionRef        = 550;
        this.color              = "gray";
        this.cursorX            = 0;
        this.cursorY            = 0;
        this.visualMode         = "children"; // children/node/parent respectivly display childrens concept/ parents concepts + knowledges associate / knowledges associate to concept
        this.jeton              = true; // jeton pourevite que le center soit utilisé 2 fois simultanement
        this.moduleSideBar      = "edit";
        ////////////////////////////////
        // Timeline & history parameter
        this.timeline_pos       = 0;
        this.history_pos        = 0;
        this.localHistory       = new global.Collections.LocalHistory();
        this.sens               = "init";
        this.listener           = new window.keypress.Listener();
        this.flag               = "acceptLastNotif";
        this.presentation       = "graph"; // can be graph/timeline/split
        ////////////////////////////////
        // Templates
        this.template_bottom = _.template($('#bbmap-bottom-element-template').html());
        this.template_joyride = _.template($('#bbmap-joyride-template').html());
        this.template_tooltip = _.template($('#bbmap-tooltip-notif-template').html());
        ////////////////////////////
        // JsPlumb
        this.instance = jsPlumb.getInstance({           
            Connector : [ "Bezier", { curviness:50 } ],
            DragOptions : { cursor: "pointer", zIndex:2000 },
            PaintStyle : { strokeStyle:this.color, lineWidth:1 },
            EndpointStyle : { radius:1, fillStyle:this.color },
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
        this.listenTo(this.elements, 'add', this.addModelToView);
        this.listenTo(this.elements, 'remove', this.removeModelToView);
        this.listenTo(this.links, 'add', this.addLinkToView);
        this.listenTo(this.links, 'remove', this.removeLinkToView);

        // Real-time
        //global.eventAggregator.on('model:create',this.addModelToView,this);
        //global.eventAggregator.on('model:remove',this.removeModelToView,this);
        //global.eventAggregator.on('link:create',this.addLinkToView,this);
        //global.eventAggregator.on('link:remove',this.removeLinkToView,this);
        
        // zoom-in & zoom-out avec la moulette
        this.multiple = 0;
        this.map_el.mousewheel(function(event) {
            event.preventDefault();
            //console.log(event.deltaY);
            if(bbmap.views.main.multiple%3 == 0){
                bbmap.views.main.cursorX = event.pageX;
                bbmap.views.main.cursorY = event.pageY;
                if(event.deltaY < 0)bbmap.views.main.zoomin()
                else bbmap.views.main.zoomout()    
            }
            bbmap.views.main.multiple +=1;
        });

        this.listener.simple_combo("ctrl z", this.backInHistory);
        this.listener.simple_combo("ctrl y", this.advanceInHistory);
        this.listener.simple_combo("delete", this.deleteButton);
        ///////////////////////////////
        // Prend un screenshot quand on quitte bbmap
        window.onbeforeunload = function (e){
            $.get("/bbmap/removeNews?user="+bbmap.views.main.user.get('id')+"&project="+bbmap.views.main.project.id);
            //$.get("/bbmap/screenshot?currentProject="+bbmap.views.main.project.id, function(data){console.log(data);});
        };
        $("body").css({"overflow":"hidden"}); // IMPORTANT

        //Tell phantomjs that the page is loaded for screenshot
        if (typeof window.callPhantom === 'function') {
            Pace.on("done", function(){
                setTimeout(function(){ 
                    window.callPhantom({ hello: 'world' });
                }, 1000);                
            })
        }
        ////////////////
        this.statistics = new bbmap.Views.Stat({
            elements : this.elements,
            links : this.links,
        });
    },
    events : {
        "change #visu_select_mode" : "setVisualMode",
        "change #filterSelection" : "setFilter",
        "mouseup .dropC" : "newConceptUnlinked",
        "mouseup .dropK" : "newKnowledgeUnlinked",
        "mouseup .dropP" : "newPocheUnlinked",
        "click .ckOperator" : "setCKOperator",

        "click .zoomin"     : "zoomin",
        "click .zoomout"    : "zoomout",
        "click .reset"      : "resetToCentroid",
        "click .edit"       : "editEvent",
        "click .design"     : "designEvent",
        "click .history"    : "historyEvent",
        "click .web"        : "web",

        "click .closeSibeBar" : "closeSibeBar",
        "mouseover .window" : "showChildrens",
        "mouseleave .window" : "hideChildrens",
        "click .window" : "showIcon", 
        "click .structureSubTree" : "treeClassification",
        //"click .structureSubTree" : "structureTree",
        "click #okjoyride" : "updateLastModelTitle",
        "click .screenshot" : "screenshot",
        "click .downloadimage" : "laurie",
        //"click #showMenu" : "eventMenu",
        "click .prevH" : "backInHistory",
        "click .nextH" : "advanceInHistory",
         "click .structureSubTree" : "treeClassification",
        //"click .structureSubTree" : "structureTree",
    },
    svgWindowController : function(){
        $('body .svg_window').remove();
        var c_candidats = bbmap.views.main.elements.where({type:"concept",id_father:"none"})
        var p_candidats = bbmap.views.main.elements.where({type:"poche",id_father:"none"})
        var peres = _.union(c_candidats,p_candidats)
        peres.forEach(function(pere){
            bbmap.views.main.drawSvgWindow(pere);
        });

        this.statistics.render();

    },
    drawSvgWindow : function(pere){
        var elements = api.getTreeChildrenNodes(pere,bbmap.views.main.elements);
        elements.push(pere);
        var cadre = this.getCadre(elements,100);
        var color = "#E67E22";
        if(pere.get('type') == "concept") color = "#C8D400";
        var left = cadre.left_min - 25;
        var right = cadre.top_min - 30;
        var text = pere.get('title')+" ("+(api.getTreeChildrenNodes(pere,bbmap.views.main.elements).length+1)+" elements)";
        this.map_el.append('<svg class="svg_window" style="position:absolute;left:'+left+'px;top:'+right+'px" width="'+cadre.width+'" height="'+cadre.height+'" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml"><text x="5" y="10" font-family="sans-serif" font-size="10px" fill="'+color+'">'+text+'</text><rect rx="10" ry="10" x="0" y="0" width="'+cadre.width+'" height="'+cadre.height+'" stroke-width="3" stroke="'+color+'" fill="transparent" /></svg>')
    },
    getCadre : function(elements,offset){
        var left_min = 10000000000000000000000;
        var left_max = 0;
        var top_min = 10000000000000000000000;
        var top_max = 0;
        // on prend le cadre
        elements.forEach(function(el){
            if(el.get('left') < left_min) left_min = el.get('left')
            if((el.get('left') + $('#'+el.get('id')).width()+offset) > left_max) left_max = el.get('left') + $('#'+el.get('id')).width() + offset;
            if(el.get('top') < top_min) top_min = el.get('top')
            if((el.get('top') + $('#'+el.get('id')).height()+offset) > top_max) top_max = el.get('top') + $('#'+el.get('id')).height() + offset;
        });
        // on definit la hauteur + largeur du cadre
        var cadre_width = left_max - left_min;
        var cadre_height = top_max - top_min;
        return {width:cadre_width,height:cadre_height,left_min:left_min,left_max:left_max,top_min:top_min,top_max:top_max};
    },
    laurie : function(e){
        e.preventDefault();
        var padding_left = -100;
        var padding_top = -100;
        var offset = 250;
        var childs = [];
        var cadre = this.getCadre(bbmap.views.main.elements.toArray(),300);
        var left_min = cadre.left_min + padding_left;
        var left_max = cadre.left_max;
        var top_min = cadre.top_min + padding_top;
        var top_max = cadre.top_max;
        var cadre_width = cadre.width;
        var cadre_height = cadre.height;
        // on crée l'element cadre
        var cadre = $('<div>',{id:'youhou',style:'width:'+cadre_width+'px;height:'+cadre_height+'px;',class:'chart-demo'});
        var childs = $("#map > .window").clone();
        _.forEach(childs,function(child){
            var el_width = $('#'+$(child).attr('id')).width();
            var el_heigth = $('#'+$(child).attr('id')).height();
            $(child).css( "top", "-="+ top_min);
            $(child).css( "left", "-="+left_min );
            $(child).css( "width", el_width+50 );
            cadre.append(child)
        })
        //
        $('body').prepend(cadre)
        html2canvas($(cadre).get(0), {
            onrendered: function(canvas) {
                var svgTags = $('#map > svg');
                //var canvas = $('#mon_canvas')[0];
                //canvas.height = height;
                //canvas.width = width;
                var ctx = canvas.getContext('2d');
                ////
                _.forEach(svgTags, function(svgElem){
                    var svgNode = svgElem.cloneNode(true);
                    $(svgNode).css( "top", "-="+ top_min);
                    $(svgNode).css( "left", "-="+left_min );
                    var top = svgNode.style.top;
                    var left = svgNode.style.left;                 
                    var div = document.createElement('div');
                    div.appendChild(svgNode);
                    var svgTag = div.innerHTML;
                    ctx.drawSvg(svgTag, left, top);
                });
                // canvas is the final rendered <canvas> element
                $('#tutu').append(canvas)

                var imgData = canvas.toDataURL("image/png");
                window.open(imgData);
                $("#youhou").remove();
            }
        });
    },
    ///////////////////////////////////////////
    treeClassification : function(e){
        e.preventDefault();
        var pere = this.lastModel.get('id');
        var elements = TreeClassification.alignHF(pere,75,75,bbmap.views.main.elements.toJSON());
        elements.forEach(function(el){
            bbmap.views.main.elements.get(el.id).save(el)
        });
        setTimeout(function(){
            bbmap.views.main.instance.repaintEverything();
            bbmap.views.main.svgWindowController();
        },1000);
    },
    deleteButton : function(){
        var view = this.nodes_views[this.lastModel.get('id')]
        this.lastModel = new Backbone.Model();
        view.removeConfirmSwal();
    },
    /////////////////////////////////////////
    // Init Map
    /////////////////////////////////////////
    initMap : function(zoom,left,top){
        this.setZoom(zoom);
        $('#map').offset({top:top, left:left})
    },
    getMapParameters : function(){
        var json = {};
        json.zoom = bbmap.zoom.get('val');
        json.left = $('#map').offset().left;
        json.top = $('#map').offset().top;
        return json;
    },
    /////////////////////////////////////////
    // LocalHistory gestion
    /////////////////////////////////////////
    displayHistoric : function(){
        console.log('nbr: ',this.localHistory.length,' - pos: ',this.history_pos,' - sens: ',this.sens)
        this.localHistory.each(function(h){
            console.log(h)           
        })
    },
    updateLocalHistory : function(model,from){
        var user_id = bbmap.views.main.users.get(model.get('user')).id
        if((user_id == global.models.current_user.get('id'))&&(this.flag == "acceptLastNotif")){
            this.pushNotif(model);
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
        }else{
            $('.qtip').qtip('destroy', true);
            //$('#'+model.get('to').id+'_tooltip').qtip('destroy', true);
            setTimeout(function(){
                var user = bbmap.views.main.users.get(model.get('user'))
                $('#'+model.get('to').id+'_tooltip').qtip({
                    content: {
                        text: bbmap.views.main.template_tooltip({
                            notif:model.toJSON(),
                            user : user.toJSON()
                        })
                    },
                    events: {
                        show: function(event, api) {
                            setTimeout(function(){$('#'+model.get('to').id+'_tooltip').qtip('destroy', true);},5000);
                        }
                    },
                    show: {
                        ready: true
                    },
                    position: {
                        my: 'bottom left',  // Position my top left...
                        at: 'top left', // at the bottom right of...
                        target: $('#'+model.get('to').id+'_tooltip') // my target
                    }
                });
            },500);
        }
        this.flag = "acceptLastNotif";
    },
    pushNotif : function(notif){
        var content = "";
        var type = 'notice';
        if(notif.get('attr')[0] == "create"){content = notif.get('object')+" successfully created";type = 'success';}
        if(notif.get('attr')[0] == "remove"){content = notif.get('object')+" successfully removed";type = 'error';}
        if(notif.get('attr')[0] == "css") {content = notif.get('object') + " template updated";type = 'warning';}
        if(notif.get('attr')[0] == "title") {content = notif.get('object') + " title updated";type = 'notice';}
        if(content != ""){
            var n = {
                wrapper:document.body,
                message:'<p>'+content+'</p>',
                layout:'growl',
                effect:'slide',
                type:type,
                ttl:2000,
                archiveButton:false
            }    
            nlib.simplePush(n);
        }
    },
    backInHistory : function(e){
        e.preventDefault();
        this.flag = "refuseLastNotif"; // IMPORTANT! to not add to local history its own actions
        if(this.sens == "back") this.history_pos = this.history_pos + 1;
        else this.sens = "back";
        // console.log(this.history_pos,this.sens,this.flag)
        if(this.history_pos >= this.localHistory.length) this.history_pos = this.localHistory.length - 1;
        else this.nextPrevActionController("back","history");
    },
    advanceInHistory : function(e){
        e.preventDefault();
        this.flag = "refuseLastNotif"; // IMPORTANT! to not add to local history its own actions
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
        var historic = this.localHistory.toArray()[this.history_pos];
        var action = historic.get('action');
        var type = historic.get('object');
        var model = this.getTimelineHitoryModel(historic,type,sens,action);
        // Control sens to chose the right action
        if(((sens == "go")&&(action == "create")&&(type != "Link"))||((sens == "back")&&(action == "remove")&&(type != "Link"))){
            this.addModelToView(model,"history");
            model.save();
        }
        else if(((sens == "go")&&(action == "create")&&(type == "Link"))||((sens == "back")&&(action == "remove")&&(type == "Link"))){
            this.addLinkToView(model);
            model.save();
        }
        else if(((sens == "go")&&(action == "remove")&&(type != "Link"))||((sens == "back")&&(action == "create")&&(type != "Link"))){
            this.removeModelToView(model,"history");
            model.destroy();
        }
        else if(((sens == "go")&&(action == "remove")&&(type == "Link"))||((sens == "back")&&(action == "create")&&(type == "Link"))){
            this.removeLinkToView(model);
            model.destroy();
        }
        else if(action == "update"){
            var m = bbmap.views.main.elements.get(model.get('id'))
            m.save(model.toJSON())
            //global.updateElement(model,model.toJSON())
        }
    },
    getTimelineHitoryModel : function(historic,type,sens,action){
        // Creation du model
        // console.log(historic,type,sens,action)
        var type = type.toLowerCase();
        var model = new Backbone.Model();
        if((action == "update")&&(sens == "back")){
            model = new global.Models.Element(historic.get('old'));
        }else{
            if(type == "link") model = new global.Models.CKLink(historic.get('to'));
            else model = new global.Models.Element(historic.get('to'));
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
    setMode : function(mode,initPos){
        this.mode = mode;
        if(this.lastModel.get('id')) this.updateEditor(this.lastModel);
        // $('#cbp-spmenu-s1').hide('slow');
        // $('#showMenu').hide('slow');
        // if(this.isopen==true){
        //     var menu = document.getElementById( 'cbp-spmenu-s1' );
        //     classie.toggle( menu, 'cbp-spmenu-open' );
        //     this.hideMenu();
        // }
        // Set Modules mode
        //if(usersList.views.main != undefined) usersList.views.main.setMode(this.mode);

        this.render(initPos);
    },
    setFilter : function(e){
        e.preventDefault();
        this.filter = $(e.target).val();
        this.render();
    },
    setVisualMode : function(e){
        e.preventDefault();
        this.visualMode = $( "#visu_select_mode option:selected").val();
        console.log('visual mode set to ',this.visualMode);
    },
    /////////////////////////////////////////
    // Downdloadimage
    /////////////////////////////////////////
    downloadimage : function(e){
       e.preventDefault();
       var json = this.getMapParameters();

        $.fileDownload("/bbmap/downloadScreenshot?zoom="+json.zoom+"&left="+json.left+"&top="+json.top+"&window_w="+$(window).width()+"&window_h="+$(window).height()+"&currentProject="+bbmap.views.main.project.id, {
            prepareCallback : function(){
                swal("We are preparing your screenshot"," please wait...","success");
            },
            successCallback : function(){
                swal("Screenshot downloaded.");
            },
            failCallback: function (html, url) {
                swal('Error',html,'error');
            }
        });

        return false;

    },
    /////////////////////////////////////////
    // Drop new data on map
    /////////////////////////////////////////
    newPocheUnlinked : function(e){
        var pos = $('#dropP').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        var new_element = global.newElement("poche","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
    },
    newConceptUnlinked : function(e){
        var pos = $('#dropC').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        var new_element = global.newElement("concept","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
    },
    newKnowledgeUnlinked : function(e){
        var pos = $('#dropK').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        var new_element = global.newElement("knowledge","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
    },
    newViewAndLink : function(source,target,top,left,pos){
        // On centre la map sur l'element
        var position = {top:(top*bbmap.zoom.get('val')) + $('#map').offset().top,left:(left*bbmap.zoom.get('val')) + $('#map').offset().left};
        if(pos) position = pos; // pour prendre la position du drop button
        this.centerToElement(position,function(){
            // On ajoute le model à la view
            // bbmap.views.main.addModelToView(new_element);
            // LINK
            if(source != "none"){
                var new_cklink = global.newLink(source,target);
                //bbmap.views.main.addLinkToView(new_cklink)
                bbmap.views.main.svgWindowController();
            } 
        });
    },
    startJoyride : function(){
        $("#joyride_id").attr('data-id',this.lastModel.get('id')+'_joyride')
        $(document).foundation('joyride', 'start');
        this.joyride = true;
    },
    /////////////////////////////////////////
    // LastModel actions
    /////////////////////////////////////////
    updateLastModelTitle : function(title){
        if(this.joyride == true){
            if(title == "") this.nodes_views[this.lastModel.get('id')].removeNode();
            else this.lastModel.save({title:title});    
            this.joyride = false; // important pour eviter quand je tape sur entree que le joyride est fermé il sup the lastModel
        }
    },
    setLastModel : function(model){
        this.lastModel = model;
    },
    /////////////////////////////////////////
    // Sliding editor bar
    /////////////////////////////////////////
    showMenu : function(){
        if(this.isopen == false){
            $("#map").animate({left: "-=28%"})
            this.setDeltaX(-20)
            $("#sideBar").animate({right:"0px"});
            $("#right_buttons").animate({right:$('#sideBar').width()});
            //$("#cbp-openimage").attr("src","/img/icones/Arrowhead-Right-48.png");
            this.isopen=true;    
        }
    },
    hideMenu : function(){
        if(this.isopen == true){
            $("#map").animate({left: "+=28%"})
            this.setDeltaX(0)
            $("#sideBar").animate({right:"-30%"});
            $("#right_buttons").animate({right:"0px"});
            //$("#cbp-openimage").attr("src","/img/icones/Arrowhead-Left-48.png");
            this.isopen=false;
            this.autOpen = false;
        }
    },
    setDeltaX : function(pourc){
        this.deltaX = pourc * $(window).width()/100;
    },
    /////////////////////////////////////////
    // Hover bulle effect
    /////////////////////////////////////////
    setNotificationDisplayOnModel : function(model){
        // inti
        var comments = model.get('comments').length
        var attachments = model.get('attachment').length
        var description = 0
        // notif big red button
        // if(model.get('content') != "") description = 1;
        //$('#showMenu_notif').html(comments + attachments + description);
        // notif inside slideBar Menu
        $('#notifDesc').empty()
        $('#notifAttach').empty()
        $('#notifComment').empty()
        if(comments > 0) $('#notifComment').html('<span class="top-bar-unread">'+comments+'</span>')
        if(attachments > 0) $('#notifAttach').html('<span class="top-bar-unread">'+attachments+'</span>')
        //if(description > 0) $('#notifDesc').html('<span class="top-bar-unread">'+description+'</span>')
    },
    showIcon : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.id)
        //console.log("Element details : ",element.toJSON())
        // close all icones
        this.$(".icon").hide();
        if(e.target.getAttribute("data-type") != "action"){
            // set last model
            this.setLastModel(element);
            this.setNotificationDisplayOnModel(element);
            this.updateEditor(element);
            if(this.mode == "edit") $("#"+element.get('id')+" .icon").show();
        }
    },
    showChildrens : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.id)
        if(e.target.getAttribute("data-type") != "action"){
            var childs = api.getTreeChildrenNodes(element,this.elements)
            childs.forEach(function(child){
                $('#'+child.get('id')).addClass('windowHover')
            })
        }
    },
    hideChildrens : function(e){
        e.preventDefault();
        //this.$(".icon").hide();
        var dom = $('.windowHover');
        _.forEach(dom,function(el){
            $(el).removeClass('windowHover');
        });
    },
    //////////////////////////////
    // Side bar
    closeSibeBar : function(e){
        e.preventDefault();
        this.hideMenu();
    },
    editEvent : function(e){
        e.preventDefault();
        this.edit();
        this.showMenu();
    },
    edit : function(){
        this.moduleSideBar = "edit";
        var model = this.lastModel;
        $('#sideBar_container').html('');
        $('#sideBar_container').append($('<div>',{id:'editorPart'}))
        $('#sideBar_container').append($('<div>',{id:'attachmentPart'}))
        $('#sideBar_container').append($('<div>',{id:'commentPart'}))
        // Comments module
        // if(comments.views.main != undefined){
        //     comments.views.main.mode = this.mode;
        //     comments.views.main.model = model;
        //     comments.views.main.render();
        // }else{
            comments.init({
                el:"#commentPart",
                mode: this.mode,
                model : model,
                presentation : "bulle"
            }); 
        // }
        // attachment module
        // if(attachment.views.main != undefined){
        //     attachment.views.main.mode = this.mode;
        //     attachment.views.main.model = model;
        //     attachment.views.main.render();
        // }else{
            attachment.init({
                el:"#attachmentPart",
                mode: this.mode,
                model : model,
            }); 
        // }
        // Editor module
        // if(modelEditor.views.main != undefined){
        //     modelEditor.views.main.bbmapMode = this.mode;
        //     modelEditor.views.main.model = model;
        //     modelEditor.views.main.render();
        // }else{
            modelEditor.init({
                el:"#editorPart",
                mode: this.mode,
                ckeditor : false,
                model : model,
            }); 
        // }    
    },
    designEvent : function(e){
        e.preventDefault();
        this.design();
        this.showMenu();
    },
    design : function(){
        this.moduleSideBar = "design";
        var model = this.lastModel;
        $('#sideBar_container').html('');
        $('#sideBar_container').append($('<div>',{id:'css3Model'}))
        $('#css3Model').prepend(bbmap.views.templatesList.render().el);
    },
    historyEvent : function(e){
        e.preventDefault();
        this.history();
        this.showMenu();
    },
    history : function(){
        this.moduleSideBar = "history";
        var model = this.lastModel;
        $('#sideBar_container').html('');
        $('#sideBar_container').append($('<div>',{id:'activitiesModel'}))
        // if(activitiesList.views.main != undefined){
        //     activitiesList.views.main.mode = this.mode;
        //     activitiesList.views.main.model = model;
        //     activitiesList.views.main.render();
        // }else{
            activitiesList.init({
                el:"#activitiesModel",
                model : model,
                mode: this.mode,
            }); 
        // }
    },
    updateEditor : function(model){
        if(this.mode == "edit"){
            $('#right_buttons').show('slow');
            if(this.moduleSideBar == "edit") this.edit();
            else if(this.moduleSideBar == "design") this.design();
            else this.history();
            // Templates list
            if(bbmap.views.templatesList) bbmap.views.templatesList.close();
            bbmap.views.templatesList = new templatesList.Views.Main({
                templates : this.project.get('templates'),
                mode : this.mode,
                model : model
            });
            // check for template
            if(!this.project.get('templates')) this.project.save({templates : bbmap.default_templates},{silent:true});
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
        var model = this.elements.get(id)
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
        var childrens = this.elements.where({id_father : model.id});
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
        this.nodes_views[lbl].setPosition(x/z, y/z, sz/z, h/z, true, 'structureTree', true);
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
        this.superposeElementCenterToScreenCenter("map",bbmap.zoom.get('val'));
        //this.moveDataCentroidToMapCentroid();
        this.resetToCentroid();
        this.instance.repaintEverything();
    },
    // superposeMapCenterToScreenCenter : function(){
    //     var zoom = bbmap.zoom.get('val');
    //     var screenCentroid = api.getScreenCentroid();
    //     var mapCentroid = api.getElementCentroid($('#map').width(),$('#map').height());
    //     var mapOffset = $('#map').offset(); // position relative to the document
    //     var screenCentroid = api.getScreenCentroid();
    //     var delta_left = - mapOffset.left + (screenCentroid.left - mapCentroid.left*zoom);
    //     var delta_top = - mapOffset.top + (screenCentroid.top - mapCentroid.top*zoom);
    //     $('#map').offset({ top: mapOffset.top + delta_top, left: mapOffset.left + delta_left });
    // },
    superposeElementCenterToScreenCenter : function(id,zoom){
        var screenCentroid = api.getScreenCentroid();
        var elementCentroid = api.getElementCentroid($('#'+id).width(),$('#'+id).height());
        var elementOffset = $('#'+id).offset(); // position relative to the document
        var screenCentroid = api.getScreenCentroid();
        var delta_left = - elementOffset.left + (screenCentroid.left - elementCentroid.left*zoom);
        var delta_top = - elementOffset.top + (screenCentroid.top - elementCentroid.top*zoom);
        $('#'+id).offset({ top: elementOffset.top + delta_top, left: elementOffset.left + delta_left });
    },
    /////////////////////////////////////////
    // Centroid functions
    /////////////////////////////////////////
    resetToCentroid : function(){
        if(api.getJsonSize(bbmap.views.main.nodes_views)>5) this.findRightZoom();
        if(api.getJsonSize(bbmap.views.main.nodes_views)>0) this.findRightCentroid();
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
        $('#map').animate({ top: delta.top, left: delta.left });
    },
    findRightZoom : function(Data,Screen){
        var Data = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()); // coordonnée du barycentre des données
        var Screen = api.getScreenCentroid(); // coordonnée du barycentre de l'ecran
        var zoom = bbmap.zoom.get('val');
        var k = 2; // To manage the offset between screen and nodes
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
        var delta = api.getXYTranslationBtwTwoPoints(api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()),api.getElementCentroid($('#map').width(),$('#map').height()));
        var k = 10; // coeff de finess
        if((abs(delta.x) > k)||(abs(delta.y) > k)){
            for (var id in bbmap.views.main.nodes_views){
                var view = bbmap.views.main.nodes_views[id];
                var position = view.getPosition();
                var x = position.left + delta.x;
                var y = position.top + delta.y;
                view.setPosition(x/bbmap.zoom.get('val'),y/bbmap.zoom.get('val'),0,0,true,"restructuration", false);
            }
        }
    },
    getCoordinatesOfNodesViews : function(){
        var coordinates = [];
        // console.log("size : ",_.toArray(bbmap.views.main.nodes_views).length)
        for (var id in bbmap.views.main.nodes_views){
            var position = bbmap.views.main.nodes_views[id].getPosition();
            coordinates.unshift({'top':position.top,'left':position.left});
        }
        return coordinates;
    },
    centerToElement : function(position,cb){
        if(bbmap.views.main.jeton == true){
            bbmap.views.main.jeton = false; //on prend le jeton
            var screenCentroid = api.getScreenCentroid();
            var mapOffset = $('#map').offset();
            var delta_left = screenCentroid.left - position.left;
            var delta_top = screenCentroid.top - position.top;

            $('#map').animate({ top: mapOffset.top + delta_top, left: mapOffset.left + delta_left + this.deltaX },function(){
                bbmap.views.main.jeton = true; // on rend le jeton
                if(cb) cb();
            });
        }
    },
    /////////////////////////////////////////
    setCKOperator : function(e){
        e.preventDefault();
        if(this.ckOperator == true){this.ckOperator = false}else{this.ckOperator = true;}
        this.render();
    },
    /////////////////////////////////////////
    // Add remove model/link to view
    /////////////////////////////////////////
    addModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        // create the view
        var new_view = new bbmap.Views.Node({
            className : "window "+model.get('type')+" bulle",
            id : model.get('id'),
            model : model,
        });
        // On l'ajout à la liste
        this.nodes_views[model.get('id')] = new_view;
        // On l'ajout à la map
        this.map_el.append(new_view.render().el);
        if(this.mode == "edit"){
            // On lui permet d'etre cible et source
            new_view.addEndpoint();
            new_view.makeTarget();
            // On le rend draggable
            this.instance.draggable($(new_view.el),{ 
                containment: "#map", 
                scroll: false,
                drag : function(e){
                    if(global.drawingAid == true) bbmap.views.main.drawingAid(model);
                }
            });
        }
        // On lance le joyride d'édition
        if(origin == "client"){
            this.startJoyride();
        }
        this.svgWindowController();
    },
    removeModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        //console.log(this.nodes_views[model.get('id')])
        this.nodes_views[model.get('id')].removeView();
        this.svgWindowController();
    },
    getCKLinkStyle : function(link){
        var c_color = "#27AE60";
        var k_color = "#1B9DD3";
        var p_color = "#E67E22";
        var source = bbmap.views.main.elements.get(link.get('source'));
        var target = bbmap.views.main.elements.get(link.get('target'));
        var style = { strokeStyle : "gray", lineWidth : 1, dashstyle : "2 4"}
        if(source.get('type') == "concept"){
            if(target.get('type') == "concept") style = {strokeStyle:c_color,lineWidth:1};
            else if(target.get('type') == "knowledge") style = {strokeStyle:c_color,lineWidth:1,dashstyle:"2 4"};
            else if(target.get('type') == "poche") style = {strokeStyle:c_color,lineWidth:1,dashstyle:"2 4"};
        }
        else if(source.get('type') == "knowledge"){
            if(target.get('type') == "concept") style = {strokeStyle:k_color,lineWidth:1,dashstyle:"2 4"};
            else if(target.get('type') == "knowledge") style = {strokeStyle:k_color,lineWidth:1};
            else if(target.get('type') == "poche") style = {strokeStyle:k_color,lineWidth:1,dashstyle:"2 4"};
        }
        else if(source.get('type') == "poche"){
            if(target.get('type') == "concept") style = {strokeStyle:p_color,lineWidth:1,dashstyle:"2 4"};
            else if(target.get('type') == "knowledge") style = {strokeStyle:p_color,lineWidth:1,dashstyle:"2 4"};
            else if(target.get('type') == "poche") style = {strokeStyle:p_color,lineWidth:1};
        }
        return style;
    },
    addLinkToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        var style = this.getCKLinkStyle(model)
        bbmap.views.main.instance.connect({
            source:bbmap.views.main.nodes_views[model.get('source')].el, 
            target:bbmap.views.main.nodes_views[model.get('target')].el, 
            anchor:"AutoDefault",
            scope : "cklink",
            paintStyle:style
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
        bbmap.views.main.svgWindowController();
        //this.nodes_views[model.get('source')].removeView();    
    },
    /////////////////////////////////////////
    // jsPlumb
    /////////////////////////////////////////
    jsPlumbEventsInit : function(){
        ///////////////////////
        // Remove link process        
        this.instance.bind("beforeDetach", function(conn) {
            var resp = true;
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

                    bbmap.views.main.svgWindowController();
                } 
            }
            return resp;
        });
        this.instance.bind("click", function(conn) {
            bbmap.views.main.instance.detach(conn);
            // Choise the right new id_father
            var id_father = api.getTheRightIDFather(bbmap.views.main.links,bbmap.views.main.elements,bbmap.views.main.elements.get(conn.targetId))
            bbmap.views.main.elements.get(conn.targetId).set({id_father : id_father}).save();

            bbmap.views.main.svgWindowController();            
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
                    var source = bbmap.views.main.elements.get(info.sourceId);
                    var target = bbmap.views.main.elements.get(info.targetId);
                    var new_link = global.newLink(source,target,true);
                    // Set the link style
                    var style = bbmap.views.main.getCKLinkStyle(new_link);
                    info.connection.setPaintStyle(style);
                    // Re-draw windows
                    bbmap.views.main.svgWindowController();
                }    
            }
        });     
    },
    ////////////////////////////////////////
    setPulse : function(){
        var _this = this;
        var news  = global.collections.News;
        this.elements.each(function(el){
            news.forEach(function(n){
                if(n.get('attachedTo') ==  el.get('id')){
                    $('#'+ el.get('id')).addClass("pulse")
                    return ;
                }
            })    
        })
        
    },
    renderActionBar : function(){
        //this.top_el.empty();
        //if(actionMenu.views.main != undefined) actionMenu.views.main.close(); 
        actionMenu.init({
            el : this.top_el,
            filter : this.filter,
            mode : this.mode,
            from : "bbmap"
        });

        this.bottom_el.empty();
        // this.top_el.append(this.template_top({
        //     filter  : this.filter,
        //     mode    : this.mode,
        //     project : this.project.toJSON()
        // }));
        this.bottom_el.append(this.template_bottom({
            filter  : this.filter,
            mode    : this.mode
        }));
        // this.top_el.find("#zoom_val").html(bbmap.zoom.get('val'));
        $( "#dropC" ).draggable();
        $( "#dropK" ).draggable();
        $( "#dropP" ).draggable();
    },
    render : function(initPos){  //alert('render')
        var _this = this;
        this.map_el.empty();
        ///////////////////////
        // init
        if((this.init == false)&&(this.sens != "init")){ // Si on change de mode et on a utiliser le prev/next de la timeline ou de l'historic
            // console.log("--Mode ",this.mode," activated")
            // console.log("----start global fetching process...")
            bbmap.views.main.elements.fetch({
                error: function () {},
                success: function () {},
                complete: function () {
                    bbmap.views.main.init = true;
                    bbmap.views.main.render(); 
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
            // Create graphical element
            this.elements.each(function(model){ 
                if(!model.get('visibility')) model.save({visibility : "show"}); // par default mettre la valeur à show
                // try{
                    bbmap.views.main.addModelToView(model,"render");
                // }catch(err){console.log("Problem to display element");}
            });
            this.links.each(function(l){
                try{
                    bbmap.views.main.addLinkToView(l);
                }catch(err){
                    //l.destroy(); // clean undelete link!!!!!
                    console.log("Missing element to etablish graphical connection...");
                }
            });
            // if(this.filter == "c"){
            //     this.renderConceptsBulle();
            // }
            // else if(this.filter == "kp"){
            //     this.renderKnowledgesBulle();
            //     //this.renderPochesBulle();   
            //     this.renderCKLinks();
            // }
            // else if(this.filter == "ckp"){
            //     this.renderConceptsBulle();
            //     this.renderKnowledgesBulle();
            //     //this.renderPochesBulle();
            //     this.renderCKLinks();
            // }
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
            if(this.mode == "edit"){
                bbmap.views.css3 = new CSS3GENERATOR.Views.Main();
                // CSS3 Button generator
                this.css3Model_el.html(bbmap.views.css3.render().el);
                CSS3GENERATOR.attach_handlers();
                CSS3GENERATOR.initialize_controls();
                CSS3GENERATOR.update_styles();   
            }
            // import data module
            if(importData.views.main)importData.views.main.remove();
            if(this.mode == "edit") importData.init();
            // // move DataCentroid To MapCentroid
            // if((this.init == true)&&(this.sens == "init")){
            //     this.moveDataCentroidToMapCentroid();
            // }
            if(initPos){
                // move DataCentroid To MapCentroid
                if((bbmap.views.main.init == true)&&(bbmap.views.main.sens == "init")){
                    //bbmap.views.main.moveDataCentroidToMapCentroid();
                    this.intelligentRestructuring();
                }
            } 

            //
            
            if(this.mode == "edit") $('#map').css('background-image', 'url(/img/pattern.png)');
            else $('#map').css('background', 'transparent');

            this.init = false; 
            // this.intelligentRestructuring();
        }
        
        ////////////////////////
        // invisibility
        if(this.invisibility == 1){
            $('#topbar_container').hide();
            $('#top_container').hide();
            $('#bottom_container').hide();    
        }
        ////////////////////////
        // Set pulse on news
        this.setPulse();
        ////////////////////////
        // Draw windows
        this.svgWindowController();
        
        return this;
    }
});
/////////////////////////////////////////////////
bbmap.Views.Stat = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.elements = json.elements;
        this.links = json.links;
        this.stats = bbmap.stats;
        this.left_stats_el = $("#stat_left")
        this.bottom_stats_el = $("#stat_bottom")
        // Templates
        this.template_bottom = _.template($('#bbmap-stat-bottom-template').html());
        this.template_left = _.template($('#bbmap-stat-left-template').html());
    },
    events : {},
    getStats : function(){
        return this.stats
    },
    setStats : function(){
        //////////////
        var all_elements = this.elements.length;
        var all_c = this.elements.where({type : "concept"}).length;
        var all_k = this.elements.where({type : "knowledge"}).length;
        var all_p = this.elements.where({type : "poche"}).length;
        var empty_c = this.elements.where({type : "concept", content : ""}).length;
        var empty_k = this.elements.where({type : "knowledge", content : ""}).length;
        var empty_p = this.elements.where({type : "poche", content : ""}).length;
        var c = all_c - empty_c;
        var k = all_k - empty_k;
        var p = all_p - empty_p;
        var all_ck = all_c + all_k;
        var all_links = this.links.length;
        var c_ = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"concept","poche").length + api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"concept","knowledge").length;
        var cc = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"concept","concept").length;
        var k_ = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"knowledge","poche").length + api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"knowledge","concept").length;
        var kk = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"knowledge","knowledge").length;;
        var p_ = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"poche","concept").length + api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"poche","knowledge").length;
        var pp = api.getType2LinkedToType1(bbmap.views.main.links,bbmap.views.main.elements,"poche","poche").length;;
        /////////////
        // Set JSON
        this.stats.c_empty.stat = Math.floor(empty_c*100/all_elements);
        this.stats.c_full.stat = Math.floor(c*100/all_elements);
        this.stats.k_empty.stat = Math.floor(empty_k*100/all_elements);
        this.stats.k_full.stat = Math.floor(k*100/all_elements);
        this.stats.p_empty.stat = Math.floor(empty_p*100/all_elements);
        this.stats.p_full.stat = Math.floor(p*100/all_elements);
        this.stats.co_link.stat = Math.floor(c_*100/all_links);
        this.stats.cc_link.stat = Math.floor(cc*100/all_links);
        this.stats.ko_link.stat = Math.floor(k_*100/all_links);
        this.stats.kk_link.stat = Math.floor(kk*100/all_links);
        this.stats.po_link.stat = Math.floor(p_*100/all_links);
        this.stats.pp_link.stat = Math.floor(pp*100/all_links);
        this.stats.c_nbre.stat = all_c;
        this.stats.c_perc.stat = Math.floor(all_c*100/all_ck);
        this.stats.k_nbre.stat = all_k;
        this.stats.k_perc.stat = Math.floor(all_k*100/all_ck);
    },
    render : function() {
        this.left_stats_el.empty();
        this.bottom_stats_el.empty();
        // Set stats
        this.setStats();
        // left stat
        this.left_stats_el.append(this.template_left({
            stats : this.stats
        }));
        // bottom stats
        this.bottom_stats_el.append(this.template_bottom({
            c_nbre : this.stats.c_nbre.stat,
            c_perc : this.stats.c_perc.stat,
            k_nbre : this.stats.k_nbre.stat,
            k_perc : this.stats.k_perc.stat,
        }));

      return this;
    }
});
/////////////////////////////////////////////////

