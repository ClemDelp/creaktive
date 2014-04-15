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
        this.project            = json.project;
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
            project          : this.project,
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
        this.project            = json.project;
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
            $("#notification_"+notif.get('id')).hide('slow');
            notif.save();
        });
        this.eventAggregator.trigger('notif_changed');
    },
    open : function(e){
        e.preventDefault();
        onglet = e.target.getAttribute('data-link');
        // notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        // notif.set({read : _.union(notif.get('read'),this.user.get('id'))});
        // notif.save();
        window.location.href = "/"+onglet+"?projectId="+this.project.get('id');
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
        $(this.el).append(this.template({
            notifications : this.notifications.toJSON()
        }));
            
        return this;
    }
});
