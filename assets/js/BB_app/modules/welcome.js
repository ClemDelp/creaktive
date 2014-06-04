/***************************************/
welcome.Views.Main = Backbone.View.extend({
    el : "#welcome_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.all_notifs         = json.all_notifs;
        this.all_news_notifs    = json.new_notifs;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.all_notifs.on('change',this.render)
        this.all_notifs.on('add',this.render)
        this.all_notifs.on('remove',this.render)
        // Templates
        this.template = _.template($('#welcome-template').html());
    },
    events : {},
    render : function(){
        // Init
        $(this.el).empty();
        $(this.el).append(this.template({
            user        : this.user.toJSON(),
            notifNbre   : this.all_news_notifs.length
        }))
        
        return this;
    }
});
/***************************************/