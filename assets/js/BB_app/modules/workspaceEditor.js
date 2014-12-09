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
        this.mode = json.mode;
        // Events
        // Templates
        this.template = _.template($('#workspaceEditor-template').html());
    },
    events : {
        "click .updateWorkspace" : "updateWorkspace"
    },
    updateWorkspace : function(e){
        e.preventDefault();
        var title = $('#workspaceEditor_title').val();
        var content = CKEDITOR.instances.editor.getData();
        console.log(title,content)
        this.workspace.save({
            title:title,
            content:content,
            date: getDate(),
            date2:new Date().getTime()
        });
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
