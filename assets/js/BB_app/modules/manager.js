/////////////////////////////////////////////////
// Projects list
/////////////////////////////////////////////////
manager.Views.Projects = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Params
        this.permissions        = json.permissions;
        this.projects           = json.projects;
        this.projects_render    = this.projects;
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
    events : {
        "click .openProjectModal"  : "openProjectModal",
    },
    openProjectModal : function(e){
        e.preventDefault();
        manager.views.p_cklayout_modal.openModelEditorModal(e.target.getAttribute("data-model-id"));
    },
    projectsSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
    },
    render : function(){
        $(this.el).html('');
        _this = this;
        this.projects_render.each(function(project){
            // Append the template
            $(_this.el).append(_this.template_project({
                notifNbr : manager.views.main.dic_notifs[project.get('id')].news.length,
                project  : project.toJSON(),
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
        this.all_notifs         = json.all_notifs;
        this.dic_notifs         = json.dic_notifs;
        console.log('dictionaaaaaaary',this.dic_notifs)
        this.permissions        = json.permissions;
        this.projects           = json.projects;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.users              = json.users;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // CKLayout for project
        manager.views.p_cklayout_modal = new CKLayout.Views.Modal({
            all_notifs : this.all_notifs, // Le déclancheur pour le real time
            dic_notifs : this.dic_notifs, // Le dictionnaire des notifications
            user : this.user,
            collection : this.projects,
            eventAggregator : this.eventAggregator
        });
        // Events
        this.permissions.bind("reset", this.render);
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
        console.log(this.user)
        new_project = new global.Models.ProjectModel({
            id:guid(),
            author : this.user,
            title: $("#project_title").val(),
            date: getDate(),
            date2:new Date().getTime()
            //description : $("#project_description").val(),
            //kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
            //cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
        });
        new_project.save();
        this.projects.add(new_project);
        
    },

    removeProject : function (e){
        e.preventDefault();
        _this = this;
        if(confirm("Will remove the project and all its data! Confirm?")){
            console.log("Remove project");
            project_id = e.target.getAttribute("data-id-project");
            project = this.projects.get(project_id);
            project.destroy();

            _.each(this.concepts.where({project : project_id}), function(concept){
                _this.concepts.remove(concept);
                concept.destroy();
            })

        }
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
            id              : "categories_grid",
            className       : "panel expand gridalicious",
            permissions     : this.permissions,
            projects        : this.projects,
            knowledges      : this.knowledges,
            concepts        : this.concepts,
            links           : this.links,
            users           : this.users,
            poches          : this.poches,
            eventAggregator : this.eventAggregator
        }).render().el);

        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });

        $(document).foundation();
        return this;
    }
});