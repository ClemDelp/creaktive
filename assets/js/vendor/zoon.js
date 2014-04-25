$(document).ready(function () {

      $("#select").click(function(){
      if(!zoomflag){
          $(this).addClass('disabled');
          zoomflag=true;
         }
         else{
          $(this).removeClass('disabled');
          zoomflag=false;
        }
    });
    var startX = 0, startY = 0;
    var flag = false;
    var rectLeft = "0px", rectTop = "0px", rectHeight = "0px", rectWidth = "0px";
    var rect = document.getElementById("rect");
    rect.style.visibility = 'hidden';
    rect.style.width = 0;
    rect.style.height = 0;
    rect.style.zIndex = 1000;

    document.onmousedown = function(e){
      flag = true;
      try{
        var evt = window.event || e;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        startX = evt.clientX + scrollLeft;
        startY = evt.clientY + scrollTop;

        rect.style.left = startX + "px";
        rect.style.top = startY + "px";
        rect.style.width = 0;
        rect.style.height = 0;
        rect.style.visibility = 'visible';
      }catch(e){
    //alert(e);
  }
}

document.onmouseup = function(){
  try{
    rect.style.visibility = 'hidden';
    zoom.to({
      x: parseInt(rect.style.left),
      y: parseInt(rect.style.top),
      width: parseInt(rect.style.width),
      height: parseInt(rect.style.height)
    });
  }catch(e){
      //alert(e);
    }
    flag = false;
  }

  document.onmousemove = function(e){
    if(zoomflag&&flag){
      try{
        var evt = window.event || e;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        rectLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX) + "px";
        rectTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY) + "px";
        rectHeight = Math.abs(startY - evt.clientY - scrollTop) + "px";
        rectWidth = Math.abs(startX - evt.clientX - scrollLeft) + "px";
        rect.style.left = rectLeft;
        rect.style.top = rectTop;
        rect.style.width = rectWidth;
        rect.style.height = rectHeight;
      }catch(e){
        //alert(e);
      } 
    }
  }
}) ;