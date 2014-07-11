/////////////////////////////////////////////////
// NODE
/////////////////////////////////////////////////
bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','editTitle','addEndpoint','addLink','makeTarget');
        // Variables
        this.model = json.model;
        this.endpoints = []; 
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change", this.render); 
        // Se mettre en ecoute sur le deplacement du node pere
        try{
            this.father = bbmap.views.main.concepts.get(this.model.get('id_father'));
            this.holdFather = this.father.clone();
            this.listenTo(this.father,"change:top change:left", this.followFather,this);
        }catch(err){
            console.log('no father detected')
        }
        // Templates
        this.template_bulle = _.template($('#bbmap-bulle-template').html());
    },
    events : {
        "click .editTitle" : "editTitle",
        "click .sup" : "removeModel",
        "click .ep" : "addConceptChild",
        "click .ep2" : "addKnowledgeChild",
    },
    followFather : function(){
        var hf_left = this.holdFather.get('left');
        var hf_top = this.holdFather.get('top');
        var f_left = this.father.get('left');
        var f_top = this.father.get('top');
        var n_left = this.model.get('left');
        var n_top = this.model.get('top');
        var delta_top = hf_top - f_top;
        var delta_left = hf_left - f_left;
        var x = n_left - delta_left;
        var y = n_top - delta_top;
        this.setPosition(x,y,0,0,false);
        this.holdFather = this.father.clone();
        bbmap.views.main.instance.repaint(this.model.get('id'));
    },
    applyStyle : function(){
        if(!this.model.get('css')){    
            if(this.model.get('type') == "concept")this.model.save({css : bbmap.css_concept_default},{silent:true});
            else if(this.model.get('type') == "knowledge") this.model.save({css : bbmap.css_knowledge_default},{silent:true});
        }
        var left = this.model.get('left');
        var top = this.model.get('top');
        var style = 'top:' + top + 'px; left : ' + left + 'px;' + this.model.get('css');
        $(this.el).attr('style',style)
        bbmap.views.main.instance.repaint(this.model.get('id'));

    },
    setPosition : function(x, y, sz, h, broadcast){
        var left = (x - h);
        var top  = (y - h);
        var styles = {
            'left': left +'px',
            'top':  top  + 'px'
        };
        $(this.el).css( styles );
        this.model.save({
            top: top,
            left: left
        },{silent:broadcast}); 
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
            this.model.set({
                top:position.top / bbmap.zoom.get('val'),
                left:position.left / bbmap.zoom.get('val')
            }).save();   
        }
        //console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
        //bbmap.views.main.reorganizeTree(this.model.get('id'))
    },
    addConceptChild : function(e){
        e.preventDefault();
        new_concept = new global.Models.ConceptModel({
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

        bbmap.views.main.addConceptToView(new_concept);
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        // On crée la K
        new_knowledge = new global.Models.Knowledge({
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

        bbmap.views.main.addKnowledgeToView(new_knowledge);
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
            model.destroy();
            this.remove();
            // $(this.el).hide('slow');
            
        }
    },
    editTitle : function(e){
        e.preventDefault();
        bbmap.views.main.updateEditor(this.model);
        //bbmap.views.editBox.openEditBox(this.model.get('id'),this.model.get('type'));
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
                    connectorStyle : { strokeStyle:"#27AE60", lineWidth:0.5,dashstyle:"2 2" },
                    endpoint:["Dot", { radius:5 }],
                    paintStyle:{ fillStyle:"#27AE60" },
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
                    connectorStyle : { strokeStyle:"#2980B9", lineWidth:1,dashstyle:"2 2" },
                    endpoint:["Dot", { radius:5 }],
                    paintStyle:{ fillStyle:"#2980B9" },
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
        $(this.el).append(this.template_bulle({model:this.model.toJSON()}));
        this.applyStyle();
        bbmap.views.main.instance.draggable($(this.el)); 
        return this;
    }
});
