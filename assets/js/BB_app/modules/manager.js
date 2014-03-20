/////////////////////////////////////////////////
// Projects list
/////////////////////////////////////////////////
manager.Views.Projects = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Params
        this.permissions        = json.permissions;
        this.projects           = json.projects;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.users              = json.users;
        this.poches             = json.poches;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.eventAggregator.on('projects_search', this.projectsSearch, this);
        // Templates
        this.template_project = _.template($('#manager-project-template').html());              
    },
    projectsSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
    },
    render : function(){
        $(this.el).html('');
        _this = this;
        this.projects.each(function(_project){
            // List to complete by research
            concepts_list   = [];
            links_list      = [];
            knowledges_list = [];
            categories_list = [];
            users_list      = [];
            // Research
            _this.concepts.each(function(concept){
                if(concept.get('project') == _project.get('id')){concepts_list.unshift(concept.get('id'));}
            });
            _this.links.each(function(link){
                if(_.indexOf(concepts_list, link.get('concept') > -1)){links_list.unshift(link.get('id'));}
            });
            _this.knowledges.each(function(knowledge){
                if(knowledge.get('project') == _project.get('id')){knowledges_list.unshift(knowledge.get('id'));}
                _.union(categories_list,knowledge.get('tags'));
            });
            _this.permissions.each(function(permission){
                if(permission.get('project_id') == _project.get('id')){users_list.unshift(permission.get('id'));}
            });
            // Calculs
            _nbrConc = concepts_list.length;
            _nbrLink = links_list.length;
            _nbrUser = users_list.length;
            _nbrCatg = categories_list.length;
            _nbrKnow = knowledges_list.length;
            // Append the template
            $(_this.el).append(_this.template_project({
                project : _project.toJSON(),
                nbrConc : _nbrConc,
                nbrKnow : _nbrKnow,
                nbrCatg : _nbrCatg,
                nbrLink : _nbrLink,
                nbrUser : _nbrUser
            }));
        });

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
        // Variables
        this.permissions = json.permissions;
        this.projects = json.projects;
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.links = json.links;
        this.users = json.users;
        this.poches = json.poches;
        this.currentUser = json.currentUser;
        this.eventAggregator    = json.eventAggregator;
        // Events
        this.links.bind("reset", this.render);
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
            permissions : this.permissions,
            projects : this.projects,
            knowledges : this.knowledges,
            concepts : this.concepts,
            links : this.links,
            users : this.users,
            poches : this.poches,
            eventAggregator : this.eventAggregator
        }).render().el);

        $(document).foundation();
        return this;
    }
});