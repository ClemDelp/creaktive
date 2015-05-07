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
        }
    },
    /////////////////////////////////////////////
    // PERMISSION
    /////////////////////////////////////////////
    getPermission : function(){
        var autorisation = false;
        var permissions = global.collections.Permissions;
        var currentUser = global.models.current_user;
        var perm = permissions.where({user_id : currentUser.get('id')})
        if((perm.length > 0)&&((perm[0].get('right') == "admin")||(perm[0].get('right') == "rw"))) autorisation = true;
        return autorisation;
    },
    /////////////////////////////////////////////
    // LINKS RULES
    /////////////////////////////////////////////
    new_link_rules : function(link,source,target){
        // si la source et la target sont du mm type
        if(source.get('type') == target.get('type')){
            target.save({id_father : source.get('id')});
        }
        // si la source est une poche et la target est une connaissance
        else if((source.get('type') == "poche")&&(target.get('type') == "knowledge")){
            target.save({id_father : source.get('id')});   
        }
        // si ya une boucle infinie avec ce nouveau lien
        if(api.isInfiniteLoop(rules.elements,rules.elements.get(target.get('id')),[])){
            alert("You can't create loop!");
            setTimeout(function(){
                link.destroy();
                rules.setTheRightIDFather(rules.links,rules.elements,source);
                rules.setTheRightIDFather(rules.links,rules.elements,target);
            },1000);
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
    applyLegend : function(model){
        if(global.rules == true){
            if(rules.getPermission()){
                if(model.get('type') == "concept"){
                    if((model.get('content') == "")&&(model.get('css_auto') != "c_empty")){
                        console.log("legend not found and apply...")
                        model.save({ css_auto : "c_empty" },{silent:true});
                    }
                    else if((model.get('content') != "")&&(model.get('css_auto') != "c_full")){
                        console.log("legend not found and apply...")
                        model.save({ css_auto : "c_full"},{silent:true});
                    } 
                }else if(model.get('type') == "knowledge"){
                    if((model.get('content') == "")&&(model.get('css_auto') != "k_empty")){
                        console.log("legend not found and apply...")
                        model.save({ css_auto : "k_empty"},{silent:true});  
                    } 
                    else if((model.get('content') != "")&&(model.get('css_auto') != "k_full")){
                        console.log("legend not found and apply...")
                        model.save({ css_auto : "k_full"},{silent:true});
                    } 

                }else if(model.get('type') == "poche"){
                    var elements = api.getTypeLinkedToModel(rules.links,rules.elements,model,"knowledge");
                    if((elements.length == 0)&&(model.get('css_auto') != "p_empty")){
                        console.log("applyLegend")
                        model.save({ css_auto : "p_empty"},{silent:true});
                    } 
                    else if((elements.length > 0)&&(model.get('css_auto') != "p_full")){
                        console.log("applyLegend");
                        model.save({ css_auto : "p_full"},{silent:true});   
                    }
                }
            }    
        }
    },
}