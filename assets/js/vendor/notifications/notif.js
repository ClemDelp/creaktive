var notif = {
  init : function(){},
  showByPathname : function(notifications){
    var pathname = window.location.pathname;
    for(key in notifications) {
      if(notifications.hasOwnProperty(key)) {
        var notif = notifications[key];
        // create cookie
        if($.cookie(notif.id) == undefined) $.cookie(notif.id, 'yes');
        // create notification
        console.log($.cookie(notif.id))
        if(($.cookie(notif.id) == 'yes')&&(pathname == notif.pathname)){ 
            var n = new NotificationFx({
              id : notif.id,
              archiveButton : notif.archiveButton,
              // element to which the notification will be appended
              // defaults to the document.body
              wrapper : notif.wrapper,
              // the message
              message : notif.message,
              // layout type: growl|attached|bar|other
              layout : notif.layout,
              // effects for the specified layout:
              // for growl layout: scale|slide|genie|jelly
              // for attached layout: flip|bouncyflip
              // for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
              // ...
              effect : notif.effect,
              // notice, warning, error, success
              // will add class ns-type-warning, ns-type-error or ns-type-success
              type : notif.type,
              // if the user doesn´t close the notification then we remove it 
              // after the following time
              ttl : notif.ttl,
              // callbacks
              onClose : function() { return false; },
              onOpen : function() { return false; }
          });
          // show the notification
          n.show();
          // archived button
          if(notif.archiveButton == true){
            $('#'+notif.id+"_archiveButton").click(function(){
              $.cookie(notif.id, 'no');
              n.dismiss();
            })
          }
        }
      }
    }
  }
}