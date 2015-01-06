/***************************************/
var actionMenu = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},
    eventAggregator : global.eventAggregator,
    init: function (json) {
        this.views.main = new this.Views.Main({
            el : json.el,
            filter : json.filter,
            mode    : json.mode,
            project : global.models.currentProject,
            from : json.from
        });
        this.views.main.render();
    }
};
/***************************************/
actionMenu.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.from = json.from;
        this.filter = json.filter;
        this.mode    = json.mode;
        this.project = global.models.currentProject;
        // Templates
        this.template = _.template($('#actionMenu-template').html());
        // Events
    },
    events : {
        "click .fullscreen" : "putInFullScreen",
    },
    putInFullScreen : function(e){
        e.preventDefault();
        if (screenfull.enabled) screenfull.request();
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({
            from : this.from,
            filter  : this.filter,
            mode    : this.mode,
            project : this.project.toJSON()
        }));
        
        return this;
    }
});
/***************************************/