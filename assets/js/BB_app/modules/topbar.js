/****************************************************************/
topBar.Views.Notification = Backbone.View.extend({
    tagName:"li",
    initialize : function(json){
        _.bindAll(this, 'render');

        this.model.bind("change", this.render);
        this.current_user = json.current_user
        // Template
        this.template = _.template($('#notification-template').html());
    },

    render : function(){
        var renderedContent = "";
        
        if( _.indexOf(this.model.get("read"), this.current_user.id) === -1 ) {
            
            renderedContent = this.template({
                notification : this.model.toJSON()
            });  
              
        }
        
        $(this.el).append(renderedContent);
        return this;
    }
});
topBar.Views.Notifications = Backbone.View.extend({
    el : $('#dropdown'),
    initialize : function(json) {
        console.log("TopBar view initialize");
        _.bindAll(this, 'render','onNotificationClicked','removeNotification', 'serverCreate');

        // Variables
        this.current_user = json.current_user;

        this.notifications = json.notifications;

        this.notifications.ioBind("create", this.serverCreate, this);
    },

    serverCreate : function(e){
        console.log("#### INCOMING MESSAGE", e)
        this.notifications.add(e);
    },

    events : {
        "click .clickNotification" : "onNotificationClicked",
        "click .removeNotification" : "removeNotification"
    },

    onNotificationClicked : function (e){
        notification_id = e.target.getAttribute('data-id-notification')
        notification = this.notifications.get(notification_id);
        if(notification.get('type') === "createConcept"){
            $("#panel-knowledge").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-concept").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").removeClass("active");
            $("#panel2-1").addClass('active');

            global.collections.Concepts.fetch({reset : true});
        }
        if(notification.get('type') === "creatLink"){
            $("#panel-knowledge").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-concept").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").removeClass("active");
            $("#panel2-1").addClass('active');

            global.collections.Links.fetch({reset : true});

        }
        if(notification.get('type') === "createKnowledge"){
            $("#panel-concept").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-knowledge").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").addClass("active");
            $("#panel2-1").removeClass('active');

            global.collections.Knowledges.fetch({reset : true});
        }
        if(notification.get('type') === "createPoche"){
            $("#panel-concept").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-knowledge").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").addClass("active");
            $("#panel2-1").removeClass('active');

            global.collections.Poches.fetch({reset : true});
        }

    },

    removeNotification : function(e){
        notification_id = e.target.getAttribute('data-id-notification')
        notification = this.notifications.get(notification_id);
        notification.get("read").unshift(this.current_user.id);
        notification.save();
        this.render();
    },

    
    render : function() {
        console.log("********************** TopBar view RENDER");
        $(this.el).html("");
        _this = this;
        renderedNotification = _this.notifications.filter( function (n){
            if(n.get('from').id !== _this.current_user.id) return n;
        });

        _.each(renderedNotification, function(notification){
            notification_ = new topBar.Views.Notification({
                model : notification,
                current_user : _this.current_user
            });
            $(_this.el).append(notification_.render().el);
        })      
        $(document).foundation();
        return this;
    }
});
/****************************************************************/
topBar.Views.Log = Backbone.View.extend({
    tagName:"div",
    className:"panel",
    initialize : function(json){
        _.bindAll(this, 'render');

        this.notification = json.notification;

        this.template = _.template($('#log-template').html());
    },

    render : function(){
        var renderedContent = this.template({
            notification : this.notification.toJSON()
        });  

        $(this.el).append(renderedContent);
        return this;
    }

});
/****************************************************************/
topBar.Views.Logs = Backbone.View.extend({
    el : $('#log-activity-list'),
    initialize : function(json){
        _.bindAll(this, 'render');

        this.notifications = json.notifications;

    },

    render : function(){
       $(this.el).html("");
        _this = this;
        
        this.notifications.each(function(notification){
            notification_ = new topBar.Views.Log({
                notification : notification
            });
            $(_this.el).append(notification_.render().el);
        }) 
        $(document).foundation();
        return this;
    }

});

/****************************************************************/
topBar.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');

        this.notifications = json.notifications;
        this.notifications.bind("add", this.render);
        this.notifications.bind("reset", this.render);
        this.current_user = json.current_user;

        this.template = _.template($('#log-template').html());
    },

    render : function(){
       notifications_ = new topBar.Views.Notifications({
        notifications : this.notifications,
        current_user : this.current_user
       }); 
       notifications_.render();

       logs_ = new topBar.Views.Logs({
            notifications : this.notifications,
       })
       logs_.render();
    }
});