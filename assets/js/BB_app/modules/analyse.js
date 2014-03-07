/////////////////////////////////////////
// Main
/////////////////////////////////////////
analyse.Views.Main = Backbone.View.extend({
    el:"#analyse_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.eventAggregator    = json.eventAggregator;

    },
    events : {

    },
    render : function(){
        $(this.el).html("");
        
    }
});
/***************************************/