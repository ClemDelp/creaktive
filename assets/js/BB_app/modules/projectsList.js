/***************************************/
var projectsList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/***************************************/
projectsList.Views.ProjectList = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.projects = json.projects;
        this.projects_render = this.projects;
        this.eventAggregator = json.eventAggregator;
        this.knowledges = json.knowledges;
        // Events
        this.eventAggregator.on('project_search', this.projectSearch, this);
        // Templates
        this.template = _.template($('#projectsList-project-template').html());
        // Styles
        //$(this.el).attr( "style","overflow: auto;max-height:200px");
    },
    projectSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_projects_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Get the total_connections
        total_connections = 0;
        this.projects_render.each(function(project_){
            // Get the recurrence
            knowledges.each(function(k){
                    if(k.get('project') == project_.get('id')){
                        total_connections+=1;return false;
                    }
                    else{return false;}   
            });
        });
        // For each concept
        this.projects_render.each(function(project_){
            // Get the recurrence
            recurrence = 0;
            knowledges.each(function(k){
                if(k.get('project') == project_.get('id')){
                        recurrence+=1;return false;
                    }
                    else{return false;}   
            });
            if((recurrence == 0)&&(total_connections == 0)){percentage = 0;}else{percentage = (recurrence*100)/total_connections;}
            var renderedContent = template({project:project_.toJSON(),rec : recurrence,per : percentage});
            $(el_projects_part).append(renderedContent);
        });
        return this;
    }
});
/***************************************/
projectsList.Views.Main = Backbone.View.extend({
    className:"content",
    initialize : function(json) {
        _.bindAll(this, 'render','search');
        // Variables
        this.projects = json.projects; 
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.projects.bind("add",this.render);
        this.projects.bind("remove",this.render);
        this.projects.bind("change",this.render);
        // Template
        this.template_search = _.template($('#projectsList-search-template').html());
        // Style
        $(this.el).attr('id',json.idAcc);
    },
    events : {
        "keyup .search" : "search"
    },
    search: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.projects.each(function(c){
            if(research.toLowerCase() == c.get('title').substr(0,research_size).toLowerCase()){
                matched.add(c);
            }
        });
        this.eventAggregator.trigger('project_search',matched);
    },
    render : function(){
        // Init
        $(this.el).html('');
        el_projects_part=this.el;
        template = this.template;
        knowledges = this.knowledges;
        // Input search
        $(this.el).append(this.template_search({title:"Projects"}));
        // Concepts list
        project_list_view = new projectsList.Views.ProjectList({
            projects:this.projects,
            eventAggregator:this.eventAggregator,
            knowledges:this.knowledges,
        });
        $(this.el).append(project_list_view.render().el);
        
        return this;
    }
});