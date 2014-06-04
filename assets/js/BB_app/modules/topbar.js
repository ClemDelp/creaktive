/////////////////////////////////////////
// VIEWS
/////////////////////////////////////////
topbar.Views.TopBar = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.eventAggregator    = json.eventAggregator;
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
        // Events
        
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({
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
        this.eventAggregator    = json.eventAggregator; 
    },
    render : function(){
        $(this.el).html('');
        _this = this;
        // TopBar view
        $(this.el).append(new topbar.Views.TopBar({
            user : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);

        return this;
    }
});
/***************************************/

