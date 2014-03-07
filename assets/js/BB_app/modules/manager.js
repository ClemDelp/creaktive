/////////////////////////////////////////////////
// Projects list
/////////////////////////////////////////////////
manager.Views.Projects = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Params
        this.projects = json.projects;
        this.projects_render = this.projects;
        this.eventAggregator = json.eventAggregator;
        // Events
        this.eventAggregator.on('projects_search', this.projectsSearch, this);
        // Templates
        this.template_projects = _.template($('#manager-projects-template').html());              
    },
    projectsSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template_projects({
            projects : this.projects_render.toJSON()
        }));

        return this;
    }
});
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
manager.Views.Main = Backbone.View.extend({
    el : $("#manager-container"),
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.projects = json.projects;
        this.currentUser = json.currentUser;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.projects.bind("reset", this.render);
        this.projects.bind("add", this.render);
        this.projects.bind("remove", this.render);
        // Templates
        this.template_search = _.template($('#manager-search-template').html());
    },
    events : {
        "keyup .search" : "search",
        "click .newProject" : "newProject",
        "click .removeProject" : "removeProject",
    },
    newProject : function(e){
        e.preventDefault();
        new_project = new global.Models.ProjectModel({
            id:guid(),
            title: $("#project_title").val(),
            description : $("#project_description").val(),
            kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
            cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
        });
        new_project.save();
        this.projects.add(new_project);
        
    },
    removeProject : function (e){
        console.log("Remove project");
        project_id = e.target.getAttribute("data-id-project");
        project = this.projects.get(project_id);
        this.projects.remove(project);
        project.destroy();
    },
    search: function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.projects.each(function(p){
            if(research.toLowerCase() == p.get('title').substr(0,research_size).toLowerCase()){
                matched.add(p);
            }
        });
        this.eventAggregator.trigger('projects_search',matched);
    },
    render : function() {
        $(this.el).html('');
        // Search bar
        $(this.el).append(this.template_search());
        // Projects
        $(this.el).append(new manager.Views.Projects({
            projects : this.projects,
            eventAggregator : this.eventAggregator
        }).render().el);

        $(document).foundation();
        return this;
    }
});