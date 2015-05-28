module.exports = {
  //////////////////////////////
  // API BBMAP
  //////////////////////////////
  getTypeLinkedToModel : function(links,elements,model,type){
    var elements = [];
    // Concepts source
    var f_links = _.where(links,{source : model.id});
    _.forEach(f_links,function(link){
      try{
        var target_id = link.target;
        var target_el = Element.findOne(target_id);
        if(target_el.type == type) elements.unshift(target_el)
      }catch(err){
        //console.log(err)
      }
    });

    return elements;
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