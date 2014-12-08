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
        this.workspaces = json.projects;
        var json_ws = this.filterWorlspaces(this.workspaces);
        this.staredWorkspaces = json_ws.starred;
        this.myWorkspaces = json_ws.my;
        // Events
        // Templates
        this.template_search = _.template($('#workspacesList-search-template').html());
        this.template_workspaces = _.template($('#workspacesList-template').html());
    },
    events : {
        "click #wks_create" : "newWorkspace",
    },
    newWorkspace : function(e){
        e.preventDefault();
        console.log(this)
        var title = $('#wks_title').val();
        var description = $('#wks_description').val();
        var organisation = $('#wks_organisation').val();
        var visibility = $('#wks_viibility').val();
        if(title != ""){
            alert('ok')
            this.render()
        }else{
            $('.alertBox').html('<div data-alert class="alert-box alert radius">Problem : title<a href="#" class="close">&times;</a></div>')
        }
    },
    filterWorlspaces : function(workspaces){
        var json = {"starred":[],"my":[]};
        workspaces.each(function(workspace){
            if(workspaces.starred) json.starred.unshift(workspace.toJSON());
            else json.my.unshift(workspace.toJSON());
        });
        return json;
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_search())
        $(this.el).append(this.template_workspaces({title:"Starred workspaces",workspaces : this.staredWorkspaces,newButton : false,starred : true}))
        $(this.el).append(this.template_workspaces({title:"My workspaces",workspaces : this.myWorkspaces,newButton : true,starred : false}))

        $(".workspaces_container").gridalicious({width: 300});
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
