var backup = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (project_) {
    /*Init*/
    this.NodesCollection = new global.Collections.ProjectsCollection();
    this.NodesCollection.comparator = "createdAt"
    this.NodesCollection.fetch({reset : true, data:{project : global.models.currentProject.get('project')}})
    this.views.Main = new this.Views.Main({
      eventAggregator : global.eventAggregator
    });  
  }
};


/////////////////////////////////////////
// Main
/////////////////////////////////////////
backup.Views.Main = Backbone.View.extend({
    el:"#backup_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.nodesCollection = backup.NodesCollection;
        this.eventAggregator    = json.eventAggregator;

        // Events   
        this.listenTo(this.nodesCollection,'reset',this.render,this);
        this.listenTo(this.nodesCollection,'add',this.render,this);
        this.listenTo(this.nodesCollection,'remove',this.render,this);

        // Templates
        this.backup_template = _.template($('#backup-template').html());
    },
    events : {
      "click .createBranch" : "createBranch",
      "click .switch" : "switchBranch",
      "click .deleteBranch" : "deleteBranch",
      "click .convert" : "convertInProject"
    },
    deleteBranch : function(e){
      e.preventDefault();
      var node_id = e.target.getAttribute("data-node-id");
      var r = confirm("Are you sure you want to delete this branch ?");
      if (r == true) {
        $.post("/project/deleteBranch", {node_id : node_id}, function(data){
          _this.nodesCollection.remove(_this.nodesCollection.get(node_id));
        })
      }

    },
    convertInProject : function(e){
      e.preventDefault();
      _this = this;
      var node_id = e.target.getAttribute("data-node-id");
      var name = $('#projectname' + node_id).val();
      var description = $('#projectdescription' + node_id).val();
      $.post("/project/createFromNode", {
        node_id : node_id,
        title : name,
        content : description,
      }, function(data){
        alert("Project "+ data.title + " created")
      });
    },
    switchBranch : function(e){
      e.preventDefault();
      var node_id = e.target.getAttribute("data-node-id");
      $.post("/project/loadnode", {node_id : node_id}, function(data){
        document.location.replace("/backup?projectId="+data.id)
      })
    },
    createBranch : function(e){
      e.preventDefault();
      _this = this;
      var node_id = e.target.getAttribute("data-node-id")
      var name = $('#name' + node_id).val();
      var description = $('#description' + node_id).val();

      $.post("/project/createNode", {
        id_father : node_id,
        node_name : name,
        node_description : description
      }, function(data){
        _this.nodesCollection.add(data);
        //document.location.replace("/backup?projectId="+data.id)
      });

    },
    render : function(){
      _this = this;
      $(this.el).html("");
      this.nodesCollection.each(function(node){
        $(_this.el).append(_this.backup_template({
          node : node.toJSON(),
          currentNode : global.models.currentProject.get('id')
        }))
      });

      $(document).foundation();
      return this;
        
    }
});