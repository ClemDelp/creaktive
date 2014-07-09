/////////////////////////////////////////////////
var manager = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    /*Init*/
    this.views.main = new this.Views.Main({
      projects_notifs : global.ProjectsNotificationsDictionary, // Le dictionnaire des notifications
      users_rec_dic   : global.ProjectsUsersDictionary,
      permissions     : global.collections.Permissions,
      projects        : global.collections.Projects,
      concepts        : global.collections.Concepts,
      knowledges      : global.collections.Knowledges,
      experts         : global.collections.Users,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      users           : global.collections.Users,
      user            : global.models.current_user,
      eventAggregator : global.eventAggregator
    }); 
    this.views.main.render()
  }
};
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
        this.eventAggregator.on('ProjectsNotificationsDictionary', this.actualize, this);
        // Templates
        this.template_project = _.template($('#manager-project-template').html());              
    },
    events : {
        "click .openProjectModal"  : "openProjectModal",
    },
    actualize : function(dic){
        this.projects_notifs = dic;
        this.render();
        manager.views.main.formatGrid();
    },
    openProjectModal : function(e){
        e.preventDefault();
        //manager.views.p_cklayout_modal.openModelEditorModal(e.target.getAttribute("data-model-id"));
        this.eventAggregator.trigger("show_project_details", e.target.getAttribute("data-model-id"));
    },
    projectsSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
        manager.views.main.formatGrid();
    },
    render : function(){
        $(this.el).empty();
        _this = this;
        this.projects_render.each(function(project){
            // Append the template
            $(_this.el).append(_this.template_project({
                notifNbr : global.ProjectsNotificationsDictionary[project.get('id')].news.length,
                userNbr  : manager.views.main.users_rec_dic[project.get('id')],
                project  : project.toJSON(),
            }));
        });
        
        return this;
    }
});
manager.Views.ProjectDetails = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Params
        this.user               = json.user;
        this.permissions        = json.permissions;
        this.projects           = json.projects;
        this.project_render     = null;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.users              = json.users;
        this.poches             = json.poches;
        this.eventAggregator    = json.eventAggregator;
        this.labels             = new Backbone.Collection();
        // Events
        this.eventAggregator.on('show_project_details', this.showDetails,this);
        // Templates             
    },
    showDetails : function(project){
        this.project_render = this.projects.get(project)
        this.render();
    },
    render : function(){
        $(this.el).empty();
        _this = this;

        if(this.project_render) {
            // $(_this.el).append(_this.template_projectDetails);

            $(this.el).append(new CKLayout.Views.Header({
                model : this.project_render,
                labels : this.labels
            }).render().el);

            $(_this.el).append(new modelEditor.Views.Main({
                user            : this.user,
                model           : this.project_render,
            }).render().el);

            $(_this.el).append(new activitiesList.Views.Main({
                model           : this.project_render,
            }).render().el);
        }

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
        // Variables
        this.users_rec_dic      = json.users_rec_dic;
        this.permissions        = json.permissions;
        this.projects           = json.projects;
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.users              = json.users;
        this.poches             = json.poches;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
        // // CKLayout for project
        // manager.views.p_cklayout_modal = new CKLayout.Views.Modal({
        //     user            : this.user,
        //     collection      : this.projects,
        //     eventAggregator : this.eventAggregator
        // });
        // Events
        this.projects.bind("add", this.render);
        this.projects.bind("remove", this.render);
        // Templates
        this.template_search = _.template($('#manager-search-template').html());
    },
    events : {
        "keyup .search" : "search",
        "click .newProject" : "newProject",
        "click .remove" : "remove",
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
    formatGrid : function(){
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });
    },
    render : function() {
        $(this.el).html('');
        // Search bar
        $(this.el).append(this.template_search());
        // Projects
        $(this.el).append(new manager.Views.Projects({
            id              : "categories_grid",
            className       : "expand gridalicious large-3 columns",
            user            : this.user,
            permissions     : this.permissions,
            projects        : this.projects,
            knowledges      : this.knowledges,
            concepts        : this.concepts,
            links           : this.links,
            users           : this.users,
            poches          : this.poches,
            eventAggregator : this.eventAggregator
        }).render().el);

        $(this.el).append(new manager.Views.ProjectDetails({
            id              : "project_details",
            className       : "large-9 columns",
            permissions     : this.permissions,
            projects        : this.projects,
            knowledges      : this.knowledges,
            concepts        : this.concepts,
            links           : this.links,
            users           : this.users,
            poches          : this.poches,
            eventAggregator : this.eventAggregator
        }).render().el);

        this.formatGrid();

        $(document).foundation();
        return this;
    }
});