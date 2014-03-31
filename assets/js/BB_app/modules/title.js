/////////////////////////////////////////
// Main
/////////////////////////////////////////
title.Views.Main = Backbone.View.extend({
    el:"#title_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.page = json.page;
        this.json = {};
        this.project = json.project;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template = _.template($('#title-template').html());              
        
    },
    render : function(){
        $(this.el).html(this.template({project: this.project,page : this.page}));
        return this;
    }
});
/***************************************/
