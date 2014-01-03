/****************************************************************/
topBar.Views.Notification = Backbone.View.extend({
    tagName:"li",
    initialize : function(json){
        _.bindAll(this, 'render');

        this.model.bind("change", this.render);
        // Template
        this.template = _.template($('#notification-template').html());
    },
    onChange : function(e){
        console.log("*******",e)
    },
    render : function(){
        var renderedContent;
        if(this.model.get('read') != true){
            renderedContent = this.template({
                notification : this.model.toJSON()
            });  
              $(this.el).append(renderedContent);
        }else{
           renderedContent = ""; 
           $(this.el).html(renderedContent);
        }
        
        
        return this;
    }
});

/****************************************************************/
topBar.Views.Main = Backbone.View.extend({
    el : $('#dropdown'),
    initialize : function(json) {
        console.log("********************** TopBar view initialize");
        _.bindAll(this, 'render');
        _.bindAll(this, 'onNotificationClicked');
        // Variables
        this.notifications = json.notifications;
        this.notifications.bind("add", this.render);
        this.notifications.bind("reset", this.render);
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

        }
        if(notification.get('type') === "createKnowledge"){
            $("#panel-concept").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-knowledge").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").addClass("active");
            $("#panel2-1").removeClass('active');
        }
        if(notification.get('type') === "createPoche"){
            $("#panel-concept").removeClass('active');
            $("#panel-visualization").removeClass('active');
            $("#panel-knowledge").addClass( "active" );

            $("#panel2-2").removeClass("active");
            $("#panel2-3").addClass("active");
            $("#panel2-1").removeClass('active');
        }

        notification.set({read:true});
        notification.save();
    },

    removeNotification : function(e){
        //TODO : supprimer la notification
    },

    
    render : function() {
        console.log("********************** TopBar view RENDER");
        _this = this;
        this.notifications.each(function(notification){
            notification_ = new topBar.Views.Notification({
                model : notification
            });
            $(_this.el).append(notification_.render().el);
        })      
        $(document).foundation();
        return this;
    }
});