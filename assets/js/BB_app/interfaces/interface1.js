/****************************************************************/
interface1.Views.Concept = Backbone.View.extend({
	tagName:"div",
	className:"small-6 large-6 columns",
	initialize : function (json){
        console.log("Interface 1 Concept view initialise");
        _.bindAll(this, 'render');

        /*Variables*/
        this.currentUser = json.currentUser;
        this.currentProject = json.currentProject;
	    this.concepts = json.concepts;
	    this.eventAggregator = json.eventAggregator;
	},

	render : function (){
		$(this.el).html("");//reset the view
		concept_ = new concepts.Views.MapView({
    		currentUser : this.currentUser,
    		currentProject : this.currentProject,
    		eventAggregator : this.eventAggregator,
    		concepts : this.concepts
		});
		$(this.el).append(concept_.render().el);
		return this;
	}
});
/****************************************************************/
interface1.Views.Explorer = Backbone.View.extend({
    tagName:"div",
    className:"small-6 large-6 columns",
    initialize : function(json) {
        console.log("Interface3 Explorer view initialise");
        _.bindAll(this, 'render');

        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;

    },
    render : function() {
        explorer_   = new explorer.Views.Explorer({
        	collection:this.collection,
        	poches:this.poches,
        	current_selection:this.eventAggregator
        });
        $(this.el).append(explorer_.render().el);
        return this;
    }
});
/****************************************************************/
interface1.Views.Main = Backbone.View.extend({
    el : $('#interface1-container'),
    initialize : function(json) {
        console.log("interface1 view initialise");
        _.bindAll(this, 'render');

        /*Variables*/
        this.currentUser = json.currentUser;
        this.currentProject = json.currentProject;
	    this.concepts = json.concepts;
	    this.links = json.links;
	    this.knowledges = json.knowledges;
	    this.poches = json.poches;

        this.eventAggregator = {};
        _.extend(this.eventAggregator, Backbone.Events);
        
    },
    render : function() {

    	concept_ = new interface1.Views.Concept({
    		currentUser : this.currentUser,
    		currentProject : this.currentProject,
    		eventAggregator : this.eventAggregator,
    		concepts : this.concepts
    	});
        $(this.el).append(concept_.render().el);
        // Explorer
        explorer_   = new interface1.Views.Explorer({
        	collection:this.knowledges,
        	poches:this.poches,
        	eventAggregator : this.eventAggregator
    	});// Knowledges, Poches
        $(this.el).append(explorer_.render().el);
        $(document).foundation();
    
        return this;
    }
});
/****************************************************************/
