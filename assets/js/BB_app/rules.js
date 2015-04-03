var rules = {
    //////////////////////////////
    init : function(){
        if(global.rules == true){
            this.links = global.collections.Links;
            this.elements = global.collections.Elements;
            this.concepts = global.collections.Elements.where({type : "concept"});
            this.knowledges = global.collections.Elements.where({type : "knowledge"});
            this.poches = global.collections.Elements.where({type : "poche"});   
            //////////////////
            // Apply legend
            // this.elements.each(function(model){
            //     rules.applyLegend(model);
            // });   
        }
    },
    applyForAll : function(elements){
        elements.each(function(model){
            rules.applyLegend(model);
        }); 
    },
    //////////////////////////////
    applyLegend : function(model){
        if(global.rules == true){
            console.log("applyLegend")
            var permissions = global.collections.Permissions;
            var currentUser = global.models.current_user;
            var perm = permissions.where({user_id : currentUser.get('id')})
            if((perm.length > 0)&&((perm[0].get('right') == "admin")||(perm[0].get('right') == "rw"))){
                
                if(model.get('type') == "concept"){

                    if((model.get('content') == "")&&(model.get('css') != "c_empty")) model.save({ css : "c_empty" },{silent:true});
                    else if((model.get('content') != "")&&(model.get('css') != "c_full")) model.save({ css : "c_full"},{silent:true});

                }else if(model.get('type') == "knowledge"){

                    if((model.get('content') == "")&&(model.get('css') != "k_empty")) model.save({ css : "k_empty"},{silent:true});
                    else if((model.get('content') != "")&&(model.get('css') != "k_full")) model.save({ css : "k_full"},{silent:true});

                }else if(model.get('type') == "poche"){

                    var elements = api.getTypeLinkedToModel(rules.links,rules.elements,model,"knowledge");
                    if((elements.length == 0)&&(model.get('css') != "p_empty")) model.save({ css : "p_empty"},{silent:true});
                    else if((elements.length > 0)&&(model.get('css') != "p_full"))model.save({ css : "p_full"},{silent:true});

                }
            }    
        }
    },
}