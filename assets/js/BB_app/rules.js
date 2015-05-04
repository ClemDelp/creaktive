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
            rules.global_elements_rules();
            rules.links_id_father_rules(); 
        }
    },
    /////////////////////////////////////////////
    // LINKS RULES
    /////////////////////////////////////////////
    links_id_father_rules : function(){
        rules.elements.each(function(model){            
            var models = api.getTreeParentNodes(model,rules.elements,[]);
            if(models.length == 0){
                ////////////////////////////
                // fixe id_father problem
                if(model.get('id_father') != "none"){
                    model.save({id_father : "none"});
                }

            }
        })
    },
    new_link_rules : function(link,source,target){
        // si la source et la target sont du mm type
        if(source.get('type') == target.get('type')){
            target.save({id_father : source.get('id')});
        }
        // si la source est une poche et la target est une connaissance
        else if((source.get('type') == "poche")&&(target.get('type') == "knowledge")){
            target.save({id_father : source.get('id')});   
        }
    },
    setTheRightIDFather : function(links,elements,model){
        // links have to be a collection a link model
        var id_father = "none";
        var ckLinks = links.where({target : model.get('id')});
        ckLinks.forEach(function(link){
          var source = elements.get(link.get('source'));
          var target = model;
          if((source.get('type') == target.get('type'))||((source.get('type') == "poche")&&(target.get('type') == "knowledge"))) id_father = source.get('id');
        });
        model.save({id_father : id_father});
    },
    link_style_rules : function(link){
        var c_color = "#27AE60";
        var k_color = "#1B9DD3";
        var p_color = "#E67E22";
        var source = rules.elements.get(link.get('source'));
        var target = rules.elements.get(link.get('target'));
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
    /////////////////////////////////////////////
    // ELEMENTS RULES
    /////////////////////////////////////////////
    global_elements_rules : function(){
        rules.elements.each(function(model){
            // ajout ou update de l'atribut visibility
            try{
                if(model.get('visibility') == undefined){
                    model.save({visibility : true}); // par default mettre la valeur à show
                }else if(model.get('visibility') == "show"){
                    model.save({visibility : true});  
                }else if(model.get('visibility') == "hide"){
                    model.save({visibility : false});
                }
            }catch(err){
                console.log(err);
            }    
        })
    },
    applyForAll : function(elements){
        elements.each(function(model){
            rules.applyLegend(model);
        }); 
    },
    applyLegend : function(model){
        if(global.rules == true){
            var permissions = global.collections.Permissions;
            var currentUser = global.models.current_user;
            var perm = permissions.where({user_id : currentUser.get('id')})
            if((perm.length > 0)&&((perm[0].get('right') == "admin")||(perm[0].get('right') == "rw"))){
                if(model.get('type') == "concept"){
                    if((model.get('content') == "")&&(model.get('css') != "c_empty")){
                        console.log("applyLegend")
                        model.save({ css : "c_empty" },{silent:true});
                    }
                    else if((model.get('content') != "")&&(model.get('css') != "c_full")){
                        console.log("applyLegend")
                        model.save({ css : "c_full"},{silent:true});
                    } 
                }else if(model.get('type') == "knowledge"){
                    if((model.get('content') == "")&&(model.get('css') != "k_empty")){
                        console.log("applyLegend")
                        model.save({ css : "k_empty"},{silent:true});  
                    } 
                    else if((model.get('content') != "")&&(model.get('css') != "k_full")){
                        console.log("applyLegend")
                        model.save({ css : "k_full"},{silent:true});
                    } 

                }else if(model.get('type') == "poche"){
                    var elements = api.getTypeLinkedToModel(rules.links,rules.elements,model,"knowledge");
                    if((elements.length == 0)&&(model.get('css') != "p_empty")){
                        console.log("applyLegend")
                        model.save({ css : "p_empty"},{silent:true});
                    } 
                    else if((elements.length > 0)&&(model.get('css') != "p_full")){
                        console.log("applyLegend");
                        model.save({ css : "p_full"},{silent:true});   
                    }
                }
            }    
        }
    },
}