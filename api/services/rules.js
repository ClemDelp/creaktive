module.exports = {

    apply_rules : function(elements,links,cb){
        rules.global_elements_rules(elements,links);
        rules.global_links_rules(elements,links);

        if(cb) cb();
    },
    /////////////////////////////////////////////
    // LINKS RULES
    /////////////////////////////////////////////
    global_links_rules : function(elements,links){
        try{
            links.forEach(function(link){
                /////////////////////////////////////////////////////////
                // si ya plusieurs fois le mm lien supprimer les doublons
                var ls = _.where(links,{source : link.source, target : link.target });
                if(ls.length >1 ){
                    //console.log("find and remove duplicates links...")
                    for(var i=0; i<ls.length;i++){
                        if(i>0){
                            ls[i].destroy(function(err){console.log('error: ',err);});
                            //console.log("rules : we remove link because it was a clone...")
                        }
                    }
                }
                /////////////////////////////////////////////////////////
                // si un lien pointe vers un element qui n'existe plus
                if((_.where(elements, { id : link.source}).length == 0)||(_.where(elements, { id : link.target}).length == 0)){
                    link.destroy(function(err){console.log('error: ',err);});
                    //console.log("rules : we remove link because her source or target element was not found...")
                } 
            })
        }catch(err){
            //console.error(err);
        }

    },
    /////////////////////////////////////////////
    // ELEMENTS RULES
    /////////////////////////////////////////////
    global_elements_rules : function(elements,links){
        elements.forEach(function(model){            
            ////////////////////////////////////////////////
            // ajout ou update de l'atribut visibility
            ////////////////////////////////////////////////
            try{
                // fixe id_father problem
                var models = api.getTreeParentNodes(model,elements,[]);
                if(models.length == 0){
                    if(model.id_father != "none"){
                        model.id_father = "none";
                        model.save(function (error){console.log("error: ",error)});
                        //console.log("problem id_father found and fixed...")
                    }
                }
            }catch(err){
                //console.log(err);
            }
            ////////////////////////////////////////////////
            // ajout ou update de l'atribut visibility
            ////////////////////////////////////////////////
            try{
                if(model.visibility == undefined){
                    model.visibility = true; // par default mettre la valeur à show
                    model.save(function (error){console.log("error: ",error)});
                    //console.log("problem with visibility found and fixed...")
                }
                else if(model.visibility == "show"){
                    model.visibility = true;
                    model.save(function (error){console.log("error: ",error)});
                    //console.log("problem with visibility found and fixed...")
                }
                else if(model.visibility == "hide"){
                    model.visibility = false;
                    model.save(function (error){console.log("error: ",error)});
                    //console.log("problem with visibility found and fixed...")
                }
            }catch(err){
                //console.log(err);
            }
            ////////////////////////////////////////////////
            // css_auto or css_manu attribute controle
            ////////////////////////////////////////////////
            try{
                // si le model ni d'attribu css_auto ni css_manu alors on lui applique un css_auto
                if((model.css_auto == undefined)||(model.css_manu == undefined)){
                    rules.applyLegend(model,elements,links)  
                }
            }catch(err){
                //console.log(err);
            }  
            //////////////////////////////////////////////// 
        });
    },
    applyLegend : function(model,elements,links){
        if(model.type == "concept"){
            if((model.content == "")&&(model.css_auto != "c_empty")){
                //console.log("legend not found and apply...")
                model.css_auto = "c_empty";
                model.save(function (error){console.log("error: ",error)});
            }
            else if((model.content != "")&&(model.css_auto != "c_full")){
                //console.log("legend not found and apply...")
                model.css_auto = "c_full";
                model.save(function (error){console.log("error: ",error)});
            } 
        }else if(model.type == "knowledge"){
            if((model.content == "")&&(model.css_auto != "k_empty")){
                //console.log("legend not found and apply...")
                model.css_auto = "k_empty";
                model.save(function (error){console.log("error: ",error)});
            } 
            else if((model.content != "")&&(model.css_auto != "k_full")){
                //console.log("legend not found and apply...")
                model.css_auto = "k_full";
                model.save(function (error){console.log("error: ",error)});
            } 

        }else if(model.type == "poche"){
            var elements = api.getTypeLinkedToModel(links,elements,model,"knowledge");
            if((elements.length == 0)&&(model.css_auto != "p_empty")){
                model.css_auto = "p_empty";
                model.save(function (error){console.log("error: ",error)});
            } 
            else if((elements.length > 0)&&(model.css_auto != "p_full")){
                //console.log("applyLegend");
                model.css_auto = "p_full"; 
                model.save(function (error){console.log("error: ",error)});
            }
        }
            
    },
}