var api = {
  
  //////////////////////////////
  // WIKIPEDIA
  //////////////////////////////
  // One query, example code:
  getWikiDef :function(item){
    var lg = "fr";
    var option1 = "extracts&exintro&explaintext&format=json&redirects&callback=?";
    var option2 = "extracts&exintro&format=json&redirects&callback=?";
    url = "http://"+lg+".wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop="+option2;
    $.getJSON(url, function (json) {
        var item_id = Object.keys(json.query.pages)[0]; // THIS DO THE TRICK !
        sent = json.query.pages[item_id].extract;
        console.log(sent);
    });
  },
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
  isValidEmailAddress : function(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
  },
  s4 : function() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);},
  guid : function() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();},
  getDate : function(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();},
  //////////////////////////////
  // API Google search
  //////////////////////////////
  googleSearch : function(settings,el){
    // el have to be element view container
    // setting have to be like:
    // this.settings = {
    //   term        : 'title', // the term what you want to looking for
    //   siteURL     : 'creaktive.fr',   // Change this to your site
    //   searchSite  : false, // filter search on the site or not
    //   type        : 'images', // images / news / video / web
    //   append      : false, // append new element to el
    //   perPage     : 8,            // A maximum of 8 is allowed by Google
    //   page        : 0             // The start page
    //   protocol    : 'https', // http or https 
    //   more        : true, // display or not the more button
    //   width       : this.width, // display or not the more button
    // }

    if(settings.searchSite){
        // Using the Google site:example.com to limit the search to a
        // specific domain:
        settings.term = 'site:'+settings.siteURL+' '+settings.term;
    }
    // URL of Google's AJAX search API
    var apiURL = settings.protocol+'://ajax.googleapis.com/ajax/services/search/'+settings.type+'?v=1.0&callback=?';
    var resultsDiv = el;
    var uid = api.guid();
    $.getJSON(apiURL,{q:settings.term,rsz:settings.perPage,start:settings.page*settings.perPage},function(r){
        
        try{
          var results = r.responseData.results;
          $('#more_'+uid).remove();
          if(results.length){
            // If results were returned, add them to a pageContainer div,
            // after which append them to the #resultsDiv:
            
            var pageContainer = $('<div>',{className:'pageContainer'});
            
            for(var i=0;i<results.length;i++){
                // Creating a new result object and firing its toString method:
                pageContainer.append(api.googleSearchResult(results[i],settings.width));
            }
            if(!settings.append){
                // This is executed when running a new search, 
                // instead of clicking on the More button:
                resultsDiv.empty();
            }
            pageContainer.append('<div class="clear"></div>')
                         .hide().appendTo(resultsDiv)
                         .fadeIn('slow');
            var cursor = r.responseData.cursor;
            // Checking if there are more pages with results, 
            // and deciding whether to show the More button:
            if((settings.more)&&(+cursor.estimatedResultCount > (settings.page+1)*settings.perPage)){
                $('<br><div id="more_'+uid+'" class="button radius tiny secondary">more</did>').appendTo(resultsDiv).click(function(){
                    settings.append = true;
                    settings.page = settings.page+1;
                    api.googleSearch(settings,el);
                    $(this).fadeOut();
                });
            }
          }
          else {
              
              // No results were found for this search.
              // return $('<p>',{className:'notFound',html:'No Results Were Found!'});
              resultsDiv.empty();
              $('<p>',{className:'notFound',html:'No Results Were Found!'}).hide().appendTo(resultsDiv).fadeIn();
          }
        }catch(err){
          console.log("google search send no result...")
        }
        
    });
  },
  googleSearchResult : function(r,width){
    // r have to be an array of google search result
    // width have to be a value to manage the size of images
    // This is class definition. Object of this class are created for
    // each result. The markup is generated by the .toString() method.
    
    var arr = [];
    
    // GsearchResultClass is passed by the google API
    switch(r.GsearchResultClass){

        case 'GwebSearch':
            arr = [
                '<span class="webResult">',
                '<h2><a href="',r.unescapedUrl,'" target="_blank">',r.title,'</a></h2>',
                '<p>',r.content,'</p>',
                '<a href="',r.unescapedUrl,'" target="_blank">',r.visibleUrl,'</a>',
                '</span>'
            ];
        break;
        case 'GimageSearch':
            arr = [
                '<span class="imageResult">',
                '<a target="_blank" href="',r.unescapedUrl,'" title="',r.titleNoFormatting,'" class="pic" style="width:',r.tbWidth,'px;height:',r.tbHeight,'px;">',
                '<img src="',r.tbUrl,'" width="',width,'" height="',r.tbHeight,'" /></a>',
                // '<div class="clear"></div>','<a href="',r.originalContextUrl,'" target="_blank">',r.visibleUrl,'</a>',
                '</span>'
            ];
        break;
        case 'GvideoSearch':
            arr = [
                '<span class="imageResult">',
                '<a target="_blank" href="',r.url,'" title="',r.titleNoFormatting,'" class="pic" style="width:150px;height:auto;">',
                '<img src="',r.tbUrl,'" width="100%" /></a>',
                '<div class="clear"></div>','<a href="',r.originalContextUrl,'" target="_blank">',r.publisher,'</a>',
                '</span>'
            ];
        break;
        case 'GnewsSearch':
            arr = [
                '<span class="webResult">',
                '<h2><a href="',r.unescapedUrl,'" target="_blank">',r.title,'</a></h2>',
                '<p>',r.content,'</p>',
                '<a href="',r.unescapedUrl,'" target="_blank">',r.publisher,'</a>',
                '</span>'
            ];
        break;
    }
    
    // // The toString method.
    // this.toString = function(){
        return arr.join('');
    // }
    },
  //////////////////////////////
  // API Graphique
  //////////////////////////////
  getElementCentroid : function(map_width,map_height){
    var elementCentroid = {};
    elementCentroid.left = map_width/2;
    elementCentroid.top = map_height/2;
    // console.log("Map centroid : ",elementCentroid);
    return elementCentroid;
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
  getNewPositionAfterTranslation : function(position,delta){
    // position have to be {'left': 10, 'top': 10}
    // delta have to be {'x': 20, 'y': 20}
    var newPosition = {};
    newPosition.left = position.left + delta.x;
    newPosition.top = position.top + delta.y;
    return newPosition;
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
  getType2LinkedToType1 : function(links,collection,type1,type2){
    var elements = [];
    // Concepts source
    links.each(function(link){
      try{
        var source_id = link.get('source');  
        var target_id = link.get('target');
        var source_el = collection.get(source_id);
        var target_el = collection.get(target_id);
        if((source_el.get('type') == type1)&&(target_el.get('type') == type2)) elements.push(target_el)
      }catch(err){
        console.log(err)
        link.destroy();
      }
    });

    return elements;
  },
  getModelsLinkedToModel : function(links,collection,model){
    // links have to be a collection a link model
    // Collection have to be a backbone collection
    // Model have to be a backbone model
    var modelsLinked = [];
    var ckLinks = api.getCKLinksByModelId(links,model.get('id'));
    ckLinks.forEach(function(link){
      //modelsLinked = _.union(modelsLinked, collection.get(link.get('source')))
      modelsLinked = _.union(modelsLinked, collection.get(link.get('target')))
    });
    return _.compact(modelsLinked);
  },
  getCKLinksByModelId : function(links,id){
    // links have to be a collection a link model
    var ckLinks = [];
    ckLinks = _.union(ckLinks, links.where({source : id}));
    //ckLinks = _.union(ckLinks, links.where({target : id}));
    return _.compact(ckLinks);
  },
  isTarget : function(links,id){
    // links have to be a collection a link model
    var is = false;
    var ckLinks = links.where({target : id});
    if(ckLinks.length > 0) is = true;
    return is;
  },
  isSource : function(links,id){
    // links have to be a collection a link model
    var is = false;
    var ckLinks = links.where({source : id});
    if(ckLinks.length > 0) is = true;
    return is;
  },
  getTheRightIDFather : function(links,elements,model){
    // links have to be a collection a link model
    var id_father = "none";
    var ckLinks = links.where({target : model.get('id')});
    ckLinks.forEach(function(link){
      var source = elements.get(link.get('source'));
      var target = model;
      if((source.get('type') == target.get('type'))||((source.get('type') == "poche")&&(target.get('type') == "knowledge"))) id_father = source.get('id');
    });
    return id_father;
  },
  //////////////////////////////
  // API Tree manipulation
  //////////////////////////////
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
  getTreeChildrenNodes : function(currentNode,tree,alreadyDone){
    // tree have to be a collection of node/model with each an id_father attribute reference to a node father
    // node have to be a model with an id_father attribute reference to a node father
    var childrens = [];
    var nodes = [];
    var childs_id = [];
    if(alreadyDone) childs_id = alreadyDone;
    
    if(currentNode.get('id_father')){
      nodes = tree.where({id_father : currentNode.get('id')});
      childrens = _.union(childrens, nodes)
      nodes.forEach(function(node){
        if(_.indexOf(childs_id, node.get('id')) == -1){
          childs_id.unshift(node.get('id'));
          childrens = _.union(childrens, api.getTreeChildrenNodes(node,tree,childs_id))
        }
      });

    }
    // return all children nodes from a parent node
    return childrens;
  },
  getUserPermissionByProject : function(permissions,users,id){
    // users, permissions have to be collections
    // project_id have to be the project id
    var result = []; // 
    var perms = permissions.where({project_id : id});
    perms.forEach(function(perm){
      try{
        var json = {
          "user" : users.get(perm.get('user_id')).toJSON(),
          "permission" : perm.toJSON()
        }
      }catch(err){console.log(err)}
      result.unshift(json);
    });

    return _.compact(result);
  },
  //////////////////////////////
  // Stats
  statistics : function(elements,links){
    var stats = {
      "c_empty" : {
        title: "C",
        desc : "empty concept",
        stat : 0
      },
      "c_full" : {
        title: "C",
        desc: "concept with description",
        stat : 0
      },
      "k_empty" : {
        title: "K",
        desc : "empty knowledge",
        stat : 0
      },
      "k_full" : {
        title: "K",
        desc: "knowledge with description",
        stat : 0
      },
      "p_empty" : {
        title: "P",
        desc : "no linked knowledges",
        stat : 0
      },
      "p_full" : {
        title: "P",
        desc: "with linked knowledges",
        stat : 0
      },
      "other" : {
        title: "?",
        desc: "way to explore",
        stat : 0
      },
      "cc_link" : {
        title: "C-C",
        desc: "operator C to C",
        stat : 0
      },
      "co_link" : {
        title: "C-*",
        desc: "operator C to *",
        stat : 0
      },
      "kk_link" : {
        title: "K-K",
        desc: "operator K to K",
        stat : 0
      },
      "ko_link" : {
        title: "K-*",
        desc: "operator K to *",
        stat : 0
      },
      "pp_link" : {
        title: "P-P",
        desc: "operator P to P",
        stat : 0
      },
      "po_link" : {
        title: "P-*",
        desc: "operator P to *",
        stat : 0
      },
      "c_nbre" : {
        title: "dC",
        desc: "concept number",
        stat : 0
      },
      "c_perc" : {
        title: "%C",
        desc: "percentage of concept",
        stat : 0
      },
      
      "k_nbre" : {
        title: "dK",
        desc: "knowledge number",
        stat : 0
      },
      
      "k_perc" : {
        title: "%K",
        desc: "percentage of knowledge",
        stat : 0
      }
    };
    var all_elements = elements.length;
    var all_c = elements.where({type : "concept"}).length;
    var all_k = elements.where({type : "knowledge"}).length;
    var all_p = elements.where({type : "poche"}).length;
    var empty_c = elements.where({type : "concept", content : ""}).length;
    var empty_k = elements.where({type : "knowledge", content : ""}).length;
    var empty_p = elements.where({type : "poche", content : ""}).length;
    var c = all_c - empty_c;
    var k = all_k - empty_k;
    var p = all_p - empty_p;
    var all_ck = all_c + all_k;
    var all_links = links.length;
    var c_ = api.getType2LinkedToType1(links,elements,"concept","poche").length + api.getType2LinkedToType1(links,elements,"concept","knowledge").length;
    var cc = api.getType2LinkedToType1(links,elements,"concept","concept").length;
    var k_ = api.getType2LinkedToType1(links,elements,"knowledge","poche").length + api.getType2LinkedToType1(links,elements,"knowledge","concept").length;
    var kk = api.getType2LinkedToType1(links,elements,"knowledge","knowledge").length;;
    var p_ = api.getType2LinkedToType1(links,elements,"poche","concept").length + api.getType2LinkedToType1(links,elements,"poche","knowledge").length;
    var pp = api.getType2LinkedToType1(links,elements,"poche","poche").length;;
    /////////////
    // Set JSON
    stats.c_empty.stat = Math.floor(empty_c*100/all_elements);
    stats.c_full.stat = Math.floor(c*100/all_elements);
    stats.k_empty.stat = Math.floor(empty_k*100/all_elements);
    stats.k_full.stat = Math.floor(k*100/all_elements);
    stats.p_empty.stat = Math.floor(empty_p*100/all_elements);
    stats.p_full.stat = Math.floor(p*100/all_elements);
    stats.co_link.stat = Math.floor(c_*100/all_links);
    stats.cc_link.stat = Math.floor(cc*100/all_links);
    stats.ko_link.stat = Math.floor(k_*100/all_links);
    stats.kk_link.stat = Math.floor(kk*100/all_links);
    stats.po_link.stat = Math.floor(p_*100/all_links);
    stats.pp_link.stat = Math.floor(pp*100/all_links);
    stats.c_nbre.stat = all_c;
    stats.c_perc.stat = Math.floor(all_c*100/all_ck);
    stats.k_nbre.stat = all_k;
    stats.k_perc.stat = Math.floor(all_k*100/all_ck);

    return stats;
  },
}