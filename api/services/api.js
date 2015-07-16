var api = {
  //////////////////////////////
  // Fonctions pour les suggestions
  //////////////////////////////
  // EVALUATION EVAL
  cross_product : function(echelle_max,max,value){
    var val = value*echelle_max/max;
    return Math.round(val*100)/100;
    // return Math.round((((value * echelle_max)/max))*100)/100;
  },
  // Orienter l'utilisateur dans son exploration conceptuelle en fonction du nivo de risque qu'il est pret à prendre
  findExplorationWay : function(tree){
    var explorations = {
      branches : [],
      evaluations : []
    };
    var roots = _.where(tree,{id_father : "none"});
    roots.forEach(function(root){
      var leaves = api.getAllLeaves(tree);
      //console.log(leaves)
      _.each(leaves,function(leave){
        var branche = _.union([leave], api.getTreeParentNodes(leave,tree,[]));
        var branche = branche.reverse(); // on renverse le tableau
        // si la feuille n'est pas seul
        if(branche.length > 0){
          explorations.branches.push(branche);
          explorations.evaluations.push(api.getBrancheEvaluation(branche));
        }
      });
    });
    return explorations;
  },
  getBrancheEvaluation : function(branche){
    var eval = 0;
    var stat = api.get_concept_by_statut(branche);
    // on fixe le niveau de risque et le degres d'innov (on fixe un seuille et on pondère par rapport à la proportion d'un statut / au nbre d'element totale)
    if(stat.c_hamecon.length > 0) eval = (2 + api.cross_product(1,branche.length,stat.c_hamecon.length));
    else if(stat.c_alternatif.length > 0) eval = (1 + api.cross_product(1,branche.length,stat.c_alternatif.length));
    else if(stat.c_atteignable.length > 0) eval = (0 + api.cross_product(1,branche.length,stat.c_atteignable.length));
    // eval = (stat.c_connu.length * 0)+(stat.c_atteignable.length * 2)+(stat.c_alternatif.length * 4)+(stat.c_hamecon.length * 10);
    // on ramene à une echelle de 0 à 3
    //eval = api.cross_product(3,branche.length*10,eval)
    return eval;
  },
  //////////////////////////////@
  // api from treeClassification
  getAllLeaves : function(tree){
    var leaves = [];
    _.each(tree,function(node){
      // si le node a au moins un pere et n'est le pere de personne
      if((node.id_father != "none")&&(_.where(tree,{id_father : node.id}).length == 0)) leaves.push(node)
    });
    return leaves;
  },
  getTreeParentNodes : function(currentNode,tree,alreadyDone){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var parents = [];
    var parents_id = [];
    if(alreadyDone) parents_id = alreadyDone;
    if(currentNode.get('id_father')){
      tree.each(function(node){
        if(_.indexOf(parents_id, node.get('id')) == -1){
          //console.log("current node ",currentNode.get('id_father')," - node ",node.get('id'))
          if(currentNode.get('id_father') == node.get('id')){
            parents.unshift(node);
            parents_id.unshift(node.get('id'));
            currentNode = node
            parents = _.union(parents, api.getTreeParentNodes(currentNode,tree,parents_id))
          }  
        }
      });
    }
    
    // return all parent nodes from a branch node
    return parents;
  },
  //////////////////////////////
  get_partitions_expansives : function(concepts){
    return (concepts.c_alternatif.length + concepts.c_hamecon.length);
  },
  get_partitions_restrictives : function(concepts){
    return (concepts.c_connu.length + concepts.c_atteignable.length);
  },
  get_c_colors_number : function(concepts){
    c_connu = 0;
    c_atteignable = 0;
    c_alternatif = 0;
    c_hamecon = 0;
    if(concepts.c_connu.length>0) c_connu = 1;
    if(concepts.c_atteignable.length>0) c_atteignable = 1;
    if(concepts.c_alternatif.length>0) c_alternatif = 1;
    if(concepts.c_hamecon.length>0) c_hamecon = 1;
    var color = c_connu + c_atteignable + c_alternatif + c_hamecon;
    //console.log(concepts, color)
    return color;
  },
  get_knowledge_by_statut : function(elements){
      var k_validees = _.where(elements,{"type" : "knowledge", "css_manu" : "k_validees"});
      var k_encours = _.where(elements,{"type" : "knowledge", "css_manu" : "k_encours"});
      var k_manquante = _.where(elements,{"type" : "knowledge", "css_manu" : "k_manquante"});
      var k_indesidable = _.where(elements,{"type" : "knowledge", "css_manu" : "k_indesidable"});
      var k_empty = _.where(elements,{"type" : "knowledge", "css_manu" : ""});
      _.forEach(elements,function(element){
        if((element.css_manu == undefined)&&(element.type == "knowledge")) k_empty = _.union(k_empty,[element]); 
      })
      return {"k_empty" : k_empty, "k_validees" : k_validees, "k_encours" : k_encours, "k_manquante" : k_manquante, "k_indesidable" : k_indesidable};
  },
  get_concept_by_statut : function(elements){
      var c_connu = _.where(elements,{"type" : "concept", "css_manu" : "c_connu"});
      var c_atteignable = _.where(elements,{"type" : "concept", "css_manu" : "c_atteignable"});
      var c_alternatif = _.where(elements,{"type" : "concept", "css_manu" : "c_alternatif"});
      var c_hamecon = _.where(elements,{"type" : "concept", "css_manu" : "c_hamecon"});
      var c_empty = _.where(elements,{"type" : "concept", "css_manu" : ""});
      _.forEach(elements,function(element){
        if((element.css_manu == undefined)&&(element.type == "concept")) c_empty = _.union(c_empty,[element]);
      })
      return {"c_empty" : c_empty, "c_connu" : c_connu, "c_atteignable" : c_atteignable, "c_alternatif" : c_alternatif, "c_hamecon" : c_hamecon};
  },
  //////////////////////////////
  // API BBMAP
  //////////////////////////////
  getTypeLinkedToModel : function(links,elements,model,type){
    var selection = [];
    // Concepts source
    var f_links = _.where(links,{source : model.id});
    _.forEach(f_links,function(link){
      try{
        var target_id = link.target;
        var target_el = _.findWhere(elements,{id : target_id});
        if(target_el.type == type) selection.unshift(target_el)
      }catch(err){
        //console.log(err)
      }
    });

    return selection;
  },
  getTreeParentNodes : function(currentNode,tree,alreadyDone){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var parents = [];
    var parents_id = [];
    if(alreadyDone) parents_id = alreadyDone;
    if(currentNode.id_father){
      tree.forEach(function(node){
        if(_.indexOf(parents_id, node.id) == -1){
          ////console.log("current node ",currentNode.id_father," - node ",node.id)
          if(currentNode.id_father == node.id){
            parents.unshift(node);
            parents_id.unshift(node.id);
            currentNode = node
            parents = _.union(parents, api.getTreeParentNodes(currentNode,tree,parents_id))
          }  
        }
      });
    }
    
    // return all parent nodes from a branch node
    return parents;
  },
}

module.exports = Object.create(api);