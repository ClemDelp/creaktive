/////////////////////////////////////////////////
var workspaceEditor = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator : global.eventAggregator,
  init: function (json) {
    this.workspaces = new global.Collections.ProjectsCollection();
    this.workspaces.comparator = "createdAt"
    this.workspaces.fetch({reset : true, data:{project : global.models.currentProject.get('project')}})

    this.views.main = new workspaceEditor.Views.Main({
        el : json.el,
        workspace : global.models.currentProject,
        mode : json.mode
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
workspaceEditor.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.workspace = json.workspace;
        this.mode = json.mode;
        this.workspaces = workspaceEditor.workspaces;
        // Events   
        this.listenTo(this.workspaces,'reset',this.render,this);
        this.listenTo(this.workspaces,'add',this.render,this);
        this.listenTo(this.workspaces,'remove',this.render,this);
        // Templates
        this.backup_template = _.template($('#backup-template').html());
        this.template = _.template($('#workspaceEditor-template').html());
    },
    events : {
        "click .updateWorkspace" : "updateWorkspace",
        "click .removeWorkspace" : "removeWorkspace",
        "click .createBranch" : "createBranch",
        "click .switch" : "switchBranch",
        "click .convert" : "convertInProject",
        "change #wk_visibility" : "updateWorkspace"
    },
    removeWorkspace : function(e){
      e.preventDefault();
      var _this = this;
      swal({   
          title: "Are you sure?",   
          text: "Remove the workspace and all its data, would you continue?",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes, delete it!",   
          closeOnConfirm: true,
          allowOutsideClick : true
      }, 
      function(){   
        global.models.currentProject.destroy();
          window.location.href = "/";
      });
    },
    updateWorkspace : function(e){
        e.preventDefault();
        var title = $('#workspaceEditor_title').val();
        var content = $('.ckeditor2').val();
        var visibility = $('#wk_visibility').val();
        console.log(title,content)
        this.workspace.save({
            title:title,
            content:content,
            status : visibility,
            date: getDate(),
            date2:new Date().getTime()
        });
        window.location.href = "/bbmap?projectId="+this.workspace.id;
    },
    convertInProject : function(e){
      e.preventDefault();
      $.post("/project/createFromNode", {
        node_id : workspaceEditor.views.main.workspace.get('id'),
        title : workspaceEditor.views.main.workspace.get('title'),
        content : workspaceEditor.views.main.workspace.get('content'),
        project : workspaceEditor.views.main.workspace.get('id'),
      }, function(data){
        if(data.err) alert(data.err);
        else window.location.href = "/bbmap?projectId="+data.id;
      });
    },
    switchBranch : function(e){
      e.preventDefault();
      var node_id = e.target.getAttribute("data-node-id");
      $.post("/project/loadnode", {
        node_id : node_id,
        project : workspaceEditor.views.main.workspace.get('id'),
      }, function(data){
        document.location.replace("/bbmap?projectId="+data.id)
      });
    },
    createBranch : function(e){
      e.preventDefault();
      var _this = this;
      var name = $('#workspaceEditor_name').val();
      var description = $('#workspaceEditor_description').val();

      socket.post("/project/createNode", {
        id_father : workspaceEditor.views.main.workspace.get('id'),
        node_name : name,
        node_description : description,
        project : workspaceEditor.views.main.workspace.get('id'),
      }, function(data){
        if(data.err) alert(data.err);
        else _this.workspaces.add(data);
      });
    },
    render : function(){        
      var _this = this;
      $(this.el).empty();
      // Edit
      $(this.el).append(this.template({
        workspace : this.workspace.toJSON(),
        mode : this.mode
      }));
      // Versionning
      this.workspaces.each(function(node){
        $(_this.el).append(_this.backup_template({
          workspace : _this.workspace.toJSON(),
          node : node.toJSON(),
          currentNode : workspaceEditor.views.main.workspace.get('id')
        }))
      });

      $(document).foundation();
      return this;
    }
});
/////////////////////////////////////////////////
