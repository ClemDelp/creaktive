/////////////////////////////////////////////////
// NODE
/////////////////////////////////////////////////
bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','addEndpoint','addLink','makeTarget');
        // Variables
        this.model = json.model;
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change:title", this.render); 
        this.listenTo(this.model,"change:css", this.render); 
        this.listenTo(global.eventAggregator,this.model.get('id')+"_server", this.actualize,this);
        this.listenTo(global.eventAggregator,"attachment_added", this.render,this); 
        // Events
        // Templates
        this.template_bulle = _.template($('#bbmap-bulle-template').html());
    },
    events : {
        "click .sup" : "removeModel",
        "click .ep" : "addConceptChild",
        "click .ep2" : "addKnowledgeChild",
        "click .ep3" : "editBulle",
        // "click .replier" : "replier"
    },
    /////////////////////////////////////////
    replier : function(e){
        var nodes = api.getTreeChildrenNodes(this.model,bbmap.views.main.concepts);
        nodes.forEach(function(node){node.save({visibility:"hide"});}); // pour cacher le node
        this.model.save({displayChildrens : false}); // pour aficher le nbre de fils cachés
    },
    editBulle : function(e){
        e.preventDefault();
        var id = e.target.id;
        bbmap.views.main.setLastModel(this.model,'editBulle');
        bbmap.views.main.startJoyride();
    },
    actualize : function(model,save){
        var old_id_father = this.model.get('id_father');
        var new_id_father = model.id_father;
        ////////////////////////
        this.model.set({
            top: model.top,
            left: model.left,
            comments : new global.Collections.Comments(model.comments),
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
    applyStyle : function(){
        // if((!this.model.get('css'))||(this.model.get('css') == "")){
        //     if(this.model.get('type') == "concept")this.model.set({css : bbmap.css_concept_default},{silent:true});
        //     else if(this.model.get('type') == "knowledge") this.model.set({css : bbmap.css_knowledge_default},{silent:true});
        //     else if(this.model.get('type') == "poche") this.model.set({css : bbmap.css_poche_default},{silent:true});
        // }
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
    setPosition : function(x, y, sz, h, broadcast, from, notif){
        var origin = "normal";
        if(from) origin = from;
        var before_change = this.model.clone();
        var left = (x - h);
        var top  = (y - h);
        this.cssPosition(top,left);
        this.model.save({
            top: top,
            left: left
        },{silent:broadcast, notification : notif});
        var after_change = this.model.clone();
        // Set old father !!! 
        //if((origin == "normal")||(origin == "followfather"))global.eventAggregator.trigger(this.model.get('id')+"_followme",before_change,after_change)
    },
    /////////////////////////////////////////////
    getPosition : function(z){
        var zoom = 1;
        if(z) zoom = z;
        var position = {};
        position.left = $(this.el).position().left/zoom;
        position.top = $(this.el).position().top/zoom;
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
    savePosition: function(e){
        if(bbmap.views.main.mode == "edit"){
            var position = this.getPosition(bbmap.zoom.get('val'));
            var oldModel = this.model.clone();
            var p1 = {'left':oldModel.get('left'),'top':oldModel.get('top')};
            var p2 = {'left':position.left,'top':position.top};
            var delta = api.getXYTranslationBtwTwoPoints(p1,p2);
            
            if((abs(oldModel.get('top')-position.top)>=1)||(abs(oldModel.get('left')-position.left)>=1)){
                if((position.top != 0)&&($(this.el).position().left != 0)){
                    // Si la view n'a pas été supprimée on save
                    var before_change = this.model.clone();
                    this.model.save({
                        top:position.top,
                        left:position.left
                    });   
                    var after_change = this.model.clone();
                    //////////////////////////////
                    var idAlreadyMoved = []; // important!!! Evite de déplacer un element qui a deja ete delpacer et evite ainsi de faire des boucles
                    this.following(idAlreadyMoved,delta,this.model);
                    //////////////////////////////
                    //global.eventAggregator.trigger(this.model.get('id')+"_followme",before_change,after_change)
                    //console.log(this.model.get('top'),this.model.get('left'))
                }
                ////console.log("position : x"+this.model.get('left')+" - y"+this.model.get('top'))
                //bbmap.views.main.reorganizeTree(this.model.get('id'))           
            }
        }
    },
    following : function(idAlreadyMoved,delta,model){
        var _this = this;
        var followers = api.getModelsLinkedToModel(bbmap.views.main.links,bbmap.views.main.elements,model);
        // Set the followers
        followers.forEach(function(f){
            if(_.indexOf(idAlreadyMoved, f.get('id')) == -1){
                idAlreadyMoved.push(f.get('id'));

                var f_view = bbmap.views.main.nodes_views[f.get('id')];
                var f_position = f_view.getPosition(bbmap.zoom.get('val'));
                var newPosition = api.getNewPositionAfterTranslation(f_position,delta);

                f_view.setPosition(newPosition.left,newPosition.top,0,0,false,'followers',true)
                bbmap.views.main.instance.repaint(f.get('id'));
                _this.following(idAlreadyMoved,delta,f)
            }
        });
    },
    addConceptChild : function(e){
        e.preventDefault();
        var new_element = new global.Models.Element({
            id : guid(),
            type : "concept",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new concept",
            user: bbmap.views.main.user.get('id'),
            css : bbmap.css_concept_default,
        });
        new_element.save();
        // On crée le link entre C et K
        this.newCKLink(new_element);
        // On ajoute le model à la view
        bbmap.views.main.addModelToView(new_element);
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        // On crée la K
        var new_element = new global.Models.Element({
            id : guid(),
            type : "knowledge",
            id_father: this.model.get('id'),
            top : ($(this.el).position().top + 100) / bbmap.zoom.get('val'),
            left : $(this.el).position().left / bbmap.zoom.get('val'),
            project: bbmap.views.main.project.get('id'),
            title: "new knowledge",
            user: bbmap.views.main.user.get('id'),
            css : bbmap.css_knowledge_default,
        });
        new_element.save();
        // On crée le link entre C et K
        this.newCKLink(new_element);
        // On ajoute le model à la view
        bbmap.views.main.addModelToView(new_element);
    },
    newCKLink : function(target_model){
        var new_cklink = new global.Models.CKLink({
            id :guid(),
            user : bbmap.views.main.user.get('id'),
            date : getDate(),
            source : this.model.get('id'),
            target : target_model.get('id'),
            project : bbmap.views.main.project.get('id')
        });
        new_cklink.save();
        bbmap.views.main.links.add(new_cklink);
    },
    /////////////////////////////////////////
    // Remove function
    /////////////////////////////////////////
    removeModel : function(e){
        e.preventDefault();
        this.removeConfirmSwal();
    }, 
    removeConfirmSwal : function(){
        var _this = this;
        swal({   
            title: "Are you sure?",   
            text: "this "+_this.model.get('type')+" will be remove, would you continue?",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, delete it!",   
            closeOnConfirm: true,
            allowOutsideClick : true
        }, 
        function(){   
            _this.removeNode();
        });
    },
    removeNode : function(){
        var model = this.model;
        // Remove connections if there are
        var childrens = bbmap.views.main.elements.where({id_father : model.get('id')})
        childrens.forEach(function(child){
            child.set({id_father : "none"}).save();
        });
        
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
        });
    },
    addSimpleLink : function(father_id){
        // Remove link in both sens beetween this el and his id_father
        var model_id = this.model.get('id')
        bbmap.views.main.instance.connect({uuids:[father_id+"-bottom", model_id+"-top" ]}); 
    },
    addEndpoint : function(){
        // Add endpoints
        var is_source = true;
        if(bbmap.views.main.mode == "visu") is_source = false;
        // if(this.model.get('type') == 'concept'){
        //     bbmap.views.main.instance.addEndpoint(
        //         $(this.el), {
        //             uuid:this.model.get('id') + "-bottom",
        //             anchor:"Bottom",
        //             isSource:is_source,
        //             maxConnections:-1
        //         }
        //     );
        //     bbmap.views.main.instance.addEndpoint($(this.el), {
        //         uuid:this.model.get('id') + "-top",
        //         anchor:"Top",
        //         maxConnections:-1
        //     });
        //     if(bbmap.views.main.mode == "edit"){
        //         bbmap.views.main.instance.addEndpoint(
        //             $(this.el), 
        //             {
        //                 uuid:this.model.get('id') + "-right",
        //                 anchor:"AutoDefault",
        //                 isTarget: true,
        //                 isSource:is_source,
        //                 scope:"cklink",
        //                 maxConnections:-1
        //             },
        //             {
        //                 connectorStyle : { strokeStyle:"#2980B9", lineWidth:1,dashstyle:"2 2" },
        //                 endpoint:["Dot", { radius:10 }],
        //                 paintStyle:{ fillStyle:"#2980B9" },
        //             }
        //         );
        //     }
        // }else{
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
        // }
        
    },
    addLink : function(){
        // Add Link
        _this = this;
        try{
            // if((this.model.get('type') == "concept")&&(this.model.get('id_father')) && (this.model.get('id_father') != "none")){
            //     if(bbmap.views.main.concepts.where({id : this.model.get('id_father')}).length == 0){
            //         // si c'est un concept qu'on ajoute à partir d'une connaissance
            //         var link_byTarget = bbmap.views.main.links.where({target : this.model.get('id')});
            //         link_byTarget.forEach(function(link){
            //             bbmap.views.main.instance.connect({
            //                 source:bbmap.views.main.nodes_views[link.get('source')].el, 
            //                 target:bbmap.views.main.nodes_views[link.get('target')].el, 
            //                 anchor:"AutoDefault",
            //                 scope : "cklink"
            //             });  
            //         }); 
            //     }else{
            //         // Si c'est un concept qu'on ajoute à partir d'un concept
            //         bbmap.views.main.instance.connect({uuids:[this.model.get('id_father')+"-bottom", this.model.get('id')+"-top" ]});     
            //     }
            // }else if((this.model.get('type') == "knowledge")||(this.model.get('type') == "poche")){
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
            // }
        }catch(err){
            // console.log(err);
        }         
    },
    makeTarget : function(){
        ///////////////////////
        // initialise as connection target.
        // if(this.model.get('type') == "concept"){
        //     bbmap.views.main.instance.makeTarget(this.model.get('id'), {
        //         dropOptions:{ hoverClass:"dragHover" },
        //         anchor:"Top"             
        //     });
        // }else{
            bbmap.views.main.instance.makeTarget(this.model.get('id'), {
                dropOptions:{ hoverClass:"dragHover" },
                scope:"cklink",
                anchor:"AutoDefault"             
            });
        // }  
    },
    render : function(){
        var user = global.collections.Users.get(this.model.get('user'));
        $(this.el).empty();
        $(this.el).append(this.template_bulle({
            model:this.model.toJSON(),
            user : bbmap.views.main.user.toJSON(),
            mode : bbmap.views.main.mode
        }));
        this.applyStyle();

        return this;
    }
});
