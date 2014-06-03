/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.TopBar = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
        // Events
        this.notifications.on('change',this.render,this);
        this.notifications.on('add',this.render,this);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({
            notifications_length : this.notifications.length,
            user : this.user.toJSON()
        }));

        return this;
    }
});
/***************************************/
topbar.Views.Main = Backbone.View.extend({
    el:"#topbar_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user               = json.user;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator; 
    },
    render : function(){
        $(this.el).html('');
        _this = this;
        // TopBar view
        $(this.el).append(new topbar.Views.TopBar({
            user : this.user,
            notifications : this.notifications,
            eventAggregator : this.eventAggregator
        }).render().el);

        return this;
    }
});
/***************************************/

