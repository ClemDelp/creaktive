/////////////////////////////////////////////////
// NODE
/////////////////////////////////////////////////
bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','editTitle','addEndpoint','addLink','makeTarget');
        // Variables
        this.model = json.model;
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change:title", this.render); 
        this.listenTo(this.model,"change:css", this.render); 
        this.listenTo(global.eventAggregator,this.model.get('id')+"_server", this.actualize,this); 
        // Se mettre en ecoute sur le deplacement du node pere
        // this.oldFather = new Backbone.Model();
        try{
            this.father = bbmap.views.main.concepts.get(this.model.get('id_father'));
            // this.oldFather = this.father.clone();
            // this.listenTo(this.father,"change:top change:left", this.followFather,this);
            // On se met en ecoute sur le pere
            this.listenTo(global.eventAggregator,this.father.get('id')+"_followme",this.followFather,this);
        }catch(err){
            //console.log('no father detected')
        }
        // Events

        // Templates
        this.template_bulle = _.template($('#bbmap-bulle-template').html());
    },
    events : {
        "click .editTitle" : "editTitle",
        "click .sup" : "removeModel",
        "click .ep" : "addConceptChild",
        "click .ep2" : "addKnowledgeChild",
        "click .ep3" : "editBulle"
    },
    editBulle : function(e){
        e.preventDefault();
        var id = e.target.id;
        bbmap.views.main.lastModel = this.model;
        bbmap.views.main.startJoyride();
    },
    actualize : function(model,save){
        var old_id_father = this.model.get('id_father');
        var new_id_father = model.id_father;
        this.model.set({
            top: model.top,
            left: model.left,
            title: model.title,
            css: model.css,
            id_father : model.id_father
        });
        if((save)&&(save == true))this.model.save();
        this.applyStyle();
        if((old_id_father != new_id_father)&&(new_id_father == "none")) this.removeLink(old_id_father);
        else if((old_id_father != new_id_father)&&(new_id_father != "none")) this.addSimpleLink(new_id_father);
    },
    //////////////////////////////////////////
    // Follow father system
    //////////////////////////////////////////
    unbindFollowFather : function(){
        console.log("unbindFollowFather")
        var ev = this.father.get('id')+"_followme";
        console.log(ev)
        this.stopListening(global.eventAggregator,ev);
    },
    bindFollowFather : function(){
        console.log("bindFollowFather")
        this.father = bbmap.views.main.concepts.get(this.model.get('id_father'));
        // On se met en ecoute sur le pere
        this.listenTo(global.eventAggregator,this.father.get('id')+"_followme",this.followFather,this);
    },
    followFather : function(oldFather,father){
        // if(this.model.get('id_father') != "none"){
            //console.log(this.model.get('title'),' - follow its father');
            var hf_left = oldFather.get('left');
            var hf_top = oldFather.get('top');
            var f_left = father.get('left');
            var f_top = father.get('top');
            var n_left = this.model.get('left');
            var n_top = this.model.get('top');
            var delta_top = hf_top - f_top;
            var delta_left = hf_left - f_left;
            var x = n_left - delta_left;
            var y = n_top - delta_top;
            this.setPosition(x,y,0,0,false);
            this.oldFather = this.father.clone();
            bbmap.views.main.instance.repaint(this.model.get('id'));
        // }
        
    },
    //////////////////////////////////////////
    applyStyle : function(){
        if(!this.model.get('css')){
            if(this.model.get('type') == "concept")this.model.set({css : bbmap.css_concept_default},{silent:true});
            else if(this.model.get('type') == "knowledge") this.model.set({css : bbmap.css_knowledge_default},{silent:true});
            else if(this.model.get('type') == "poche") this.model.set({css : bbmap.css_poche_default},{silent:true});
        }
        var left = this.model.get('left');
        var top = this.model.get('top');
        var style = 'top:' + top + 'px; left : ' + left + 'px;' + this.model.get('css');
        $(this.el).attr('style',style)
        bbmap.views.main.instance.repaint(this.model.get('id'));
    },
    cssPosition : function(top,left){
        var styles = {
            'left': left +'px',
            'top':  top  + 'px'
        };
        $(this.el).css( styles );
    },
    setPosition : function(x, y, sz, h, broadcast, from){
        var origin = "normal";
        if(from) origin = from;
        //alert(this.model.get('title')+" set position its position")
        var before_change = this.model.clone();
        var left = (x - h);
        var top  = (y - h);
        this.cssPosition(top,left);
        this.model.save({
            top: top,
            left: left
        },{silent:broadcast});
        var after_change = this.model.clone();
        // Set old father !!! 
        if(origin == "normal")global.eventAggregator.trigger(this.model.get('id')+"_followme",before_change,after_change)
    },
    /////////////////////////////////////////////
    /////////////////////////////////////////////
    getPosition : function(){
        var position = {};
        position.left = $(this.el).position().left
        position.top = $(this.el).position().top
        return position;
    },
    getOffset : function(){
        var offset = {};
        offset.left = $(this.el).offset().left
        offset.top = $(this.el).offset().top
        return offset;
    },
    getDimension : function(){
        var dimension = {};
        dimension.width = $(this.el).width();
        dimension.height = $(this.el).height();
        return dimension;
    },
    getCentroid : function(){
        var centroid = {};
        var position = this.getPosition();
        var dimension = this.getDimension();
        centroid.left = ((dimension.width / 2) + position.left);
        centroid.top = ((dimension.height / 2) + position.top);
        return centroid;
    },
    /////////////////////////////////////////////
    /////////////////////////////////////////////
    savePosition: function(e){
        if(bbmap.views.main.mode == "edit"){
            var oldModel = this.model.clone();
            var position = this.getPosition();
            if((abs(oldModel.get('top')-position.top)>=1)||(abs(oldModel.get('left')-position.left)>=1)){
                if((position.top != 0)&&($(this.el).position().left != 0)){
                    // Si la view n'a pas été supprimée on save
                    var before_change = this.model.clone();
                    this.model.save({
                        top:position.top / bbmap.zoom.get('val'),
                        left:position.left / bbmap.zoom.get('val')
                    });   
                    var after_change = this.model.clone();
                    global.eventAggregator.trigger(this.model.get('id')+"_followme",before_change,after_change)
                    //console.log(this.model.get('top'),this.model.get('left'))
                }
                ////console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
                //bbmap.views.main.reorganizeTree(this.model.get('id'))           
            }
        }
    },
    addConceptChild : function(e){
        e.preventDefault();
        var new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new concept",
            user: bbmap.views.main.user
        });
        new_concept.save();
        // On crée le link entre C et K
        if(this.model.get('type') != "concept") this.newCKLink(new_concept);
        // On ajoute le model à la view
        bbmap.views.main.addModelToView(new_concept);
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        // On crée la K
        var new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            //id_fathers: [this.model.get('id')],
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new knowledge",
            user: bbmap.views.main.user
        });
        new_knowledge.save();
        // On crée le link entre C et K
        this.newCKLink(new_knowledge);
        // On ajoute le model à la view
        bbmap.views.main.addModelToView(new_knowledge);
    },
    newCKLink : function(target_model){
        var new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user,
            date : getDate(),
            source : this.model.get('id'),
            target : target_model.get('id')
        });
        new_cklink.save();
        bbmap.views.main.links.add(new_cklink);
    },
    /////////////////////////////////////////
    // Remove function
    /////////////////////////////////////////
    removeModel : function(e){
        e.preventDefault();
        if(confirm("this "+this.model.get('type')+" will be remove, would you continue?")){
            this.removeNode();
        }
    },
    removeNode : function(){
        var model = this.model;
        // Remove connections if there are
        if(model.get('type') == 'concept'){
            var childrens = bbmap.views.main.concepts.where({id_father : model.get('id')})
            childrens.forEach(function(child){
                child.set({id_father : "none"}).save();
            });
        }
        var links_to_remove = bbmap.views.main.links.where({source : this.model.get('id')});
        links_to_remove.forEach(function(link){
            link.destroy();
        });
        var links_to_remove = bbmap.views.main.links.where({target : this.model.get('id')});
        links_to_remove.forEach(function(link){
            link.destroy();
        });
        // Remove view
        this.removeView();
        // Remove model
        model.destroy();
        
    },
    removeView : function(from){
        var origin = "client";
        if(from) origin = from;
        //bbmap.views.main.instance.deleteEndpoint(this.el);
        // this.endpoints.forEach(function(ep){
        //     try{bbmap.views.main.instance.deleteEndpoint(ep);}catch(err){}
        // });
        delete bbmap.views.main.nodes_views[this.model.get('id')];
        bbmap.views.main.instance.removeAllEndpoints($(this.el));
        bbmap.views.main.instance.detachAllConnections($(this.el));
        this.close();
    },
    removeLink : function(father_id){
        // Remove link in both sens beetween this el and his id_father
        var model_id = this.model.get('id')
        var connections = bbmap.views.main.instance.getAllConnections();
        connections.forEach(function(conn){
            //console.log(model_id,father_id)
            if((conn.targetId == model_id)&&(conn.sourceId == father_id))conn.setVisible(false); // bbmap.views.main.instance.detach({source:source, target:target, fireEvent:false});
            if((conn.targetId == father_id)&&(conn.sourceId == model_id))conn.setVisible(false); // bbmap.views.main.instance.detach({source:source, target:target, fireEvent:false});
        })
    },
    addSimpleLink : function(father_id){
        // Remove link in both sens beetween this el and his id_father
        var model_id = this.model.get('id')
        bbmap.views.main.instance.connect({uuids:[father_id+"-bottom", model_id+"-top" ]}); 
    },
    /////////////////////////////////////////
    // 
    /////////////////////////////////////////
    editTitle : function(e){
        e.preventDefault();
        bbmap.views.main.updateEditor(this.model);
        //bbmap.views.editBox.openEditBox(this.model.get('id'),this.model.get('type'));
    },
    addEndpoint : function(){
        // Add endpoints
        var is_source = true;
        if(bbmap.views.main.mode == "visu") is_source = false;
        if(this.model.get('type') == 'concept'){
            bbmap.views.main.instance.addEndpoint(
                $(this.el), {
                    uuid:this.model.get('id') + "-bottom",
                    anchor:"Bottom",
                    isSource:is_source,
                    maxConnections:-1
                }
            );
            bbmap.views.main.instance.addEndpoint($(this.el), {
                uuid:this.model.get('id') + "-top",
                anchor:"Top",
                maxConnections:-1
            });
            if(bbmap.views.main.mode == "edit"){
                bbmap.views.main.instance.addEndpoint(
                    $(this.el), 
                    {
                        uuid:this.model.get('id') + "-right",
                        anchor:"AutoDefault",
                        isTarget: true,
                        isSource:is_source,
                        scope:"cklink",
                        maxConnections:-1
                    },
                    {
                        connectorStyle : { strokeStyle:"#2980B9", lineWidth:1,dashstyle:"2 2" },
                        endpoint:["Dot", { radius:10 }],
                        paintStyle:{ fillStyle:"#2980B9" },
                    }
                );
            }
        }else{
            if(bbmap.views.main.mode == "edit"){
                bbmap.views.main.instance.addEndpoint(
                    $(this.el), {
                        uuid:this.model.get('id') + "-left",
                        anchor:"AutoDefault",
                        isSource:is_source,
                        scope:"cklink",
                        maxConnections:-1
                    },
                    {
                        connectorStyle : { strokeStyle:"#2980B9", lineWidth:1,dashstyle:"2 2" },
                        endpoint:["Dot", { radius:10 }],
                        paintStyle:{ fillStyle:"#2980B9" },
                    }
                );
            }
        }
        
    },
    addLink : function(){
        // Add Link
        _this = this;
        try{
            if((this.model.get('type') == "concept")&&(this.model.get('id_father')) && (this.model.get('id_father') != "none")){
                if(bbmap.views.main.concepts.where({id : this.model.get('id_father')}).length == 0){
                    // si c'est un concept qu'on ajoute à partir d'une connaissance
                    var link_byTarget = bbmap.views.main.links.where({target : this.model.get('id')});
                    link_byTarget.forEach(function(link){
                        bbmap.views.main.instance.connect({
                            source:bbmap.views.main.nodes_views[link.get('source')].el, 
                            target:bbmap.views.main.nodes_views[link.get('target')].el, 
                            anchor:"AutoDefault",
                            scope : "cklink"
                        });  
                    }); 
                }else{
                    // Si c'est un concept qu'on ajoute à partir d'un concept
                    bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-bottom", this.model.get('id')+"-top" ]});     
                }
            }else if((this.model.get('type') == "knowledge")||(this.model.get('type') == "poche")){
                // Si cest une connaissance qu'on ajoute à partir d'une poche
                var link_byTarget = bbmap.views.main.links.where({target : this.model.get('id')});
                link_byTarget.forEach(function(link){
                    bbmap.views.main.instance.connect({
                        source:bbmap.views.main.nodes_views[link.get('source')].el, 
                        target:bbmap.views.main.nodes_views[link.get('target')].el, 
                        anchor:"AutoDefault",
                        scope : "cklink"
                    });  
                });     
            }
        }catch(err){
            // console.log(err);
        }         
    },
    makeTarget : function(){
        ///////////////////////
        // initialise as connection target.
        if(this.model.get('type') == "concept"){
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                anchor:"Top"             
            });
        }else{
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                scope:"cklink",
                anchor:"AutoDefault"             
            });
        }  
    },
    render : function(){
        //style
        //$(this.el).attr( "style","top: "+this.model.get('top')+"px;left:"+this.model.get('left')+"px");
        // Init
        $(this.el).empty();
        $(this.el).append(this.template_bulle({
            model:this.model.toJSON(),
            mode : bbmap.views.main.mode
        }));
        this.applyStyle();

        return this;
    }
});
