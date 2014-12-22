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
    this.views.main = new workspaceEditor.Views.Main({
        el : json.el,
        workspace : global.models.currentProject,
        workspaces : global.collections.Projects,
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
        ////////////////////////////
        this.workspace = json.workspace;
        this.workspaces = json.workspaces;
        this.mode = json.mode;
        // Events
        // Templates
        this.template = _.template($('#workspaceEditor-template').html());
    },
    events : {
        "click .updateWorkspace" : "updateWorkspace",
        "click .removeWorkspace" : "removeWorkspace"
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
        console.log(_this.workspaces)
          project_id = _this.workspace.get('id');
          project = _this.workspaces.get(project_id);
          project.destroy();
          window.location.href = "/";
      });
    },
    updateWorkspace : function(e){
        e.preventDefault();
        var title = $('#workspaceEditor_title').val();
        var content = CKEDITOR.instances.editor.getData();
        var visibility = $('#wk_visibility').val();
        console.log(title,content)
        this.workspace.save({
            title:title,
            content:content,
            status : visibility,
            date: getDate(),
            date2:new Date().getTime()
        });
        window.location.href = "/";
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template({workspace : this.workspace.toJSON(),mode : this.mode}));
        if(this.mode == "edit"){
            CKEDITOR.replaceAll('ckeditor2');
            CKEDITOR.config.toolbar = [
               ['Bold','Italic','Underline','NumberedList','BulletedList','Image','Link','TextColor']
            ];       
        }
        
        return this;
    }
});
/////////////////////////////////////////////////
