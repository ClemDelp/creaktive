/////////////////////////////////////////
// Main
/////////////////////////////////////////
title.Views.Main = Backbone.View.extend({
    el:"#title_container",
    initialize : function(json) {
        _.bindAll(this, 'render','openSemanticModal');
        // Variables
        this.json = {};
        this.projectTitle = json.project;
        this.user = json.user;
        this.eventAggregator = json.eventAggregator;
        // Events  
        this.eventAggregator.on("title_notification",this.title_notification,this)
        // Templates
        this.template = _.template($('#title-stats-template').html());              
        
    },
    events : {
        "click #success_notification" : "openSemanticModal"
    },
    openSemanticModal : function(e){
        e.preventDefault();
        this.eventAggregator.trigger('openSemanticModal',this.json);
    },
    title_notification : function(json){
        type = json.type;
        msg = json.msg;
        this.json = {from:json.from,hits:json.hits};
        $(this.el).find("#"+type+"_notification").hide();
        $(this.el).find("#"+type+"_notification").html(msg).show('slow');
    },
    render : function(){
        $(this.el).html(this.template({projectTitle: this.projectTitle}));
        return this;
    }
});
/***************************************/
