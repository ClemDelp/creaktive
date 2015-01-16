/////////////////////////////////////////////////
// NODE
/////////////////////////////////////////////////
bbmap.Views.Node = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','savePosition','addEndpoint','makeTarget');
        // Variables
        this.model = json.model;
        // Events
        $(this.el).click(this.savePosition);
        this.listenTo(this.model,"change", this.render); 
        // this.listenTo(this.model,"change:css", this.render); 
        // this.listenTo(this.model,"change:top change:left", this.render); 
        // this.listenTo(global.eventAggregator,this.model.get('id')+"_server", this.actualize,this);
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
    //////////////////////////////////////////
    // Follow father system
    //////////////////////////////////////////
    applyStyle : function(){
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
        if(e.target.getAttribute("data-type") != "action"){
            // center to element
            var position = {top : $(this.el).offset().top, left :$(this.el).offset().left}
            bbmap.views.main.centerToElement(position);
            //
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
        var top = ($(this.el).position().top + 100) / bbmap.zoom.get('val');
        var left = $(this.el).position().left / bbmap.zoom.get('val');
        var new_element = global.newElement("concept","",this.model,top,left);
        bbmap.views.main.newViewAndLink(new_element,top,left);
    },
    addKnowledgeChild : function(e){
        e.preventDefault();
        var top = ($(this.el).position().top + 100) / bbmap.zoom.get('val');
        var left = $(this.el).position().left / bbmap.zoom.get('val');
        var new_element = global.newElement("knowledge","",this.model,top,left);
        bbmap.views.main.newViewAndLink(new_element,top,left);
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
        if(this.model.get('content') != ""){
            swal({   
                title: "This "+_this.model.get('type')+" have a content!",   
                text: "would you continue?",   
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
        }else{
            this.removeNode()
        }
        
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
        // Remove model
        model.destroy();
    },
    removeView : function(from){
        var origin = "client";
        if(from) origin = from;
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
    addEndpoint : function(){
        // Add endpoints
        var is_source = true;
        if(bbmap.views.main.mode == "visu") is_source = false;
        
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
    },
    makeTarget : function(){
        // initialise as connection target.
        bbmap.views.main.instance.makeTarget(this.model.get('id'), {
            dropOptions:{ hoverClass:"dragHover" },
            scope:"cklink",
            anchor:"AutoDefault"             
        }); 
    },
    render : function(){
        var user = global.collections.Users.get(this.model.get('user'));
        $(this.el).empty();
        
        $(this.el).append(this.template_bulle({
            model:this.model.toJSON(),
            user : user.toJSON(),
            mode : bbmap.views.main.mode
        }));
        this.applyStyle();

        return this;
    }
});
