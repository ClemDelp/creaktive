/////////////////////////////////////////////////////////////////////
/*-----------------------------------------------------------------*/
/*Views*/
/*-----------------------------------------------------------------*/
/////////////////////////////////////////////////////////////////////
manager.Views.User_view = Backbone.View.extend({
    initialize : function() {
        console.log("User view initialise");
        this.template = _.template($('#user-template').html());
    },
    render : function() {
        var renderedContent = this.template({user:this.model.toJSON()});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Users_view = Backbone.View.extend({
    tagName : "tr",
    el : $('#users-container'),
    initialize : function() {
        console.log("users view initialise");
        _.bindAll(this, 'render');
        /*Users*/
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.template = _.template($('#users-template').html());
    },
    events : {
        "click .remove" : "removeUser",
        "click .add" : "addUser",
    },
    addUser : function(e){
        console.log("Add user");
        _this = this;
        new_user = new global.Models.User({
            id : guid(),
            name : $("#users_view_name").val(),
            email : $("#users_view_email").val(),
            pw : $("#users_view_pw").val(),
            color : $("#users_view_color").val(),
        });
        new_user.save(null,{
            success : function(model){
                new_user.id = model.id;
                _this.collection.add([new_user]);
            }
        });
        
    },
    removeUser : function(e){
        console.log("Remove a user");
        user_id = e.target.getAttribute("data-id-user");
        this.collection.get(user_id).destroy();
    },
    render : function() {
        list_users_html = [];
        this.collection.each(function(user){
            user_view = new manager.Views.User_view({model:user});
            this.list_users_html.unshift(user_view.render().$el.html());
        });
        var renderedContent = this.template({users:list_users_html});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Group_view = Backbone.View.extend({
    initialize : function(json) {
        console.log("group view initialise");
        this.template = _.template($('#group-template').html());
        this.userGroups = json.userGroups
    },
    render : function() {
        _this = this;
        this.model.set({users :  []});
        _.each(_this.userGroups, function(ug){
            _this.model.get('users').unshift(_this.collection.get(ug.user_id))
        })
        var renderedContent = this.template({
            group:_this.model.toJSON(),
            users:_this.collection.toJSON(),
        });
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Groups_view = Backbone.View.extend({
    el : $('#groups-container'),
    initialize : function(json) {
        console.log("groups view initialise");
        _.bindAll(this, 'render');
        /*Variables*/
        this.users = json.users;
        this.userGroups = json.userGroups;
        /*Groups*/
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        /*Users*/
        this.users.bind('reset', this.render);
        this.users.bind('add', this.render);
        this.users.bind('remove', this.render);
        /*Users*/
        this.userGroups.bind('reset', this.render);
        this.userGroups.bind('add', this.render);
        this.userGroups.bind('remove', this.render);
       


        /*Template*/
        this.template = _.template($('#groups-template').html());
    },
    events : {
        "click .remove" : "removeGroup",
        "click .new" : "newGroup",
        "click .add" : "addUser",
    },
    addUser : function(e){
        console.log("Add a new User to the group");
        group_id = e.target.getAttribute("data-id-group");
        user_id = $('#'+group_id+'_user_selected').val();
        this.userGroups.create({
            id : guid(),
            group_id : group_id,
            user_id : user_id
        },{wait:true});

        this.render();
    },
    removeGroup : function(e){
        console.log("Remove a group");
        group_id = e.target.getAttribute("data-id-group");
        this.collection.get(group_id).destroy();
    },
    newGroup : function(e){
        console.log("Add a new group");
        _this = this;
        group_title = $("#groups_view_title").val();
        if(group_title != ""){
            new_group = new global.Models.GroupModel({
                id: guid(),
                title : group_title,
                users : []
            });
            new_group.save(null, {
                success : function(model){
                    _this.collection.add([new_group]);
                }
            });
            
        }else{alert("Group title can't be empty!")}
    },
    render : function() {
        _this = this;
        list_groups_html = [];
        this.collection.each(function(group){
            group_view = new manager.Views.Group_view({
                model:group,
                userGroups : _.where(_this.userGroups.toJSON(), {group_id : group.id}),
                collection:_this.users
            });
            this.list_groups_html.unshift(group_view.render().$el.html());
            //console.log(this.list_groups_html)
            //$(this.el).append(group_view.render().el);
        });
        var renderedContent = this.template({groups:list_groups_html});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Permission_view = Backbone.View.extend({
    initialize : function(json){
        console.log("Permission view initialize");

        _.bindAll(this, 'render');

        this.permission = json.permission;

        this.template = _.template($('#permission-template').html());

    },

    render : function (){
        var renderedContent = this.template({
            permission : this.permission
        })
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;

    } 

});

/***********************************************/
manager.Views.Project_view = Backbone.View.extend({
    initialize : function(json) {
        console.log("Project view initialise");
        _.bindAll(this, 'render');

        this.permissions = json.permissions;
        this.groups = json.groups;
        this.users = json.users;

        this.template = _.template($('#project-template').html());
    },
    render : function() {
        _this=this;
        project_el = this.el;
        var renderedContent = this.template({
            project:this.model.toJSON(),
            groups : this.groups.toJSON(),
        });

        this.permissions.each(function (p){
            perm = {
                user : _this.users.get(p.get('id_user')),
                group : _this.groups.get(p.get('id_group')),
                right : p.right
            }
            permission_view = new manager.Views.Permission_view({permission : perm})
            $(this.project_el).append(permission_view.render().el)
        })


        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});


/***********************************************/
manager.Views.Projects_view = Backbone.View.extend({
    el : $('#projects-container'),
    initialize : function(json) {
        console.log("Projects view initialise");
        _.bindAll(this, 'render');
        /*Projects*/
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        /*Groups*/
        this.groups = json.groups;
        this.groups.bind('reset', this.render);
        this.groups.bind('add', this.render);
        this.groups.bind('remove', this.render);
        /*Permissions*/
        this.permissions = json.permissions;
        this.permissions.bind('reset', this.render);
        this.permissions.bind('add', this.render);
        this.permissions.bind('remove', this.render);
        /*Users*/
        this.users = json.users;
        this.users.bind('reset', this.render);
        this.users.bind('add', this.render);
        this.users.bind('remove', this.render);
        /*Template*/
        this.template = _.template($('#projects-template').html());
    },
    events : {
        "click .remove" : "removeProject",
        "click .new" : "addProject",
        "click .add" : "addPermission"
    },
    addPermission : function(e){
        console.log("Add permission");
        _this = this;
        id_project = e.target.getAttribute("data-id-project");
        id_group = $('#'+id_project+'_group_selected').val();
        right = $('#'+id_project+'_right_selected').val();

        project = _this.collection.get(id_project);

        group = this.groups.get(id_group);
        _.each(group.get('users'), function(u){
            new_permission = new global.Models.PermissionModel({
                id : guid(),
                right : right,
                id_user : u.id,
                id_project : id_project,
                id_group : id_group
            });

            new_permission.save();
        });

        this.render();
    },
    addProject : function(e){
        console.log("Add a new project");
        project_title = $("#projects_view_title").val();
        _this = this;
        if(project_title != ""){
            new_project = new global.Models.ProjectModel({
                id: guid(),
                title : project_title,
            });
            new_project.save(null, {
                success : function(model){
                    _this.collection.add([new_project]); 
                }
            });
            
        }else{alert("Project title can't be empty!")}
    },
    removeProject : function(e){
        console.log("Remove a project");
        project_id = e.target.getAttribute("data-id-project");
        this.collection.get(project_id).destroy();
    },
    render : function() {
        var renderedContent = this.template({
            projects : this.projects
        });
        $(this.el).html(renderedContent);
        var _this = this;
        projects_el = this.el;

        this.collection.each(function(project){
            project_view = new manager.Views.Project_view({
                model:project,
                groups : _this.groups,
                permissions : _this.permissions, /*_.where(_this.permissions, {id_project : project.id})*/
                users : _this.users
            });
            $(this.projects_el).append(project_view.render().el);
        });
        return this;
    }
});
//////////////////////////////////////////////////////////////////
/****************************************************************/
/*Router*/
/****************************************************************/
//////////////////////////////////////////////////////////////////
manager.Router_manager = Backbone.Router.extend({
    routes : {
        "" : "root",
        "done" : "done",
    },
    root : function() { console.log('Welcome');},
    done : function(){console.log('action done');},
});
/****************************************************************/
