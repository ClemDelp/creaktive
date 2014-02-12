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
        this.users.bind("reset", this.render);

        // Templates
        this.template_search = _.template($('#user-search-template').html());
        this.template_profil = _.template($('#user-profil-template').html());              
        
    },
    events : {},
    render : function(){
        $(this.el).html("");
        // Init
        el = this.el;
        template_profil = this.template_profil;
        // Search bar
        $(this.el).append(this.template_search());
        // For each user
        this.users.each(function(user_){
            $(this.el).append(template_profil({user:user_.toJSON()}))
        });
        
    }
});
/***************************************/