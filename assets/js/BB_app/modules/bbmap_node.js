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
        try{
            this.father = bbmap.views.main.concepts.get(this.model.get('id_father'));
            this.holdFather = this.father.clone();
            this.listenTo(this.father,"change:top change:left", this.addFollowFather,this);
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
    addFollowFather : function(){
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
        // try{

        //     var _this = this;
        //     var father_el = bbmap.views.main.nodes_views[this.model.get('id_father')].el;
        //     var father = bbmap.views.main.concepts.get(this.model.get('id_father')).clone();
        //     var holdFather = father.clone();
        //     var i = 0;
        //     $(father_el).watch('top left', function(){
        //         //alert('follow')
        //         if(i%5 == true){
        //             var f_left = this.style.left.replace('px','');
        //             var f_top = this.style.top.replace('px','');
        //             //console.log("father position : ",f_left,f_top)

        //             var h_left = holdFather.get('left');
        //             var h_top = holdFather.get('top');
        //             //console.log("hold position : ",h_left,h_top)

        //             var n_left = _this.model.get('left');
        //             var n_top = _this.model.get('top');

        //             var delta_top = h_top - f_top;
        //             var delta_left = h_left - f_left;
        //             //console.log("delta left: ",delta_left)

        //             var x = (n_left - delta_left);
        //             var y = (n_top - delta_top);

        //             //console.log("delta : ",delta_top,delta_left)
        //             if((Math.abs(delta_left) > 1)||(Math.abs(delta_top) > 1)){
        //                 //console.log("move at left:",x," - top:",y)
        //                 bbmap.views.main.nodes_views[_this.model.get('id')].setPosition(x,y,0,0,true);
        //                 bbmap.views.main.instance.repaint(_this.model.get('id'));
        //                 father.set({left:f_left,top:f_top},{silent:true});
        //             }
        //             holdFather = father.clone();
        //         }
        //         i = i +1;
        //     });
        // }catch(err){
        //     console.log("this node have no father!")
        // }
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
            console.log(this.model.get('top'),this.model.get('left'))
        }
        //console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
        //bbmap.views.main.reorganizeTree(this.model.get('id'))
    },
    addConceptChild : function(e){
        e.preventDefault();
        var model = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new concept",
            user: bbmap.views.main.user
        });
        model.save();
        bbmap.views.main.concepts.add(model);
        // On crée le link entre C et K
        new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user,
            date : getDate(),
            source : this.model.get('id'),
            target : model.get('id'),
            type : "concept-concept"
        });
        new_cklink.save();
        // On ajoute le link à la collection
        bbmap.views.main.cklinks.add(new_cklink);
        // On ajoute le model a la vue
        bbmap.views.main.addModelToView(model,"concept");
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        // On crée la K
        var model = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            //id_fathers: [this.model.get('id')],
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new knowledge",
            user: bbmap.views.main.user
        });
        model.save();
        bbmap.views.main.knowledges.add(model);
        // On crée le link entre C et K
        new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user,
            date : getDate(),
            source : this.model.get('id'),
            target : model.get('id'),
            type : "concept-knowledge"
        });
        new_cklink.save();
        // On ajoute le link à la collection
        bbmap.views.main.cklinks.add(new_cklink);
        // On ajoute le model a la vue
        bbmap.views.main.addModelToView(model,"knowledge");
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
        // On supprimer egalement les liens si source
        var links_to_removed = bbmap.views.main.cklinks.where({source : this.model.get('id')});
        links_to_removed.forEach(function(link){link.destroy();});
        // On supprimer egalement les liens si target
        var links_to_removed = bbmap.views.main.cklinks.where({target : this.model.get('id')});
        links_to_removed.forEach(function(link){link.destroy();});
        // Remove model and the view associated
        model.destroy();
        this.removeView();
    },
    removeView : function(){
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
        var _this = this;
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
            if(bbmap.views.main.mode == "edit"){
                this.endpoints.unshift(bbmap.views.main.instance.addEndpoint(
                    $(this.el), 
                    {
                        uuid: this.model.get('id') + "-right",
                        anchor: "AutoDefault",
                        isSource: true,
                        //scope:"concept",
                        maxConnections:-1
                    },
                    {
                        // parent : bbmap.views.main.nodes_views[this.model.get('id')].el,
                        connectorStyle : { strokeStyle:"#27AE60", lineWidth:1,dashstyle:"2 2" },
                        endpoint:["Dot", { radius:10 }],
                        paintStyle:{ fillStyle:"#27AE60" },
                    }
                ));
            }
        }else{
            this.endpoints.unshift(bbmap.views.main.instance.addEndpoint(
                $(this.el), {
                    uuid:this.model.get('id') + "-left",
                    anchor:"AutoDefault",
                    isSource:true,
                    //scope:"category",
                    maxConnections:-1
                },
                {
                    connectorStyle : { strokeStyle:"#2980B9", lineWidth:1,dashstyle:"2 2" },
                    endpoint:["Dot", { radius:10 }],
                    paintStyle:{ fillStyle:"#2980B9" },
                }
            ));
        }
    },
    addLink : function(){
        // Add Link
        var _this = this;
        var links = bbmap.views.main.cklinks.where({source : this.model.get('id')});
        links.forEach(function(link){
            try{
                if(!link.get('type')) global.Functions.setLinkType(link)
                if(link.get('type') == "concept-concept"){
                    bbmap.views.main.instance.connect({uuids:[link.get('source')+"-bottom", link.get('target')+"-top" ]});
                }
                else{
                    bbmap.views.main.instance.connect({
                        source:bbmap.views.main.nodes_views[link.get('source')].el,
                        anchor:"AutoDefault",
                        target:bbmap.views.main.nodes_views[link.get('target')].el,
                        detachable:false
                    });
                }
                 
                // }else if((this.model.get('type') == 'knowledge') && (bbmap.views.main.ckOperator == true)){
                //     // Get all CKLink 
                //     k_links = bbmap.views.main.cklinks.where({knowledge : this.model.get('id')});
                //     k_links.forEach(function(link){
                //         bbmap.views.main.instance.connect({
                //             source:bbmap.views.main.nodes_views[link.get('concept')].el,
                //             anchor:"AutoDefault",
                //             target:bbmap.views.main.nodes_views[_this.model.get('id')].el,
                //             detachable:false
                //         });     
                //     });         
                // }
            }catch(err){
               console.log("impossible to find target bulle...");
            }
        });         
    },
    makeTarget : function(){
        ///////////////////////
        // initialise as connection target.
        // if(this.model.get('type') == "concept"){
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                anchor:"AutoDefault"             
            });
        // }else if(this.model.get('type') == "knowledge"){
        //     bbmap.views.main.instance.makeTarget(this.model.get('id'), 
        //         {
        //             dropOptions:{ hoverClass:"dragHover" },
        //             scope:"cTok",
        //             anchor:"AutoDefault" 
        //         }
        //     );
        // }
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
