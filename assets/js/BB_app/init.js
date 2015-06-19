var initialisation_creaktive= function(){
////// Test Navigateur /////////
  if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
    // tablette
    if ( ((screen.width  >= 480) && (screen.height >= 800)) || ((screen.width  >= 800) && (screen.height >= 480)) || navigator.userAgent.match(/ipad/gi) ) {
      getBrowser();

    }
    // telephone
    else {
        var html = "<center><br><br><br><br>CreaKtive editor is not compatible mobile / L'éditeur CreaKtive n'est pas compatible mobile</center>"
        modalInit(html);
    }
  }
  // PC
  else {
     getBrowser();
  }
}
////////////////////////////////////////////////////////////////////////////////
// NEWS
////////////////////////////////////////////////////////////////////////////////

var news_html = [];
news_html[1] = '<center><h3><strong>Nouveautés</strong></h3></center><ul class="panel"><li>- interface éditeur allégée</li><li>- application plus rapide</li><li>- pour éditer une bulle : <b>double click</b> dessus</li><li>- multi-sélection : maintenir la touche <b>SHIFT</b></li><li>- pour supprimer une ou plusieurs bulles : <b>sélectionner</b> + touche <b>DELETE</b></li><li>- possibilitité de dupliquer une ou plusieurs bulles : <b>sélection</b> + <b>CTRL</b> + <b>C</b></li></ul><p>voir la vidéo pour plus d\'informations</p><div class="flex-video widescreen vimeo"><iframe width="1280" height="720" src="https://www.youtube.com/embed/SE3GmYUHSmk" frameborder="0" allowfullscreen></iframe></div>';

var alertNews = function(tabhtml){
  var htmlvalidation = '<hr><input type="checkbox" id="cookieAccepted" value="AC" /> Ne plus afficher ce message<span style="float:right"><button id="alert_accept" class="button tiny radius" onclick="ClickAlertNews('+tabhtml.length+')"> OK</button></span>';

  if( $.cookie('alertnews') === undefined || $.cookie('alertnews') < tabhtml.length){
    var idN = $.cookie('alertnews')
    if(idN == undefined) idN = tabhtml.length -1;
    for ( var i = idN ; i <= tabhtml.length -1; i++){
      $('#browserTestModal').append(tabhtml[i]);

    }
    $('#browserTestModal').append(htmlvalidation);
    $('#browserTestModal').foundation('reveal', 'open');

  }
}

var ClickAlertNews = function(tabhtml){
  var cookieAccepted = document.getElementById('cookieAccepted');
  if(cookieAccepted.checked == true){
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 30*(24*60*60*1000); // nombre de jour 30
    now.setTime(expireTime);
    document.cookie= ' alertnews ='+tabhtml+';expires='+now.toGMTString()+';path=/';
  } 
  $('#browserTestModal').foundation('reveal', 'close');
}
///////////////////////////////////////////////////////////////
//////////////  Detection language Navigateur    //////////////
///////////////////////////////////////////////////////////////
var DetectLanguage = function(){
  if ($.layout.name=='gecko' || $.browser.name=='msie'){
    if(navigator.userLanguage == "fr - FR"){
      return "fr"
    }else{
      return "en"
    }
  }else{
if(navigator.language == "fr"){
      return "fr"
    }else{
      return "en"
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
// Browser
////////////////////////////////////////////////////////////////////////////////
var modalInit = function(html){
    $('#browserTestModal').append(html);
    $('#browserTestModal').foundation('reveal', 'open');
}

var getBrowser = function(){
  // Si le navigator est à chier
  if ($.layout.name=='gecko' && $.layout.version<=9.0 || $.browser.name=='msie' && $.layout.version<=9.0){
    var html = '<div id="creanav"> <center><h2>Votre navigateur est obsolète</h2> <h4>Veuillez le mettre à jour pour accéder à notre site, ou téléchargez l un de ces navigateurs.</h4> </br> <a target="_blank" href=https://www.google.fr/chrome/browser/desktop/><img src=/img/chromee.png height="100" width="100"></img></a> <a target="_blank" href=https://www.mozilla.org/fr/firefox/new/><img src=/img/firefoxx.png height="100" width="100"></img></a> <a target="_blank" href=http://www.opera.com/fr><img src=/img/operaa.png height="100" width="100"></img></a> <h3>Your browser is deprecated.</h3> <h5>Please update it to access our website or download one of those browsers.</h5> </center> </div>';
    modalInit(html);
  }else{

    alertNews(news_html);
  }
}

// var initialisation_creaktive = function(){
//     ////////////////////////////////////////////////////////////////////////////////
//     // NEWS
//     ////////////////////////////////////////////////////////////////////////////////
    
//     var news_html = [];
//     news_html[2] = '<center><h3 dir="ltr"><strong>Nouveautés</strong></h3></center><ul class="panel"><li>- interface éditeur allégée</li><li>- application plus rapide</li><li>- pour éditer une bulle : <b>double click</b> dessus</li><li>- multi-sélection : maintenir la touche <b>SHIFT</b></li><li>- pour supprimer une ou plusieurs bulles : <b>sélectionner</b> + touche <b>DELETE</b></li><li>- possibilitité de dupliquer une ou plusieurs bulles : <b>sélection</b> + <b>CTRL</b> + <b>C</b></li></ul><p>voir la vidéo pour plus d\'informations</p><div class="flex-video widescreen vimeo"><iframe width="1280" height="720" src="https://www.youtube.com/embed/SE3GmYUHSmk" frameborder="0" allowfullscreen></iframe></div>';
//     news_html[1] = "";

//     if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
//       // tablette
//       if ( ((screen.width  >= 480) && (screen.height >= 800)) || ((screen.width  >= 800) && (screen.height >= 480)) || navigator.userAgent.match(/ipad/gi) ) {
//         getBrowser();
//       } 
//       // telephone
//       else {
//           var html = "<center><br><br><br><br>CreaKtive editor is not compatible mobile / L'éditeur CreaKtive n'est pas compatible mobile</center>"
//           modalInit(html);
//       }
//     }
//     // PC
//     else {
//        getBrowser();
//     }
// }

// var alertNews = function(tabhtml){
//       var htmlvalidation = '<hr><input type="checkbox" id="cookieAccepted" value="AC" /> Ne plus afficher ce message<span style="float:right"><button id="alert_accept" class="button tiny radius" onclick="ClickAlertNews('+tabhtml.length+')"> OK</button></span>';

//       if( $.cookie('alertnews') === undefined || $.cookie('alertnews') < tabhtml.length){
//         var idN = $.cookie('alertnews')
//         if(idN == undefined) idN = tabhtml.length -1;
//         for ( var i = idN ; i <= tabhtml.length -1; i++){
//           $('#browserTestModal').append(tabhtml[i]);
          
//         }
//         $('#browserTestModal').append(htmlvalidation);
//         $('#browserTestModal').foundation('reveal', 'open');
        
//       }
//     }
//     var ClickAlertNews = function(tabhtml){
//       var cookieAccepted = document.getElementById('cookieAccepted');
//       if(cookieAccepted.checked == true){
//         var now = new Date();
//         var time = now.getTime();
//         var expireTime = time + 30*(24*60*60*1000); // nombre de jour 30
//         now.setTime(expireTime);
//         document.cookie= ' alertnews ='+tabhtml+';expires='+now.toGMTString()+';path=/';
//       } 
//       $('#browserTestModal').foundation('reveal', 'close');
//     }
//     ////////////////////////////////////////////////////////////////////////////////
//     // Browser
//     ////////////////////////////////////////////////////////////////////////////////
//     var modalInit = function(html){
//         $('#browserTestModal').append(html);
//         $('#browserTestModal').foundation('reveal', 'open');
//     }

//     var getBrowser = function(){
//       // Si le navigator est à chier
//       if ($.layout.name=='gecko' && $.layout.version<=9.0 || $.browser.name=='msie' && $.layout.version<=9.0){
//         var html = '<div id="creanav"> <center><h2>Votre navigateur est obsolète</h2> <h4>Veuillez le mettre à jour pour accéder à notre site, ou téléchargez l un de ces navigateurs.</h4> </br> <a target="_blank" href=https://www.google.fr/chrome/browser/desktop/><img src=/img/chromee.png height="100" width="100"></img></a> <a target="_blank" href=https://www.mozilla.org/fr/firefox/new/><img src=/img/firefoxx.png height="100" width="100"></img></a> <a target="_blank" href=http://www.opera.com/fr><img src=/img/operaa.png height="100" width="100"></img></a> <h3>Your browser is deprecated.</h3> <h5>Please update it to access our website or download one of those browsers.</h5> </center> </div>';
//         modalInit(html);
//       }else{
//         alertNews(news_html);
//       }
//     }