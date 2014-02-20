/////////////////////////////////////////
// Main
/////////////////////////////////////////
topbar.Views.Main = Backbone.View.extend({
    el:"#topbar_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.projects = json.projects;
        this.project = json.project;
        this.page = json.page;
        this.eventAggregator = json.eventAggregator;

        // Events  
        this.projects.bind("reset",this.render)
        // Templates     
        this.template = _.template($("#topbar-main-template").html());
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({
            projects : this.projects,
            project  : this.project, 
            page     : this.page
        }));

        return this;
    }
});
/***************************************/
