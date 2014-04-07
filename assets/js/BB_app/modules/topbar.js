/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.Notification = Backbone.View.extend({
    el:"#NotificationModal",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.project            = json.project;
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.experts            = json.experts;
        this.poches             = json.poches;
        this.links              = json.links;
        this.user               = json.user;
        this.users              = json.users;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Template
        this.template = _.template($('#notification-log-template').html());
        // Events
        this.notifications.bind("add",this.render);
        this.notifications.bind("remove",this.render);
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
            console.log(notif.get('read'))
        
            notif.set({read : _.union(notif.get('read'),_this.user.get('id'))});
        console.log(notif.get('read'))
            notif.save();
            $(_this.el).find("#notification_"+notif.get('id')).hide('slow');
        });
    },
    open : function(e){
        e.preventDefault();
        notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
    },
    validation : function(e){
        e.preventDefault();
        notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        console.log(notif.get('read'))
        notif.set({read : _.union(notif.get('read'),this.user.get('id'))});
        console.log(notif.get('read'))
        notif.save();
        $(this.el).find("#notification_"+notif.get('id')).hide('slow');
    },
    newNotification : function(json){
        newNotif = new global.Models.NotificationModel({
            id: guid(),
            type: json.type,
            content : json.content,//description de la notification: "mise à jour sur le post"
            to : json.id_model,//cible: projet, post, document, ...
            from : json.user,//Qui est à l'origine: utilisateur, mise à jour, ...
            date : getDate(),
            project_id : this.project.get('id'),
            read : [this.user.get('id')]
        });
        newNotif.save();
        this.notifications.add(newNotif);
    },
    render : function(){
        $(this.el).html('');
        
        // Modals
        $(this.el).append(this.template({notifications : this.notifications.toJSON()}));
            
        $(document).foundation();
        return this;
    }
});
/***************************************/
topbar.Views.Main = Backbone.View.extend({
    el:"#topbar_container",
    initialize : function(json) {
        _.bindAll(this, 'render','buildNotificationLog');
        // Variables
        this.project            = json.project;
        this.projects           = json.projects;
        this.concepts           = json.concepts;
        this.knowledges         = json.knowledges;
        this.experts            = json.experts;
        this.poches             = json.poches;
        this.links              = json.links;
        this.user               = json.user;
        this.users              = json.users;
        this.notifications      = json.notifications;
        this.notif_to_render    = new Backbone.Collection();
        this.eventAggregator    = json.eventAggregator;
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
        // Events
        this.notifications.bind("reset", this.buildNotificationLog);
    },
    buildNotificationLog : function(){
        _this = this;
        // On filtre les notifs
        this.notifications.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){_this.notif_to_render.add(notif);}
        });
        // Notification
        topbar_view = new topbar.Views.Notification({
            project          : this.project,
            projects         : this.projects,
            concepts         : this.concepts,
            knowledges       : this.knowledges,
            experts          : this.experts,
            poches           : this.poches,
            links            : this.links,
            user             : this.user,
            users            : this.users,
            notifications    : this.notif_to_render,
            eventAggregator  : this.eventAggregator
        });
        topbar_view.render();
        this.render();
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({notifications_length : this.notif_to_render.length}));

        return this;
    }
});
/***************************************/

