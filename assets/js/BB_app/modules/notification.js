/////////////////////////////////////////
// MAIN
/////////////////////////////////////////
notification.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render','globalValidation');
        // Variables
        this.user               = json.user;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Template
        this.template = _.template($('#notification-log-template').html());
        this.template_action = _.template($('#notification-actions-template').html());
        // Event
        this.notifications.on('add',this.render,this);
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
        window.location.href = "/"+link+"?projectId="+project_id;
    },
    validation : function(e){
        e.preventDefault();
        notif = this.notifications.get(e.target.getAttribute('data-id-notification'));
        notif.set({read : _.union(notif.get('read'),this.user.get('id'))});
        notif.save();
        $(this.el).find("#notification_"+notif.get('id')).hide('slow');
    },
    render : function(){
        $(this.el).empty();
        // Action bar
        $(this.el).append(this.template_action());
        // All Notifications
        $(this.el).append(this.template({
            notifications : this.notifications.toJSON()
        }));
            
        return this;
    }
});
