var api = {
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
    console.log("All the data have to move : ",delta)
    return delta;
  },
  getCentroidPointsCloud : function(points){
    console.log(points.length)
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
  }
}