/////////////////////////////////////////
// Main
/////////////////////////////////////////
user.Views.Main = Backbone.View.extend({
    el:"#user_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.project = json.project;
        this.users   = json.users;

        // Events                 
        
    },
    events : {},
    render : function(){
        $(this.el).html("");
        
    }
});
/***************************************/