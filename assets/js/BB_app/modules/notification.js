/////////////////////////////////////////
// Notifications
/////////////////////////////////////////
var notification = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
notification.Views.Modal = Backbone.View.extend({
    el:"#NotificationModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openNotificationModal');
        // Variables
        //this.project            = json.project;
        // this.projects           = json.projects;
        // this.concepts           = json.concepts;
        // this.knowledges         = json.knowledges;
        // this.experts            = json.experts;
        // this.poches             = json.poches;
        // this.links              = json.links;
        this.user               = json.user;
        //this.users              = json.users;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.eventAggregator.on("openNotificationModal", this.openNotificationModal);
        this.eventAggregator.on("closeNotificationModal", this.closeNotificationModal);
    },
    closeNotificationModal : function(){
        $('#NotificationModal').foundation('reveal', 'close');  
    },
    openNotificationModal : function(){
        this.render(function(){
            $('#NotificationModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(new notification.Views.Main({
            className        : "panel row",
            //project          : this.project,
            user             : this.user,
            notifications    : this.notifications,
            eventAggregator  : this.eventAggregator
        }).render().el);
        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/
notification.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','globalValidation');
        // Variables
        this.user               = json.user;
        //this.project            = json.project;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Template
        this.template = _.template($('#notification-log-template').html());
    },
    events : {
        "click .globalValidation" : "globalValidation",
        "click .validation" : "validation",
        "click .open" : "open"
    },
    globalValidation : function(e){
        e.preventDefault();
        _this = this;
        this.notifications.each(function(notif){
            notif.set({read : _.union(notif.get('read'),_this.user.get('id'))});
            notif.save();
        });
        $('#NotificationModal').foundation('reveal', 'close'); 
        this.eventAggregator.trigger('notif_changed');
    },
    open : function(e){
        e.preventDefault();
        var notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        console.log(notif)
        var project_id = notif.get('project_id');
        console.log(project_id)
        var link = "#";
        if(notif.get('object') == "Knowledge"){ 
            link="knowledges"; 
        }else if(notif.get('object') == "Concept"){ 
            link="conceptsMap"; 
        }else if(notif.get('object') == "Category"){ 
            link="categories"; 
        }
        console.log(link)
        // notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        // notif.set({read : _.union(notif.get('read'),this.user.get('id'))});
        // notif.save();
        window.location.href = "/"+link+"?projectId="+project_id;
    },
    validation : function(e){
        e.preventDefault();
        notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        notif.set({read : _.union(notif.get('read'),this.user.get('id'))});
        notif.save();
        $(this.el).find("#notification_"+notif.get('id')).hide('slow');
        this.eventAggregator.trigger('notif_changed');
    },
    render : function(){
        $(this.el).html('');
        _this = this;_this
        notif_to_render = new Backbone.Collection();
        this.notifications.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){notif_to_render.add(notif);}
        });
        $(this.el).append(this.template({
            notifications : notif_to_render.toJSON()
        }));
            
        return this;
    }
});
