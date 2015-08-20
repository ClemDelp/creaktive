var creaktiveInit = {
   // Classes
  Collections: {},
  Models: {},
  Views: {}, // model de view
  // Instances
  collections: {},
  models: {},
  views: {},
  //
  eventAggregator : global.eventAggregator,
  init : function(json){
    var now = new Date();
    var time = now.getTime();
    now.setTime(time);

      creaktiveInit.views.main = new creaktiveInit.Views.Main({
        el    : "#"+json.news.el,
        user  : global.models.current_user,
        workspaces : global.collections.Projects,
        notifications : global.collections.News,
        alfred : json.alfred,
        news : json.news,
        derniere_connexion : api.formatDateFr(now),
        
        
      });
      creaktiveInit.views.main.render()
  }
};
creaktiveInit.Views.Main = Backbone.View.extend({
    initialize: function(json){
      _.bindAll(this, 'render');
      // variables
    var now = new Date();
    var time = now.getTime();
    now.setTime(time);
      this.alfred              = json.alfred; // Contient Tous les message d'alfred
      this.user                = json.user;   // Utilisateur
      this.workspaces          = global.collections.Projects  // Project
      this.news                = json.news.news;  // Contient toutes les news [ news : { contenu:  , title :  , date: }]
      this.json                = json; // Architectuer du json [ alfred: {} news: { el: , news: } ]
      this.notifications       = json.notifications; // Contient les messages des notification { vous avez X notification(s)}
      this.derniere_connexion  = api.formatDateFr(now); // Format ex : 9 Juillet 2015
      this.contenuAlfred       = this.contenuAlfred(); // Créer le contenu du Template de Alfred
      this.contenuNews         = this.contenuNews(json.news.news); // Créer le contune du Template de News
      
      // Template
      this.template_neplusafficher = _.template($('#neplusafficher-template').html());
      this.template_alfred         = _.template($('#alfred-template').html());
      this.template_projectList    = _.template($('#projectList-template').html());
      this.template_news           = _.template($('#news-template').html());

    },
    
    events: {
      "click #alert_accept": "NePlusAfficher"  
    },

    NePlusAfficher: function( event ){
  
      if(cookieAccepted.checked == true){
         global.models.current_user.save({'derniere_news' : this.news.length})
      } 
      $('#'+this.json.news.el).foundation('reveal', 'close');
          
    }, contenuNews : function(json){
        var lastNews = json.length-1
        var divContent = $('<div>',{id: "Contain-accordion"});
        for ( var i = json.length -1 ; i >= 0; i--){

          var li = $('<li>',{id :"accordionN"+i, class:"accordion-navigation"});
          var a = $('<a>',{id: "balise"+i, href: "#panel"+i+"a"});
          var div = $('<div>',{id: "panel"+i+"a", class:"content"});
         

           $(a).append(json[i].date.fr); 
           $(a).append(json[i].title.fr); 
           $(li).append(a); 
           $(div).append(json[i].contenu.fr); 
           $(li).append(div); 
           $(divContent).append(li);
          
         }
       return divContent;
    },
      contenuAlfred : function(){
        
contenu = "";

if( this.workspaces.where({status : "private"}).length != 0){
    if( this.user.get('derniere_connexion') == undefined){
      global.models.current_user.save({'derniere_connexion' : this.derniere_connexion})
    }
contenu =[this.alfred.other_connexion.fr,this.user.get('derniere_connexion'),this.alfred.notification.fr.vous_avez,this.notifications.length]
    if(this.notifications.length > 1 ) {
    contenu.push(this.alfred.notification.fr.notifications)
     }else {
     contenu.push(this.alfred.notification.fr.notification)
      }
}else{
  contenu=[this.alfred.bonjour.fr,this.user.get('name'),this.alfred.first_connexion.fr]
  }
  return contenu
    },
      render: function(){
        var _this = this;
      $(this.el).empty();
        
      $(this.el).append(this.template_neplusafficher({

      }));
      $(this.el).append(this.template_alfred({
        contenu            : this.contenuAlfred

      }));
      
      if ( this.notifications.length > 0){
        this.workspaces.each(function(projectNotif){
          notifNews = _this.notifications.where({project: projectNotif.id})

          if(notifNews.length > 0){
            $(_this.el).append(_this.template_projectList({
          project : projectNotif.toJSON(),
          pulse : "pulse",
          news_nbr : notifNews.length
        }));  
          }
        })  
      }
      $(this.el).append(this.template_news({
        contenuNews : this.contenuNews

      }));
       
      
      if (global.models.current_user.get("derniere_news") < this.news.length || global.models.current_user.get("derniere_news")  == undefined){
       
        $('#browserTestModal').foundation('reveal','open');
      }
      global.models.current_user.save({'derniere_connexion' : this.derniere_connexion})

    },
  });