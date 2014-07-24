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
        this.listenTo(this.model,"change:title", this.render); 
        this.listenTo(this.model,"change:css", this.render); 
        // Se mettre en ecoute sur le deplacement du node pere
        this.oldFather = new Backbone.Model();
        try{
            this.father = bbmap.views.main.concepts.get(this.model.get('id_father'));
            this.oldFather = this.father.clone();
            this.listenTo(this.father,"change:top change:left", this.followFather,this);
            this.listenTo(global.eventAggregator,this.father.get('id'),this.setOldFather,this);
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
    setOldFather : function(model){
        //alert("set old father")
        this.oldFather = model.clone();
    },
    followFather : function(){
        var hf_left = this.oldFather.get('left');
        var hf_top = this.oldFather.get('top');
        var f_left = this.father.get('left');
        var f_top = this.father.get('top');
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
    // addFollowFather : function(){
        
    //     try{

    //         var _this = this;
    //         var father_el = bbmap.views.main.nodes_views[this.model.get('id_father')].el;
    //         var father = bbmap.views.main.concepts.get(this.model.get('id_father')).clone();
    //         var oldFather = father.clone();
    //         var i = 0;
    //         $(father_el).watch('top left', function(){
    //             //alert('follow')
    //             if(i%5 == true){
    //                 var f_left = this.style.left.replace('px','');
    //                 var f_top = this.style.top.replace('px','');
    //                 ////console.log("father position : ",f_left,f_top)

    //                 var h_left = oldFather.get('left');
    //                 var h_top = oldFather.get('top');
    //                 ////console.log("hold position : ",h_left,h_top)

    //                 var n_left = _this.model.get('left');
    //                 var n_top = _this.model.get('top');

    //                 var delta_top = h_top - f_top;
    //                 var delta_left = h_left - f_left;
    //                 ////console.log("delta left: ",delta_left)

    //                 var x = (n_left - delta_left);
    //                 var y = (n_top - delta_top);

    //                 ////console.log("delta : ",delta_top,delta_left)
    //                 if((Math.abs(delta_left) > 1)||(Math.abs(delta_top) > 1)){
    //                     ////console.log("move at left:",x," - top:",y)
    //                     bbmap.views.main.nodes_views[_this.model.get('id')].setPosition(x,y,0,0,true);
    //                     bbmap.views.main.instance.repaint(_this.model.get('id'));
    //                     father.set({left:f_left,top:f_top},{silent:true});
    //                 }
    //                 oldFather = father.clone();
    //             }
    //             i = i +1;
    //         });
    //     }catch(err){
    //         //console.log("this node have no father!")
    //     }
    // },
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
        global.eventAggregator.trigger(this.model.get('id'),this.model)
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
            this.model.save({
                top:position.top / bbmap.zoom.get('val'),
                left:position.left / bbmap.zoom.get('val')
            });   
            //console.log(this.model.get('top'),this.model.get('left'))
        }
        ////console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
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
        bbmap.views.main.concepts.add(new_concept);
        bbmap.views.main.addModelToView(new_concept,"concept");
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
        bbmap.views.main.addModelToView(new_knowledge,"knowledge");
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
        
        // put all the child node parent_id attributes to none
        if(model.get('type') == 'concept'){
            childrens = bbmap.views.main.concepts.where({id_father : model.get('id')})
            childrens.forEach(function(child){
                child.set({id_father : "none"}).save();
            });
        } 
        model.destroy();
        this.removeView();
    },
    removeView : function(){
        //bbmap.views.main.instance.deleteEndpoint(this.el);
        this.endpoints.forEach(function(ep){
            bbmap.views.main.instance.deleteEndpoint(ep);
        });
        bbmap.views.main.instance.detachAllConnections($(this.el));
        this.remove();
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
                    connectorStyle : { strokeStyle:"#27AE60", lineWidth:1,dashstyle:"2 2" },
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
        //$(this.el).attr( "style","top: "+this.model.get('top')+"px;left:"+this.model.get('left')+"px");
        // Init
        $(this.el).empty();
        $(this.el).append(this.template_bulle({model:this.model.toJSON()}));
        this.applyStyle();
        
        return this;
    }
});
