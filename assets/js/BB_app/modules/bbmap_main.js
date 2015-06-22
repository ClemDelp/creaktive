/////////////////////////////////////////////////
// ROUTER
/////////////////////////////////////////////////
bbmap.router = Backbone.Router.extend({
    routes: {
        ""  : "init",
        "controller": "controller",
    },
    controller : function(){
        var permission = rules.getPermission();
        if(permission) bbmap.views.main.setMode("edit",true);
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
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
bbmap.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','deleteButton','updateLastModelTitle','setLastModel','multiselection','duplicate');
        ////////////////////////////
        // el
        this.top_el = $(this.el).find('#top_container');
        this.map_el = $(this.el).find('#map');
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
        this.isopen             = false;
        this.autOpen            = true;
        this.positionRef        = 550;
        this.color              = "gray";
        this.cursorX            = 0;
        this.cursorY            = 0;
        this.visualMode         = "children"; // children/node/parent respectivly display childrens concept/ parents concepts + knowledges associate / knowledges associate to concept
        this.jeton              = true; // jeton pourevite que le center soit utilisé 2 fois simultanement
        this.moduleSideBar      = "edit";
        this.selectedElement    = []; // array with all selected elements
        this.m_selection_mode   = false;
        ////////////////////////////////
        // Timeline & history parameter
        this.timeline_pos       = 0;
        // this.history_pos        = 0;
        this.localHistory       = new global.Collections.LocalHistory();
        this.sens               = "init";
        this.listener           = new window.keypress.Listener();
        this.presentation       = "graph"; // can be graph/timeline/split
        ////////////////////////////////
        // Templates
        this.template_joyride = _.template($('#bbmap-joyride-template').html());
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
        this.listenTo(this.elements, 'add', this.addModelToView);
        this.listenTo(this.elements, 'remove', this.removeModelToView);
        this.listenTo(this.links, 'add', this.addLinkToView);
        this.listenTo(this.links, 'remove', this.removeLinkToView);
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

        /////////////////////////////
        // KEYPRESS
        this.listener.register_combo({
            "keys"              : "shift",
            "on_keydown"        : this.multiselection,
            "on_keyup"          : this.multiselection,
        });

        this.listener.simple_combo("ctrl z", this.history_previous);
        this.listener.simple_combo("ctrl y", this.history_next);
        //this.listener.simple_combo("backspace", this.deleteButton);

        this.listener.simple_combo("delete", this.deleteButton);
        this.listener.simple_combo("ctrl c", this.duplicate);
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

        this.localHistory.createBackup();
    },
    events : {
        "mouseup .dropC" : "newConceptUnlinked",
        "mouseup .dropK" : "newKnowledgeUnlinked",
        "mouseup .dropP" : "newPocheUnlinked",
        "click .ckOperator" : "setCKOperator",

        "click .zoomin"     : "zoomin",
        "click .zoomout"    : "zoomout",
        "click .reset"      : "recadrage",

        "mouseleave .window" : "hideChildrens",
        "click .window" : "elementSelection",
        "dblclick .window" : "editBulle",
        "mouseenter .window" : "overElement", 
        "click .structureSubTree" : "treeClassification_event",
        "click #okjoyride" : "updateLastModelTitle",
        "click .screenshot" : "screenshot",
        "click .downloadimage" : "laurie",
        "click .getSuggestions" : "get_suggestions", 
        "click #map" : "deSelection",
    },
    ///////////////////////////////////////////////////
    // HISTORY FUNCTIONS
    ///////////////////////////////////////////////////

    history_next : function(){
        var _this = bbmap.views.main;
        _this.localHistory.next(_this.history_do);
    },

    history_previous : function(){
        var _this = bbmap.views.main;
        _this.localHistory.previous(_this.history_do);
    },

    history_do : function(todo){
        var _this = bbmap.views.main;
        _.each(todo, function(action){
            if(action.element_type == "Elements"){
                if(action.action == "create"){

                    _this.elements.historyCreate(action.element);
                }else if(action.action == "delete"){
                    _this.elements.historyDelete(action.element);
                }else if(action.action == "update"){
                    var e = action.element;

                    if(action.data == "title"){
                        e.title = action.value
                    }else if(action.data == "top" ){
                        e.top = action.value;
                    }else if(action.data == "left"){
                        e.left = action.value;
                    }


                    _this.elements.historyUpdate(e);
                }
            }else if(action.element_type == "Links"){
                if(action.action == "create"){
                    var source = bbmap.views.main.elements.get(action.element.source);
                    var target = bbmap.views.main.elements.get(action.element.target);
                    _this.links.historyCreate(action.element,source,target);
                }else if(action.action == "delete"){
                    _this.links.historyDelete(action.element);
                }else if(action.action == "update"){
                    _this.links.historyUpdate(action.element);
                }
            }else if(action.element_type == "Attachments"){

            }else if(action.element_type == "Comments"){

            }
        });
        _this.svgWindowController();
    },
    /////////////////////////////////////////
    get_suggestions : function(e){
        e.preventDefault();
        ckSuggestion.init();
        $('#suggestions_modal').foundation('reveal', 'open');
    },
    /////////////////////////////////////////
    duplicate : function(){
        var id_ref = guid();
        if(this.selectedElement.length > 0){
            // Elements
            this.selectedElement.forEach(function(el){
                bbmap.views.main.cloneElement(el,id_ref);
            });
            // Links
            this.cloneLinks(id_ref);
        }else{
            var model = this.lastModel;
            this.cloneElement(model,id_ref);
        }
    },
    cloneLinks : function(id_ref){
        var ids = _.pluck(this.selectedElement,'id');
        this.links.forEach(function(link){
            // Si il y a des links entre les elements
            if((_.indexOf(ids,link.get('target'))>-1)&&(_.indexOf(ids,link.get('source'))>-1)){
                var source = bbmap.views.main.elements.get(link.get('source')+"-"+id_ref);
                var target = bbmap.views.main.elements.get(link.get('target')+"-"+id_ref);
                this.links.newLink(source,target);
                // links = _.union(links,link)  
            } 
        });
    },
    cloneElement : function(element,id_ref){
        // clone the element
        var ids = _.pluck(this.selectedElement,'id');
        var id_father = element.get('id_father')+"-"+id_ref;
        if(_.indexOf(ids,element.get('id_father')) == -1) id_father = "none"; 
        var cloned = element.clone();
        cloned.save({
            id: cloned.id+"-"+id_ref,
            id_father : id_father,
            left : cloned.get('left')+20,
            top  : cloned.get('top')+20, 
        });
        this.elements.add(cloned);
    },
    /////////////////////////////////////////
    editBulle : function(e){
        e.preventDefault();
        var id = e.target.id;
        this.setLastModel(bbmap.views.main.elements.get(id),'editBulle');
        this.startJoyride(id);
    },
    /////////////////////////////////////////
    exportElementsToString : function(){
        var json = bbmap.views.main.elements.toJSON();
        var clear_json = [];
        bbmap.views.main.elements.forEach(function(el){
            clear_json.push(_.pick(el.toJSON(), 'id', 'id_father', 'project', 'title', 'type', 'css_auto', 'css_manu', 'content', 'inside'));      
        })
        console.log(JSON.stringify(clear_json));
    },
    exportLinksToString : function(){
        console.log(JSON.stringify(bbmap.views.main.links.toJSON()));
    },
    /////////////////////////////////////////
    svgWindowController : function(){
        if(this.init != true){
            $('body .svg_window').remove();
            this.drawSvgCkLine(function(){
                //var c_candidats = bbmap.views.main.elements.where({type:"concept",id_father:"none"})
                var c_candidats = [];
                var p_candidats = bbmap.views.main.elements.where({type:"poche",id_father:"none"})
                var peres = _.union(c_candidats,p_candidats)
                peres.forEach(function(pere){
                    bbmap.views.main.drawSvgWindow(pere);
                });
            });
        }
    },
    drawSvgCkLine : function(cb){
        $('body .svg_CK_line').remove();
        var color = "#34495e";
        var deltaX = 100;
        var deltaY = 125;
        var left_max = 0;
        var top_max = 0;
        var top_min = 100000000000000000;

        var concepts = this.elements.where({type : "concept"});
        var knowledges = this.elements.where({type : "knowledge"});
        var poches = this.elements.where({type : "poche"});

        // La ref sera les concepts, se sera au K et P de se deplace par rapport aux c
        concepts.forEach(function(c){
            var w = $("#"+c.get('id')).width();
            var h = $("#"+c.get('id')).height();
            var c_left = w + c.get('left') + deltaX;

            if(c_left > left_max) left_max = c_left;
            if((h + c.get('top')) > top_max) top_max = (h + c.get('top'));
            if(c.get('top') < top_min) top_min = c.get('top');
        });

        knowledges.forEach(function(k){
            var h = $("#"+k.get('id')).height();

            if(k.get('left') < left_max){
                //k.save({left : left_max+100 })
                //$("#"+k.get('id')).animate({left: left_max+100})  
            }
            if((h + k.get('top')) > top_max) top_max = (h + k.get('top'));
            if(k.get('top') < top_min) top_min = k.get('top');
        });

        poches.forEach(function(p){
            var h = $("#"+p.get('id')).height();

            if(p.get('left') < left_max){
                //p.save({left : left_max+100 })
                //$("#"+p.get('id')).animate({left: left_max+100})  
            }
            if((h + p.get('top')) > top_max) top_max = (h + p.get('top'));
            if(p.get('top') < top_min) top_min = p.get('top');
        });

        var longueur = top_max - top_min + deltaY;
        var new_top_min = top_min - 50;
        this.map_el.append('<svg class="svg_CK_line" style="position:absolute;left:'+left_max+'px;top:'+new_top_min+'px" width="50px" height="'+longueur+'px" xml:lang="fr" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><text x="5px" y="20" font-family="sans-serif" font-size="20px" fill="'+color+'">C</text><text x="30px" y="20" font-family="sans-serif" font-size="20px" fill="'+color+'">K</text><line x1="24" y1="0" x2="24" y2="'+longueur+'" style="stroke:'+color+';stroke-width:3px;stroke-dasharray: 5,3,2" /></svg>');
        
        cb();
    },
    drawSvgWindow : function(pere){
        var elements = api.getTreeChildrenNodes(pere,bbmap.views.main.elements);
        elements.push(pere);
        var cadre = api.getCadre(elements,100);
        var color = "#E67E22";
        if(pere.get('type') == "concept") color = "#C8D400";
        var left = cadre.left_min - 25;
        var right = cadre.top_min - 30;
        var text = pere.get('title')+" ("+(api.getTreeChildrenNodes(pere,bbmap.views.main.elements).length+1)+" elements)";
        this.map_el.append('<svg class="svg_window" style="position:absolute;left:'+left+'px;top:'+right+'px" width="'+cadre.width+'" height="'+cadre.height+'" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml"><text x="5" y="10" font-family="sans-serif" font-size="10px" fill="'+color+'">'+text+'</text><rect rx="10" ry="10" x="0" y="0" width="'+cadre.width+'" height="'+cadre.height+'" stroke-width="3" stroke="'+color+'" fill="transparent" /></svg>')
    },
    laurie : function(e){
        e.preventDefault();
        var padding_left = -100;
        var padding_top = -100;
        var offset = 250;
        var childs = [];
        var cadre = api.getCadre(bbmap.views.main.elements.toArray(),300);
        var left_min = cadre.left_min + padding_left;
        var left_max = cadre.left_max;
        var top_min = cadre.top_min + padding_top;
        var top_max = cadre.top_max;
        // Def the cadre
        var cadre_width = cadre.width;
        var cadre_height = cadre.height;
        //if(cadre_height<400) cadre_height = 400;
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
        // hide arrow
        console.log("cadre : ",$(cadre).find(".arrow"))
        $(cadre).find(".arrow").removeClass("arrow");
        // Append to body i dont know why
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
                var imgData = canvas.toDataURL("image/png");
                var a = $("<a>")
                    .attr("href", imgData)
                    .attr("download", "ck_map.png")
                    .appendTo("body");
                a[0].click();
                a.remove();
                // window.open(imgData);
                $("#youhou").remove();
            }
        });
    },
    ///////////////////////////////////////////
    treeClassification_event : function(e){
        e.preventDefault();
        var pere = this.lastModel.get('id');
        this.treeClassification(pere);
    },
    treeClassification : function(pere){
        var vertical = false
        var mirror = false
        var dossier = false
        var dossier2 = false
        var compact = false
        var elements = TreeClassification.alignAll(bbmap.views.main.elements.toJSON(), pere, 50, 100, vertical, mirror, dossier, dossier2, compact);
        elements.forEach(function(el){
            bbmap.views.main.elements.get(el.id).save(el)
        });
        setTimeout(function(){
            bbmap.views.main.instance.repaintEverything();
            bbmap.views.main.svgWindowController();

        },1000);

        this.localHistory.createBackup();
    },
    deleteButton : function(){
        // Si il y a plusieurs éléments selecitonnés
        if(this.selectedElement.length > 0){
            this.selectedElement.forEach(function(el){
                var view = bbmap.views.main.nodes_views[el.get('id')]
                bbmap.views.main.lastModel = new Backbone.Model();
                view.removeConfirmSwal(); 
            });
            this.clearMultiSimpleSelection();
        }else{
            var view = this.nodes_views[this.lastModel.get('id')]
            this.lastModel = new Backbone.Model();
            view.removeConfirmSwal(); 
        }
        
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
        this.render(initPos);
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
        var new_element = this.elements.newElement("poche","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
        // this.localHistory.createBackup();
    },
    newConceptUnlinked : function(e){
        var pos = $('#dropC').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        var new_element = this.elements.newElement("concept","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
        // this.localHistory.createBackup();
    },
    newKnowledgeUnlinked : function(e){
        var pos = $('#dropK').offset();
        var left = (pos.left - $('#map').offset().left)/bbmap.zoom.get('val');
        var top = (pos.top - $('#map').offset().top)/bbmap.zoom.get('val');
        var new_element = this.elements.newElement("knowledge","",top,left);
        this.newViewAndLink("none",new_element,top,left,pos);
        this.renderActionBar();
        // this.localHistory.createBackup();
    },
    newViewAndLink : function(source,target,top,left,pos){
        // On centre la map sur l'element
        _this = this;
        var position = {top:(top*bbmap.zoom.get('val')) + $('#map').offset().top,left:(left*bbmap.zoom.get('val')) + $('#map').offset().left};
        if(pos) position = pos; // pour prendre la position du drop button
        this.centerToElement(position,function(){
            // On ajoute le model à la view
            // bbmap.views.main.addModelToView(new_element);
            // LINK
            if(source != "none"){
                var new_cklink = _this.links.newLink(source,target);
                //bbmap.views.main.addLinkToView(new_cklink)
                bbmap.views.main.svgWindowController();
            } 
        });
    },
    startJoyride : function(id){
        $("#joyride_id").attr('data-id',id+'_joyride')
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
            this.localHistory.createBackup();
        }
    },
    setLastModel : function(model){
        console.log(model.toJSON())
        this.lastModel = model;
        this.clearMultiSimpleSelection();
        this.setSelected(model);
        if(this.lastModel.get('type') == "poche"){
            $('.c').hide();$('.k').hide();$('.a').show();
        }else if(this.lastModel.get('type') == "concept"){
            $('.c').show();$('.k').hide();$('.a').show();
        }else if(this.lastModel.get('type') == "knowledge"){
            $('.c').hide();$('.k').show();$('.a').show();
        }
    },
    /////////////////////////////////////////
    // Over, Simple and multi selection
    /////////////////////////////////////////
    setSelected : function(element){
        $("#"+element.get('id')).addClass("selectedElement");
    },
    clearMultiSimpleSelection : function(){
        this.selectedElement.length = 0;
        $(".selectedElement").removeClass("selectedElement");
        bbmap.views.main.instance.clearDragSelection();
        this.$(".icon").hide();
    },
    multiselection : function(){
        // switching mode
        if(this.m_selection_mode){
            this.m_selection_mode = false;
        } else{
            this.clearMultiSimpleSelection();
            this.m_selection_mode = true;
        } 
    },
    elementSelection : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.id);
        // Si on a la touche shift enfoncée
        if(this.m_selection_mode == true){
            // close all icones
            this.$(".icon").hide();
            this.selectedElement.unshift(element);
            this.setSelected(element);
            bbmap.views.main.instance.addToDragSelection($('#'+element.get('id')));
        }else{
            if(e.target.getAttribute("data-type") != "action") this.setLastModel(element);
        }
    },
    deSelection : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.id)
        // Si on click en dehors de la map
        if(element == undefined) this.clearMultiSimpleSelection();
    },
    overElement : function(e){
        e.preventDefault();
        // Si buttons == 1 implique qu'on est en train de drag&droper un element il ne faut donc pas déclancher les fonctions de l'over
        if(e.buttons == 0){
            var element = this.elements.get(e.target.id)
            if(this.m_selection_mode == false){    
                // close all icones
                this.$(".icon").hide();
                if(this.mode == "edit") $("#"+element.get('id')+" .icon").show();
                this.showDependances(element);
                // Show childrens
                if(element.get('visibility') == true){
                    var childs = api.getTreeChildrenNodes(element,this.elements)
                    if(bbmap.views.main.selectedElement.length == 0) bbmap.views.main.instance.clearDragSelection();
                    childs.forEach(function(child){
                        $('#'+child.get('id')).addClass('windowHover')
                        if(bbmap.views.main.selectedElement.length == 0) bbmap.views.main.instance.addToDragSelection($('#'+child.get('id')));
                    });
                }
            }    
        }
        
    },
    showDependances : function(model){
        // remove before all other dependances
        bbmap.views.main.links.each(function(l){
            try{
                var source = bbmap.views.main.elements.get(l.get('source'));
                var target = bbmap.views.main.elements.get(l.get('target'));
                if(source.get('type') != target.get('type')) bbmap.views.main.removeLinkToView(l,"showDependances");

            }catch(err){
                //l.destroy(); // clean undelete link!!!!!
                console.log("Missing element to etablish graphical connection...");
            }
        });
        // display dependance of selected model
        var links = api.getCKLinksByModelId(bbmap.views.main.links,model.get('id'));
        links.forEach(function(l){
            try{
                var source = bbmap.views.main.elements.get(l.get('source'));
                var target = bbmap.views.main.elements.get(l.get('target'));
                if(source.get('type') != target.get('type')) bbmap.views.main.addLinkToView(l,"showDependances");

            }catch(err){
                console.log("Missing element to etablish graphical connection...");
            }
        });
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
    edit : function(){
        this.moduleSideBar = "edit";
        var model = this.lastModel;
        $('#sideBar_container').html('');
        $('#sideBar_container').append($('<div>',{id:'editorPart'}))
        $('#sideBar_container').append($('<div>',{id:'attachmentPart'}))
        $('#sideBar_container').append($('<div>',{id:'commentPart'}))
        // Comments module
        comments.init({
            el:"#commentPart",
            mode: this.mode,
            model : model,
            presentation : "bulle"
        }); 
        // Attachment module
        attachment.init({
            el:"#attachmentPart",
            mode: this.mode,
            model : model,
        }); 
        // Editor module
        modelEditor.init({
            el:"#editorPart",
            mode: this.mode,
            ckeditor : false,
            model : model,
        }); 
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
        }
    },
    
    resetZoom : function(){
        this.setZoom(bbmap.zoom.get('val'));
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
        this.recadrage();
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
    recadrage : function(){
        var offset = 100;
        var window_width = $(window).width();
        var window_height = $(window).height();
        var cadre = api.getCadre(bbmap.views.main.elements.toArray(),offset);
        var zoom_width = window_width/cadre.width;
        var zoom_height = window_height/cadre.height;
        var right_zoom = Math.min(zoom_width,zoom_height);        
        bbmap.views.main.setZoom(right_zoom);
        if(api.getJsonSize(bbmap.views.main.nodes_views)>0) this.refocus(cadre);
    },
    refocus : function(cadre){
        var zoom = bbmap.zoom.get('val');
        var screenCentroid = api.getScreenCentroid(); // coordonnée du barycentre de l'ecran
        var delta = {}; // distance in x,y that map have to move to center dataCentroid to screen
        
        var dataCentroid = api.getCentroidPointsCloud(bbmap.views.main.getCoordinatesOfNodesViews()); // coordonnée du barycentre des nodes
        delta.top = screenCentroid.top - dataCentroid.top;
        delta.left = screenCentroid.left - dataCentroid.left;        
        // superpose data and screen centroid 
        $('#map').animate({ top: delta.top, left: delta.left });
    },
    getCoordinatesOfNodesViews : function(){
        var coordinates = [];
        // console.log("size : ",_.toArray(bbmap.views.main.nodes_views).length)
        for (var id in bbmap.views.main.nodes_views){
            var position = bbmap.views.main.nodes_views[id].getPosition();
            var width = $("#"+id).width();
            var height = $("#"+id).height();
            coordinates.unshift({'width': width,'height': height,'top':position.top,'left':position.left});
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
    addModelsToView : function(elements,from){
        elements.each(function(model){ 
            try{
                if(api.isVisible(bbmap.views.main.links,bbmap.views.main.elements,model)) bbmap.views.main.addModelToView(model,"addModelsToView");
            }catch(err){
                console.log(err);
                console.log("Problem to display element");
            }
        });
        this.svgWindowController();
    },
    addModelToView : function(model,from){
        var origin = "client";
        if(from) if($.type(from) == "string") origin = from;
        // set arrow if CK operator connection find
        var arrow = "";
        if(model.get('type') == "concept"){
            if(api.getTypeLinkedToModel(bbmap.views.main.links,bbmap.views.main.elements,model,"knowledge").length > 0) arrow = "arrow";
            if(api.getTypeLinkedToModel(bbmap.views.main.links,bbmap.views.main.elements,model,"poche").length > 0) arrow = "arrow";
        }
        if((model.get('type') == "poche")||(model.get('type') == "knowledge")){
            if(api.getTypeLinkedToModel(bbmap.views.main.links,bbmap.views.main.elements,model,"concept").length > 0) arrow = "arrow";
        }
        // create the view
        var new_view = new bbmap.Views.Node({
            className : "window "+model.get('type')+" bulle "+arrow,
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
            // on ne peut pas le mettre ici car ca se declancherai aussi pour le real time
            // setTimeout(function(){
            //     bbmap.views.main.startJoyride(model.get('id'));
            // },800); 
        }
        if(from != "addModelsToView")this.svgWindowController();
    },
    removeModelsToView : function(models,from){
        models.each(function(model){
            try{
                bbmap.views.main.removeModelToView(model,"removeModelsToView");
            }catch(err){
                console.log(err);
            }
        });
        this.svgWindowController();
    },
    removeModelToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        //console.log(this.nodes_views[model.get('id')])
        this.nodes_views[model.get('id')].removeView();
        if(from != "removeModelsToView") this.svgWindowController();
    },
    addLinksToView : function(links){
        links.each(function(l){
            try{
                var source = bbmap.views.main.elements.get(l.get('source'));
                var target = bbmap.views.main.elements.get(l.get('target'));
                if(source.get('type') == target.get('type')) bbmap.views.main.addLinkToView(l,"addLinksToView");

            }catch(err){
                console.log("Missing element to etablish graphical connection...");
            }
        });
    },
    addLinkToView : function(model,from){
        var origin = "client";
        if(from) if($.type(from) == "string") origin = from;
        var style = rules.link_style_rules(model)
        bbmap.views.main.instance.connect({
            source:bbmap.views.main.nodes_views[model.get('source')].el, 
            target:bbmap.views.main.nodes_views[model.get('target')].el, 
            anchor:"AutoDefault",
            scope : "cklink",
            paintStyle:style
        });

        if(origin == "client"){       
            var source = bbmap.views.main.elements.get(model.get('source')); 
            var target = bbmap.views.main.elements.get(model.get('target')); 
            // if source is not none and element type == concept we reorganise tree
            if((target.get('type') == "concept")&&(source.get('type') == target.get('type'))){
                //console.log(bbmap.views.main.elements.length)
                //bbmap.views.main.treeClassification(source.get('id'));
            }
        }
    },
    removeLinksToView : function(links,from){
        links.each(function(model){
            try{
                bbmap.views.main.removeLinkToView(model,from);
            }catch(err){
                console.log(err);
            }
        })    
    },
    removeLinkToView : function(model,from){
        var origin = "client";
        if(from) origin = from;
        var source = model.get('source')
        var target = model.get('target')
        var connections = this.instance.getAllConnections();
        connections.forEach(function(conn){
            if((conn.targetId == target)&&(conn.sourceId == source))jsPlumb.detach(conn); //conn.setVisible(false); //bbmap.views.main.instance.detach({source:source, target:target, fireEvent:false});
        });
        if(from == 'client') bbmap.views.main.svgWindowController();
        //this.nodes_views[model.get('source')].removeView();    
    },
    /////////////////////////////////////////
    // jsPlumb
    /////////////////////////////////////////
    jsPlumbEventsInit : function(){
        _this = this;
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
                    _this.localHistory.createBackup();
                    // var links_to_remove = bbmap.views.main.links.where({source : conn.targetId, target : conn.sourceId});
                    // links_to_remove.forEach(function(link){
                    //     link.destroy();
                    // });
                    rules.setTheRightIDFather(bbmap.views.main.links,bbmap.views.main.elements,bbmap.views.main.elements.get(conn.targetId))

                    bbmap.views.main.svgWindowController();
                } 
            }
            return resp;
        });
        this.instance.bind("click", function(conn) {
            bbmap.views.main.instance.detach(conn);
            // Choise the right new id_father

            //bbmap.views.main.svgWindowController();            
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
                    var new_link = _this.links.newLink(source,target,true);
                    // Set the link style
                    var style = rules.link_style_rules(new_link);
                    info.connection.setPaintStyle(style);
                    // Re-draw windows
                    bbmap.views.main.svgWindowController();
                    _this.localHistory.createBackup();
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
            mode : this.mode,
            from : "bbmap"
        });
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
            bbmap.views.main.addModelsToView(this.elements,'render');
            bbmap.views.main.addLinksToView(this.links);
            ///////////////////////
            if(this.mode == "edit") this.showOverLays();
            else this.hideOverLays();
            ///////////////////////
            // Initialize jsPlumb events
            this.jsPlumbEventsInit();
            ///////////////////////
            jsPlumb.draggable($('#map'))
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
        // Set pulse on news
        this.setPulse();
        ////////////////////////
        // Draw windows
        this.svgWindowController();        
        $(document).foundation();
        return this;
    }
});

