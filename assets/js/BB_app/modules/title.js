/////////////////////////////////////////
// Main
/////////////////////////////////////////
title.Views.Main = Backbone.View.extend({
    el:"#title_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects;
        this.projectTitle = json.project;
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.links = json.links;
        this.users = json.users;
        this.user = json.user;
        this.poches = json.poches;
        this.eventAggregator = json.eventAggregator;
        // Events  
        this.projects.bind("reset", this.render);
        this.projects.bind("change", this.render);
        this.projects.bind("add", this.render);
        this.projects.bind("remove", this.render);

        this.knowledges.bind("reset", this.render);
        this.knowledges.bind("change", this.render);
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);

        this.concepts.bind("reset", this.render);
        this.concepts.bind("change", this.render);
        this.concepts.bind("add", this.render);
        this.concepts.bind("remove", this.render);

        this.links.bind("reset", this.render);
        this.links.bind("change", this.render);
        this.links.bind("add", this.render);
        this.links.bind("remove", this.render);

        this.users.bind("reset", this.render);
        this.users.bind("change", this.render);
        this.users.bind("add", this.render);
        this.users.bind("remove", this.render);

        this.poches.bind("reset", this.render);
        this.poches.bind("change", this.render);
        this.poches.bind("add", this.render);
        this.poches.bind("remove", this.render);

        // Templates
        this.template = _.template($('#title-stats-template').html());              
        
    },
    events : {},
    render : function(){
        nbrConc_ = this.concepts.length;
        nbrKnow_ = this.knowledges.length;
        nbrCatg_ = this.poches.length;
        nbrLink_ = this.links.length;
        nbrUser_ =this.users.length;
        $(this.el).html(this.template({
            projectTitle: this.projectTitle,
            nbrConc: nbrConc_,
            nbrKnow: nbrKnow_,
            nbrCatg: nbrCatg_,
            nbrLink: nbrLink_,
            nbrUser: nbrUser_
        }));

        return this;
    }
});
/***************************************/
