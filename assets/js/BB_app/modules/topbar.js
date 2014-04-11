/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.TopBar = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render','notifChanged');
        // Variables
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
        // Events
        this.eventAggregator.on('notif_changed',this.notifChanged);
    },
    events : {
        "click .openModal" : "openModal"
    },
    notifChanged : function(){
        this.render();
    },
    openModal : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openNotificationModal');
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({notifications_length : this.notifications.length}));

        return this;
    }
});
/***************************************/
topbar.Views.Main = Backbone.View.extend({
    el:"#topbar_container",
    initialize : function(json) {
        _.bindAll(this, 'render','renderTopBar');
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
        
        // Events
        
        this.notifications.bind("reset", this.render);
        this.notif_to_render.on('change',this.renderTopBar);
    },
    
    renderTopBar : function(){
        $(this.el).html('');
        _this = this;
        // On filtre les notifs
        notif_to_render2    = new Backbone.Collection();
        this.notif_to_render.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){notif_to_render2.add(notif);}
        });
        // TopBar view
        $(this.el).append(new topbar.Views.TopBar({
            notifications : notif_to_render2,
            eventAggregator : this.eventAggregator
        }).render().el);
    },
    render : function(){
        $(this.el).html('');
        _this = this;
        // On filtre les notifs
        this.notifications.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){_this.notif_to_render.add(notif);}
        });
        // TopBar view
        $(this.el).append(new topbar.Views.TopBar({
            notifications : this.notif_to_render,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Notification Modal
        new notification.Views.Modal({
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

        return this;
    }
});
/***************************************/

