/////////////////////////////////////////////////////////////////////
interface3.Views.Timela = Backbone.View.extend({
    tagName:"div",
    className:"small-6 large-6 columns",
    initialize : function(json) {
        console.log("interface3 Timela view initialise");
        _.bindAll(this, 'render');
        /* Variables */
        this.knowledge = json.knowledge;
        this.user = json.user;
        this.current_selection = json.current_selection;
        this.current_selection.on('change',this.render, this);
    },
    render : function() {
        $(this.el).html("");//reset the view
        interface3.views.timela = new timela.Views.Main({
            current_selection:this.current_selection,
            collection:this.collection,
            user:this.user
        });
        $(this.el).append(interface3.views.timela.render().el);
        return this;
    }
});
/****************************************************************/
interface3.Views.Explorer = Backbone.View.extend({
    tagName:"div",
    className:"small-6 large-6 columns",
    initialize : function(json) {
        console.log("Interface3 Explorer view initialise");
        _.bindAll(this, 'render');
        this.poches = json.poches;
        this.current_selection = json.current_selection;
    },
    render : function() {
        explorer_   = new explorer.Views.Explorer({collection:this.collection,poches:this.poches,current_selection:this.current_selection});
        $(this.el).append(explorer_.render().el);
        return this;
    }
});
/****************************************************************/
interface3.Views.Main = Backbone.View.extend({
    el : $('#knowledge-container'),
    initialize : function(json) {
        console.log("interface3 view initialise");
        _.bindAll(this, 'render');
        /*Variables*/
        this.poches = json.poches;
        this.timelines = json.timelines;
        this.user = json.user;
        this.current_selection = [];
        _.extend(this.current_selection, Backbone.Events);
    },
    render : function() {
        // Timeline
        timela_     = new interface3.Views.Timela({collection:this.timelines, model:this.model,user:this.user,current_selection:this.current_selection});// Posts, Current user, Knowledge
        $(this.el).append(timela_.render().el);
        // Explorer
        explorer_   = new interface3.Views.Explorer({collection:this.collection,poches:this.poches,current_selection:this.current_selection});// Knowledges, Poches
        $(this.el).append(explorer_.render().el);
        $(document).foundation();

        return this;
    }
});
/****************************************************************/
