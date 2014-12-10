/////////////////////////////////////////////////
var workspacesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new workspacesList.Views.Main({
        el : json.el,
        user : global.models.current_user,
        display : json.display,
        projects : global.collections.Projects,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
workspacesList.Views.Main = Backbone.View.extend({

    initialize : function(json) {
        _.bindAll(this, 'render');

        ////////////////////////////
        this.user = json.user;
        this.workspaces = json.projects;
        this.json_worspaces = {};
        this.filterWorlspaces(this.workspaces);
        this.display = json.display;
        // Events
        // Templates
        this.template_search = _.template($('#workspacesList-search-template').html());
        this.template_manager = _.template($('#workspacesList-template').html());
        this.template_list = _.template($('#workspacesList-list-template').html());
    },
    events : {
        "keyup .search" : "search",
        "click #wks_create" : "newWorkspace",
        "click .starred" : "starred",
        "click .unstarred" : "unstarred",
    },
    search : function(e){
        e.preventDefault();
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.workspaces.each(function(p){
            if(research.toLowerCase() == p.get('title').substr(0,research_size).toLowerCase()){
                matched.add(p);
            }
        });
        this.filterWorlspaces(matched);
        this.render_workspaces(this.json_worspaces);
    },
    starred : function(e){
        e.preventDefault();
        var id = e.target.getAttribute("data-id");
        this.workspaces.get(id).save({starred : true});
        this.filterWorlspaces(this.workspaces)
        this.render();
    },
    unstarred : function(e){
        e.preventDefault();
        var id = e.target.getAttribute("data-id");
        this.workspaces.get(id).save({starred : false});
        this.filterWorlspaces(this.workspaces)        
        this.render();
    },
    newWorkspace : function(e){
        e.preventDefault();
        console.log(this)
        var title = $('#wks_title').val();
        var description = $('#wks_description').val();
        var organisation = $('#wks_organisation').val();
        var visibility = $('#wks_visibility').val();
        if(title != ""){
            var id = guid();
            new_workspace = new global.Models.ProjectModel({
                id:id,
                author : this.user,
                title: title,
                date: getDate(),
                date2:new Date().getTime(),
                image:"",
                content : description,
                backup:false,
                project:id,
                status : visibility
                //description : $("#project_description").val(),
                //kLabels : [{color : "#27AE60", label:"Validated"},  {color : "#F39C12", label:"Processing"}, {color : "#C0392B", label:"Missing"}],
                //cLabels : [{color : "#27AE60", label:"Known"}, {color : "#F39C12", label:"Reachable"}, {color : "#C0392B", label:"Alternative"}]
            });
            new_workspace.save();
            this.workspaces.add(new_workspace);
            this.filterWorlspaces(this.workspaces);
            this.render()
        }else{
            $('.alertBox').html('<div data-alert class="alert-box alert radius">Problem : title<a href="#" class="close">&times;</a></div>')
        }
    },
    filterWorlspaces : function(workspaces){
        this.json_worspaces = {"starred":[],"my":[]};
        var _this = this;
        workspaces.each(function(workspace){
            if(workspace.get('starred')) _this.json_worspaces.starred.unshift(workspace.toJSON());
            else _this.json_worspaces.my.unshift(workspace.toJSON());
        });
        this.starredWorkspaces = this.json_worspaces.starred;
        this.myWorkspaces = this.json_worspaces.my;
    },
    render_workspaces : function(json){
        if(this.display == "list"){
            $('.workspaces_container_list').remove();
            $(this.el).append(this.template_list({title:"Starred workspaces",workspaces : json.starred ,newButton : false,starred : true}))
            $(this.el).append(this.template_list({title:"My workspaces",workspaces : json.my,newButton : false,starred : false}))
        }else{
            $('.workspaces_container').remove();
            $(this.el).append(this.template_manager({title:"Starred workspaces",workspaces : json.starred,newButton : false,starred : true}))
            $(this.el).append(this.template_manager({title:"My workspaces",workspaces : json.my ,newButton : true,starred : false}))
            $(".workspaces_container").gridalicious({width: 300});
        }
        $(document).foundation();
        
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_search());
        this.render_workspaces(this.json_worspaces);
        
        return this;
    }
});
/////////////////////////////////////////////////
