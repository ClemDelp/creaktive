/////////////////////////////////////////
// Main
/////////////////////////////////////////
conceptsmap.Views.Main = Backbone.View.extend({
    el:"#conceptsmap_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;

        // Events                 
        this.concepts.bind("reset", this.render);
        this.knowledges.bind("add", this.render);
        this.knowledges.bind("remove", this.render);
        this.eventAggregator.on('change',this.action)

        MM.App.init(this.eventAggregator);
    },
    action:function(actions){
        console.log("actions: ",actions)
    },
    events : {

    },
    render : function(){
        $(this.el).html("");
        
        $(document).foundation();

        return this;
    }
});
/***************************************/
