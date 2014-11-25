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
        this.currentSelection   = "_menu_button";
        // Events
        //this.eventAggregator.on('projects_search', this.projectsSearch, this);
        this.eventAggregator.on('ProjectsNotificationsDictionary', this.actualize, this);
        // Templates
        this.template_project = _.template($('#manager-project-template').html());       
        this.template_search = _.template($('#manager-search-template').html());
       
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
        this.changeCurrentSelection(e.target.getAttribute("data-model-id"));
    },
    changeCurrentSelection : function(id){ 
        $('#'+this.currentSelection).addClass('secondary');
        $('#'+this.currentSelection).children().attr( "style", "color:black");
        this.currentSelection = id+"_menu_button";
        $('#'+this.currentSelection).removeClass('secondary');
        $('#'+this.currentSelection).children().attr( "style", "color:white");
    },
    projectsSearch: function(matched_projects){
        this.projects_render = matched_projects;
        this.render();
        manager.views.main.formatGrid();
    },
    render : function(){
        $(this.el).empty();
        var _this = this;
        $(this.el).append("Workspaces :<hr>")
        $(this.el).append(this.template_search())
        this.projects_render.each(function(project){
            userNbr = 1;
            if(manager.views.main.users_rec_dic[project.get('id')]) userNbr = manager.views.main.users_rec_dic[project.get('id')].length
            // Append the template
            $(_this.el).append(_this.template_project({
                notifNbr :  _.filter(global.ProjectsNotificationsDictionary[project.get('id')].news.toJSON(), function(n){if(n.content != "")return n }).length,
                userNbr  : userNbr,
                project  : project.toJSON(),
            }));
        });
        
        return this;
    }
});
manager.Views.ModelEditor = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.model = json.model;
        this.mode = "normal";
        this.template_model_normal = _.template($('#manager-normal-template').html());
        this.template_model_edition = _.template($('#manager-edition-template').html());
        // Events
        //this.model.bind('change',this.render);
    },
    events : {
        "click .edit"  : "editMode",
        "click .updateModel"  : "updateModel",
        "click .cancelEdition"  : "cancelEdition",
        "click .updateLabel" : "updateLabel",
    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    updateModel : function(e){
        e.preventDefault();
        _this = this;
        //////////////////////////////////////
        // Si cest une category et que le titre change on doit updater tous tags qui référence les K
        if(this.model.get('type') === "category"){
            if(this.model.get('title') != $(this.el).find(".title").val()){
                if (confirm("The title of the category has changed, would you want to change all references in the relevant knowledge?")) {
                    // change knowledge reference
                    global.collections.Knowledges.each(function(knowledge){
                        new_tags_array = []
                        knowledge.get('tags').forEach(function(tag){
                            if(_this.model.get('title') == tag){
                                new_tags_array.unshift($(_this.el).find(".title").val());
                            }else{
                                new_tags_array.unshift(tag);
                            }
                        });
                        knowledge.set({
                            tags : new_tags_array,
                            date : getDate(),
                            user : _this.user
                        }).save();
                    });
                    // Set the category title
                    this.model.set({
                        title : $(this.el).find(".title").val(),
                        date: getDate()
                    });
                    global.eventAggregator.trigger('updateCategory',this.model.get('id'),this.model.get('title'))
                }
            }
            this.model.set({
                user : this.user,
                description:CKEDITOR.instances.editor.getData(),
                content:CKEDITOR.instances.editor.getData(),
                date: getDate(),
                date2:new Date().getTime()
            }).save(); 
        //////////////////////////////////////
        }else{
            this.model.save({
                user : this.user,
                title:$(this.el).find(".title").val(),
                content:CKEDITOR.instances.editor.getData(),
                date: getDate(),
                date2:new Date().getTime()
            });       
        }
        this.mode = "normal";
        global.eventAggregator.trigger("updateMap")
        this.render();
    },
    editMode : function(e){
        e.preventDefault();
        this.mode = "edition";
        this.render();
        CKEDITOR.replaceAll('ckeditor');
        CKEDITOR.config.toolbar = [
           ['Bold','Italic','Underline','NumberedList','BulletedList','Image','Link','TextColor']
        ] ;
    },
    render : function(){
        $(this.el).html('');
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_model_normal({model : this.model.toJSON()}));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_model_edition({model : this.model.toJSON()}));    
        }
        
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
        this.reports            = global.collections.Presentations;
        this.project_render     = json.projects.first();
        this.knowledges         = json.knowledges;
        this.concepts           = json.concepts;
        this.links              = json.links;
        this.users              = json.users;
        this.poches             = json.poches;
        this.eventAggregator    = json.eventAggregator;
        this.labels             = new Backbone.Collection();
        // Events
        this.eventAggregator.on('show_project_details', this.showDetails,this);
        //Events
        this.listenTo(this.project_render,"change",this.render,this); 
        // Templates  
        this.template_header = _.template($('#manager-header-template').html());    
        this.template_footer = _.template($('#manager-footer-template').html());        
    },
    events : {
        "change #select_project_status" : "changeProjectStatus",
    },
    changeProjectStatus : function(e){
        e.preventDefault();
        var _this = this;
        var status = $( "#select_project_status option:selected").val();
        swal({   
            title: "Are you sure?",   
            text: "Your workspace will be "+status+"!",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes!",   
            closeOnConfirm: false 
        }, 
        function(isConfirm){
            if(isConfirm){
                _this.project_render.save({status : status});
                swal("Status changed!", "Your workspace is now "+status+".", "success"); 
                manager.views.main.render();
            }else{
                manager.views.main.render();
            }
        });
    },
    showDetails : function(project){
        //Set the project to render
        this.project_render = this.projects.get(project)
        this.render();
    },
    render : function(){
        $(this.el).empty();
        var _this = this;

        if(this.project_render) {
            //HEADER
            $(_this.el).append(this.template_header({project:this.project_render.toJSON()}));           
            //CONTENT EDITOR
            $(_this.el).append(new manager.Views.ModelEditor({
                user            : this.user,
                model           : this.project_render,
            }).render().el);
            //GOOGLE SEARCH IMAGES
            //$(this.el).append($('<fieldset>').append(new googleSearch.Views.Main({
            //    mode       : "edit",
            //    model      : this.project_render,
            //    type       : "images",
            //    perpage    : 5,
            //    moreButton : true,
            //    width      : "100px",
            //}).render().el));

            //USERS LIST
            // if(manager.views.main.users_rec_dic[this.project_render.get('id')]){
            //     var users_id = manager.views.main.users_rec_dic[this.project_render.get('id')]
            //     var users_list = [];
            //     users_id.forEach(function(id){
            //         users_list.push(global.collections.Users.get(id));
            //     })
                $(this.el).append(new usersList.Views.Main({
                    users : api.getUserPermissionByProject(global.collections.Permissions,global.collections.Users,this.project_render.get('id')),
                    project : _this.project_render,
                }).render().el);
            // }

            //Reports 
            $(_this.el).append(new reportsList.Views.Main({
                project : this.project_render,
                reports : _this.reports.where({project_id: _this.project_render.get('id')})
            }).render().el);

            //ACTIVITIES
            $(_this.el).append(new activitiesList.Views.Main({
                model           : this.project_render,
            }).render().el);
            
            //FOOTER
            $(_this.el).append(this.template_footer({project:this.project_render.toJSON()}));
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
    },
    events : {
        "keyup .search" : "search",
        "click .newProject" : "newProject",
        "click .removeProject" : "removeProject",
    },
    newProject : function(e){
        e.preventDefault();
        var id = guid();
        new_project = new global.Models.ProjectModel({
            id:id,
            author : this.user,
            title: $("#project_title").val(),
            date: getDate(),
            date2:new Date().getTime(),
            image:"",
            backup:false,
            project:id
            //description : $("#project_description").val(),
            //kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
            //cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
        });
        new_project.save();
        this.projects.add(new_project);
    },

    removeProject : function (e){
        e.preventDefault();
        var _this = this;
        swal({   
            title: "Are you sure?",   
            text: "Remove the project and all its data, would you continue?",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, delete it!",   
            closeOnConfirm: true,
            allowOutsideClick : true
        }, 
        function(){   
            project_id = e.target.getAttribute("data-id-project");
            project = _this.projects.get(project_id);
            project.destroy();
        });
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
        this.users_rec_dic = global.Functions.getProjectsUsersDictionary(this.projects,this.permissions);
        $(this.el).html('');
        // Search bar
        // $(this.el).append(this.template_search());
        // Projects
        $(this.el).append(new manager.Views.Projects({
            id              : "categories_grid",
            className       : "expand gridalicious large-4 small-4 medium-4 columns",
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
            className       : "large-8 medium-8 small-8 columns",
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