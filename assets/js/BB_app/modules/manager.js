/***********************************************/
manager.Views.Permission = Backbone.View.extend({
    tagName : "tr",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.permission = json.permission;
        this.project = json.project;
        this.template = _.template($('#permission-template').html());            
    },

    render : function() {
        $(this.el).html("");
        group_el = this.el;
        var renderedContent = this.template({permission: this.permission, project : this.project});
        $(group_el).append(renderedContent);

        return this;
    }
});
/***********************************************/
manager.Views.PermissionTable = Backbone.View.extend({
    tagName : "table",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.project = json.project;

        this.template = _.template($('#permissionTable-template').html());            
    },

    render : function() {
        __this = this;
        $(this.el).html("");
        permissionTable_el = this.el;
        var renderedContent = this.template();
        $(permissionTable_el).append(renderedContent);

        _.each(this.project.get('permissions'), function(permission){
            permission_ = new manager.Views.Permission({
                permission : permission,
                project : __this.project
            });
            $(permissionTable_el).append(permission_.render().el)
        });

        return this;
    }
});
/***********************************************/
manager.Views.Project = Backbone.View.extend({
    tagName : "div",
    className : "panel",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.project = json.project
        this.project.bind("change", this.render);
        this.project.bind("destroy", this.render);

        this.groups = json.groups;

        this.template = _.template($('#project-template').html());            
    },

    render : function() {
        $(this.el).html("");
        project_el = this.el;
        var renderedContent = this.template({project: this.project.toJSON(), groups : this.groups.toJSON()});
        $(project_el).append(renderedContent);

        permissionTable_ = new manager.Views.PermissionTable({
            project : this.project,
        });
        $(project_el).append(permissionTable_.render().el);
        $(project_el).append("<a href='#' data-project-id='"+this.project.id+"' class='button tiny alert removeProject'>Remove Project</a>");
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Projects = Backbone.View.extend({
    tagName : "div",
    className :"content",
    id :"panel-1",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.projects = json.projects;
        this.groups = json.groups;
  
        this.template = _.template($('#projects-template').html());            
    },

    events : {
        "click .removeProject" : "removeProject",
        "click .addProject" : "addProject",
        "click .removePermission" : "removePermission",
        "click .addPermission" : "addPermission"
    },

    addPermission : function(e){
        console.log("Add a permission");
        project_id = e.target.getAttribute("data-project-id");
        group_id = e.target.getAttribute("data-group-id");
        right = $("#permission_right").val();
        socket.post('/project/createPermission', {group_id : group_id, project_id : project_id, right : right});
        
        // _.each(this.groups.get(project_id).get('users'), function (user){
        //     this.projects.get("permissions").unshift({right : right, user : user})
        // })
        
        global.collections.Projects.fetch();

    },
    removePermission : function(e){
        console.log("Remove a permission");
        _this = this;
        project_id = e.target.getAttribute("data-project-id");
        user_id = e.target.getAttribute("data-user-id");
        socket.post('/project/removePermission', {user_id : user_id, project_id : project_id});
        
        global.collections.Projects.fetch();
  
    },

    addProject : function (e){
        console.log("Add a new project");
        this.projects.create({
            id:guid(),
            title: $("#project_title").val(),
            description : $("#project_description").val(),
            kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
            cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}],
        });
    },

    removeProject : function (e){
        console.log("Remove project");
        project_id = e.target.getAttribute("data-project-id");
        project = this.projects.get(project_id);
        this.projects.remove(project).destroy();
    },

    render : function() {
        _this = this;
        $(this.el).html("");
        var renderedContent = this.template();
        $(this.el).append(renderedContent);

        this.projects.each(function (project){
            project_ = new manager.Views.Project({
                project : project,
                groups : _this.groups
            })
            $(_this.el).append(project_.render().el);
        });


        return this;
    }
});
/***********************************************/
manager.Views.UserGroup = Backbone.View.extend({
    tagName : "tr",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.user = json.user;
        this.group = json.group;
        this.template = _.template($('#userGroup-template').html());            
    },

    render : function() {
        $(this.el).html("");
        group_el = this.el;
        var renderedContent = this.template({user: this.user, group : this.group});
        $(group_el).append(renderedContent);

        return this;
    }
});
/***********************************************/
manager.Views.UserGroupTable = Backbone.View.extend({
    tagName : "table",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.users = json.users;
        this.group = json.group;

        this.template = _.template($('#userGroupTable-template').html());            
    },

    render : function() {
        __this = this;
        $(this.el).html("");
        userGroupTable_el = this.el;
        var renderedContent = this.template();
        $(userGroupTable_el).append(renderedContent);

        _.each(this.users, function(user){
            userGroup_ = new manager.Views.UserGroup({
                user : user,
                group : __this.group
            })
            $(userGroupTable_el).append(userGroup_.render().el)
        })

        return this;
    }
});
/***********************************************/
manager.Views.Group = Backbone.View.extend({
    tagName : "div",
    className : "panel",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.group = json.g;
        this.group.bind("change", this.render);
        this.group.bind("destroy", this.render);
        this.users = json.users;
        this.template = _.template($('#group-template').html());            
    },

    render : function() {
        $(this.el).html("");
        group_el = this.el;
        var renderedContent = this.template({group: this.group.toJSON(), users : this.users.toJSON()});
        $(group_el).append(renderedContent);

        userGroupTable_ = new manager.Views.UserGroupTable({
            users : this.group.get('users'),
            group : this.group
        });
        $(group_el).append(userGroupTable_.render().el);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
manager.Views.Groups = Backbone.View.extend({
    tagName : "div",
    className :"content",
    id :"panel-2",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.users = json.users;
        this.groups = json.groups;
  
        this.template = _.template($('#groups-template').html());            
    },

    events : {
        "click .removeGroup" : "removeGroup",
        "click .addGroup" : "addGroup",
        "click .removeFromGroup" : "removeFromGroup",
        "click .addToGroup" : "addToGroup"

    },
    addToGroup : function(e){
        console.log("Add a user to a group");
        group_id = e.target.getAttribute("data-group-id");
        user_id = e.target.getAttribute("data-user-id");
        socket.post('/group/addUserToGroup', {user_id : user_id, group_id : group_id});
        group = this.groups.get(group_id);
        user = this.users.get(user_id).toJSON();
        group_users = group.get('users');
        group_users.unshift(user);
        group.trigger("change", group);
    },
    removeFromGroup : function(e){
        console.log("Remove a User from a group");
        _this = this;
        user_id = e.target.getAttribute("data-user-id");
        group_id = e.target.getAttribute("data-group-id");
        socket.post('/group/removeUserFromGroup', {user_id : user_id, group_id : group_id});
        group = this.groups.get(group_id);
        group.set({users: _.reject(group.get('users'), function(num){ if(num.id === user_id) return num; }) });
       
    },
    removeGroup : function(e){
        console.log("Remove a group");
        group_id = e.target.getAttribute("data-group-id");
        group = this.groups.get(group_id);
        this.groups.remove(group).destroy();
    },
    addGroup : function(e){
        console.log("Add a new group");
        this.groups.create({
            id: guid(),
            title : $("#groups_view_title").val(),
        });
    },

    render : function() {
        _this = this;
        $(this.el).html("");
        var renderedContent = this.template();
        $(this.el).append(renderedContent);

        this.groups.each(function(group){
            group_ = new manager.Views.Group({
                g : group,
                users : _this.users
            });
            $(_this.el).append(group_.render().el);
        })

        return this;
    }
});
/***********************************************/
manager.Views.User = Backbone.View.extend({
    tagName : "tr",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.user = json.user;
        this.template = _.template($("#user-template").html());             
    },
    render : function() {    
        user_el = this.el
        var renderedContent = this.template({
            user : this.user.toJSON()
        })
        $(user_el).append(renderedContent);
        return this;
    }
});
/***********************************************/
manager.Views.UsersTable = Backbone.View.extend({
    tagName : "table",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.users = json.users; 
        this.template = _.template($("#usersTable-template").html());              
    },
    render : function() { 
        var renderedContent = this.template();    
        $(this.el).append(renderedContent);
        _this = this;
        this.users.each(function(user){
            user_ = new manager.Views.User({
                user : user
            });
            $(_this.el).append(user_.render().el);
        })
        return this;
    }
});

/***********************************************/
manager.Views.Users = Backbone.View.extend({
    tagName : "div",
    className : "content",
    id :"panel-3",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Params
        this.users = json.users;   
        this.template = _.template($('#users-template').html());    
    },
    events : {
        "click .remove" : "removeUser",
        "click .addUser" : "addUser",
    },
    addUser : function(e){
        console.log("Add user");
        this.users.create({
            id : guid(),
            img : "/img/default-user-icon-profile.png",
            name : $("#users_view_name").val(),
            email : $("#users_view_email").val(),
            pw : $("#users_view_pw").val(),
            color : $("#users_view_color").val(),
        });
        
    },
    removeUser : function(e){
        console.log("Remove a user");
        user_id = e.target.getAttribute("data-id-user");
        user = this.users.get(user_id);
        this.users.remove(user).destroy();

    },
    render : function() {
        $(this.el).html("");
        var renderedContent = this.template();
        $(this.el).append(renderedContent);
        usersTable_ = new manager.Views.UsersTable({
            users : this.users
        });
        $(this.el).append(usersTable_.render().el);
        return this;
    }
});

manager.Views.TabsContent = Backbone.View.extend({
    tagName : "div",
    className : "tabs-content vertical",
    initialize : function(json){
        _.bindAll(this, 'render');

        // Params
        this.users = json.users;
        this.groups = json.groups;
        this.projects = json.projects

    }, 
    render : function(){
        users_ = new manager.Views.Users({
            users : this.users
        });
        $(this.el).append(users_.render().el);

        groups_ = new manager.Views.Groups({
            users : this.users,
            groups : this.groups,  
        })
        $(this.el).append(groups_.render().el);


        projects_ = new manager.Views.Projects({
            projects : this.projects,
            groups : this.groups 
        })
        $(this.el).append(projects_.render().el);

        return this;
    }

})

/***********************************************/
manager.Views.Main = Backbone.View.extend({
    el : $("#manager-container"),
    initialize : function(json) {
        _.bindAll(this, 'render');

        // Params
        this.users = json.users;
        this.users.bind("add", this.render);
        this.users.bind("remove", this.render);
        this.users.bind("reset", this.render); 

        this.groups = json.groups;
        this.groups.bind("add", this.render);
        this.groups.bind("remove", this.render);
        this.groups.bind("reset", this.render); 

        this.projects = json.projects;
        this.projects.bind("add", this.render);
        this.projects.bind("remove", this.render);
        this.projects.bind("reset", this.render); 

        this.template = _.template($('#manager-template').html());   
   
    },
    render : function() {
        var renderedContent = this.template();
        $(this.el).html(renderedContent);

        tabsContent = new manager.Views.TabsContent({
            users : this.users,
            groups : this.groups,
            projects : this.projects
        });
        $(this.el).append(tabsContent.render().el);

        $(document).foundation();
        return this;
    }
});