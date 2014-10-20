var api = {
  //////////////////////////////
  // API UTILITIES
  //////////////////////////////
  getJsonSize : function(json){
    var key, count = 0;
    for(key in json) {
      if(json.hasOwnProperty(key)) {
        count++;
      }
    }
    return count;
  },
  //////////////////////////////
  // API Graphique
  //////////////////////////////
  getMapCentroid : function(map_width,map_height){
    var mapCentroid = {};
    mapCentroid.left = map_width/2;
    mapCentroid.top = map_height/2;
    // console.log("Map centroid : ",mapCentroid);
    return mapCentroid;
  },
  getXYTranslationBtwTwoPoints : function(point_1,point_2){
    // console.log("CentroidPointsCloud",point_1,' - getMapCentroid',point_2)
    // point have to be : {'left':12,'top':56}
    var delta_left = point_2.left - point_1.left;
    var delta_top = point_2.top - point_1.top;
    var delta = {"y":delta_top,"x":delta_left};
    // console.log("All the data have to move : ",delta)
    return delta;
  },
  getCentroidPointsCloud : function(points){
    // console.log(points.length)
    // points have to be : [{'top':12,'left':45},{'top':2,'left':845},...]
    // console.log(points)
    var topMax = 0;
    var topMin = 1000000000;
    var leftMax = 0;
    var leftMin = 1000000000;
    var centroid = {};
    _.each(points,function(point){
      if(point.top > topMax) topMax = point.top;
      if(point.top < topMin) topMin = point.top;
      if(point.left > leftMax) leftMax = point.left;
      if(point.left < leftMin) leftMin = point.left;
    });
    centroid.top = ((topMax-topMin)/2)+topMin;
    centroid.left = ((leftMax-leftMin)/2)+leftMin;
    centroid.width = leftMax - leftMin;
    centroid.height = topMax - topMin;
    return centroid;
  },
  getScreenCentroid : function(){
      var screenCentroid = {};
      var windowWidth = $('body').width();
      var windowHeight = $('body').height();
      // Screen centroid calcul
      screenCentroid.top = windowHeight/2;
      screenCentroid.left = windowWidth/2;
      screenCentroid.width = windowWidth;
      screenCentroid.height = windowHeight;
      // console.log("Screen centroid : ",screenCentroid);
      return screenCentroid;
  },
  //////////////////////////////
  // API BBMAP
  //////////////////////////////
  getKnowledgesLinkedToConcept : function(links,knowledges,concept){
    // links have to be a collection a link model
    // knowledges have to be a collection a knowledge model
    // concept have to be a model
    var knowledgesLinked = [];
    var ckLinks = api.getCKLinksByModelId(links,concept.get('id'));
    ckLinks.forEach(function(link){
      knowledgesLinked = _.union(knowledgesLinked, knowledges.get(link.get('source')))
      knowledgesLinked = _.union(knowledgesLinked, knowledges.get(link.get('target')))
    });
    return knowledgesLinked;
  },
  getConceptsLinkedToKnowledge : function(links,concepts,knowledge){
    // links have to be a collection a link model
    // concepts have to be a collection a concept model
    // knowledge have to be a model
    var conceptsLinked = [];
    var ckLinks = api.getCKLinksByModelId(links,knowledge.get('id'));
    ckLinks.forEach(function(link){
      conceptsLinked = _.union(conceptsLinked, knowledges.get(link.get('source')))
      conceptsLinked = _.union(conceptsLinked, knowledges.get(link.get('target')))
    });
    return conceptsLinked;
  },
  getCKLinksByModelId : function(links,id){
    // links have to be a collection a link model
    var ckLinks = [];
    ckLinks = _.union(ckLinks, links.where({source : id}));
    ckLinks = _.union(ckLinks, links.where({target : id}));
    return ckLinks;
  },
  //////////////////////////////
  // API Tree manipulation
  //////////////////////////////
  getTreeParentNodes : function(currentNode,tree){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var parents = [];
    
    if(currentNode.get('id_father')){
      tree.each(function(node){
        //console.log("current node ",currentNode.get('id_father')," - node ",node.get('id'))
        if(currentNode.get('id_father') == node.get('id')){
          parents.unshift(node);
          currentNode = node
          parents = _.union(parents, api.getTreeParentNodes(currentNode,tree))
        }
      });
    }
    
    // return all parent nodes from a branch node
    return parents;
  },
  getTreeChildrenNodes : function(currentNode,tree){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var childrens = [];
    var nodes = [];
    if(currentNode.get('id_father')){
      nodes = tree.where({id_father : currentNode.get('id')});
      childrens = _.union(childrens, nodes)
      nodes.forEach(function(node){
        childrens = _.union(childrens, api.getTreeChildrenNodes(node,tree))
      });
    }
    // return all children nodes from a parent node
    return childrens;
  },
}