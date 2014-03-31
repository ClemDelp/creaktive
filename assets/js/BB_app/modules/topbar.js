/////////////////////////////////////////
// Main
/////////////////////////////////////////
topbar.Views.Main = Backbone.View.extend({
    el:"#topbar_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template());

        return this;
    }
});
/***************************************/
