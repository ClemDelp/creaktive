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
    },
    actualize : function(model){
        this.model.set({
            top: model.top,
            left: model.left,
            title: model.title,
            css: model.css
        });
        this.applyStyle();
    },
    followFather : function(oldFather,father){
        //alert(this.model.get('title')+' - follow its father');
        console.log(this.model.get('title'),' - follow its father');
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
        
    },
    applyStyle : function(){
        if(!this.model.get('css')){    
            if(this.model.get('type') == "concept")this.model.save({css : bbmap.css_concept_default},{silent:true});
            else if(this.model.get('type') == "knowledge") this.model.save({css : bbmap.css_knowledge_default},{silent:true});
            else if(this.model.get('type') == "poche") this.model.save({css : bbmap.css_poche_default},{silent:true});
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
    getPosition : function(){
        var position = {};
        position.left = $(this.el).position().left
        position.top = $(this.el).position().top
        return position;
    },
    savePosition: function(e){
        var position = this.getPosition();
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
        bbmap.views.main.concepts.add(new_concept);
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
        bbmap.views.main.knowledges.add(new_knowledge);
        // On crée le link entre C et K
        var new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user,
            date : getDate(),
            source : this.model.get('id'),
            target : new_knowledge.get('id')
        });
        new_cklink.save();
        bbmap.views.main.links.add(new_cklink);
        // On ajoute le model à la view
        bbmap.views.main.addModelToView(new_knowledge);
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
        // Remove model
        model.destroy();
        this.removeView();
    },
    removeView : function(){
        //bbmap.views.main.instance.deleteEndpoint(this.el);
        // this.endpoints.forEach(function(ep){
        //     try{bbmap.views.main.instance.deleteEndpoint(ep);}catch(err){}
        // });
        bbmap.views.main.instance.removeAllEndpoints($(this.el));
        bbmap.views.main.instance.detachAllConnections($(this.el));
        this.close();
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
                bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-bottom", this.model.get('id')+"-top" ]}); 
            }else if((this.model.get('type') == "knowledge")||(this.model.get('type') == "poche")){
                var link_byTarget = bbmap.views.main.links.where({target : this.model.get('id')});
                link_byTarget.forEach(function(link){
                    console.log('liiink',link)
                    bbmap.views.main.instance.connect({
                        source:bbmap.views.main.nodes_views[link.get('source')].el, 
                        target:bbmap.views.main.nodes_views[link.get('target')].el, 
                        anchor:"AutoDefault",
                        scope : "cklink"
                    });  
                });     
            }
        }catch(err){
            //console.log(err);
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
        $(this.el).append(this.template_bulle({model:this.model.toJSON()}));
        this.applyStyle();
        
        return this;
    }
});
