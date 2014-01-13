/****************************************************************/
interface1.Views.Concept = Backbone.View.extend({
	tagName:"div",
	className:"small-8 large-8 columns",
	initialize : function (json){
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
interface1.Views.Details = Backbone.View.extend({
    tagName:"div",
    className:"reveal-modal",
    id :"detailsModal",
    initialize : function(json) {
        _.bindAll(this, 'render', 'nodeSelectionChanged');
        $(this.el).attr( "data-reveal","")
        
        // Variables
        this.eventAggregator = json.eventAggregator;
        this.concepts = json.concepts;
        this.user = json.user; 

        this.concept = new global.Models.ConceptModel();
        this.eventAggregator.on("nodeSelectionChanged", this.nodeSelectionChanged);

    },

    nodeSelectionChanged : function (e){
        this.concept = this.concepts.get(e);
        this.render();
    },

    render : function() {

        details_ = new c_details.Views.Main({
            model : this.concept,
            user : this.user
        });
        $(this.el).append(details_.render().el);

        return this;
    }
});
/****************************************************************/
interface1.Views.CKLink = Backbone.View.extend({
    tagName:"div",
    className:"reveal-modal",
    id :"linkModal",
    initialize : function(json) {
        // Variables
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.knowledges = json.knowledges;
        this.links = json.links;
        this.concepts = json.concepts;
        // Events

         $(this.el).attr( "data-reveal","")
        _.bindAll(this, 'render');
        
    },
    render : function() {
        cklink_   = new cklink.Views.Main({
        	knowledges:this.knowledges,
        	poches:this.poches,
        	eventAggregator:this.eventAggregator,
            links:this.links,
            concepts : this.concepts
        });
        $(this.el).append(cklink_.render().el);
        return this;
    }
});
/****************************************************************/
interface1.Views.Main = Backbone.View.extend({
    el : $('#interface1-container'),
    initialize : function(json) {
        _.bindAll(this, 'render');

        /*Variables*/
        this.currentUser = json.currentUser;
        this.currentProject = json.currentProject;
	    this.concepts = json.concepts;
	    this.links = json.links;
	    this.knowledges = json.knowledges;
	    this.poches = json.poches;

        this.eventAggregator = {};//this.concepts.first();
        _.extend(this.eventAggregator, Backbone.Events);
        
    },
    render : function() {
        // Arbre des concepts
    	concept_ = new interface1.Views.Concept({
    		currentUser : this.currentUser,
    		currentProject : this.currentProject,
    		eventAggregator : this.eventAggregator,
    		concepts : this.concepts
    	});
        $(this.el).append(concept_.render().el);
        
        // Explorer
        cklink_   = new interface1.Views.CKLink({
        	knowledges:this.knowledges,
        	poches:this.poches,
            links:this.links,
        	eventAggregator : this.eventAggregator,
            concepts : this.concepts
    	});
        $(this.el).append(cklink_.render().el);

        details_ = new interface1.Views.Details({
            eventAggregator : this.eventAggregator,
            concepts : this.concepts,
            user : this.currentUser
        });
        $(this.el).append(details_.render().el);
        $(document).foundation();
    
        return this;
    }
});
/****************************************************************/
