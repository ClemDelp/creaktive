/****************************************************************/
interface1.Views.Concept = Backbone.View.extend({
	tagName:"div",
	className:"small-8 large-8 columns",
	initialize : function (json){
        console.log("Interface 1 Concept view initialise");
        _.bindAll(this, 'render');

        /*Variables*/
        this.currentUser = json.currentUser;
        this.currentProject = json.currentProject;
	    this.concepts = json.concepts;
	    this.current_concept = json.current_concept;
	},

	render : function (){
		$(this.el).html("");//reset the view
		// concept_ = new concepts.Views.MapView({
  //   		currentUser : this.currentUser,
  //   		currentProject : this.currentProject,
  //   		current_concept : this.current_concept,
  //   		concepts : this.concepts
		// });
		// $(this.el).append(concept_.render().el);
		return this;
	}
});
/****************************************************************/
interface1.Views.CKLink = Backbone.View.extend({
    tagName:"div",
    className:"small-4 large-4 columns",
    initialize : function(json) {
        console.log("Interface3 Explorer view initialise");
        // Variables
        this.current_concept = json.current_concept;
        this.poches = json.poches;
        this.knowledges = json.knowledges;
        this.links = json.links;
        // Events
        _.bindAll(this, 'render');
        
    },
    render : function() {
        cklink_   = new cklink.Views.Main({
        	knowledges:this.knowledges,
        	poches:this.poches,
        	current_concept:this.current_concept,
            links:this.links
        });
        $(this.el).append(cklink_.render().el);
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

        this.current_concept = {};//this.concepts.first();
        _.extend(this.current_concept, Backbone.Events);
        
    },
    render : function() {
        // Arbre des concepts
    	concept_ = new interface1.Views.Concept({
    		currentUser : this.currentUser,
    		currentProject : this.currentProject,
    		current_concept : this.current_concept,
    		concepts : this.concepts
    	});
        $(this.el).append(concept_.render().el);
        
        // Explorer
        cklink_view   = new interface1.Views.CKLink({
        	knowledges:this.knowledges,
        	poches:this.poches,
            links:this.links,
        	current_concept : this.current_concept
    	});
        $(this.el).append(cklink_view.render().el);
        $(document).foundation();
    
        return this;
    }
});
/****************************************************************/
