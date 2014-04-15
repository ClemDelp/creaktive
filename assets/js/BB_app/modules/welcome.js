/***************************************/
welcome.Views.Main = Backbone.View.extend({
    el : "#welcome_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.notifications = json.notifications;
        // Events
        this.notifications.on('reset',this.render)
        // Templates
        this.template = _.template($('#welcome-template').html());
    },
    events : {},
    render : function(){
        // Init
        $(this.el).html('');
        // On filtre les notifs
        notifNbre = 0;
        this.notifications.each(function(notif){
            if(_.indexOf(notif.get('read'), _this.user.get('id')) == -1){notifNbre = notifNbre+1;}
        });

        $(this.el).append(this.template({
            user:this.user.toJSON(),
            notifNbre : notifNbre
        }))
        
        return this;
    }
});
/***************************************/