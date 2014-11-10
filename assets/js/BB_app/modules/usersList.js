/////////////////////////////////////////////////
var usersList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
usersList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.userPerms = json.users; //users hav to be [{user json,permission json},{user json,permission json},...]
        this.project = json.project;
        // Templates
        this.template = _.template($('#usersList-template').html());
    },
    render : function(){        
        ///////////////////////
        // init
        $(this.el).empty();
        $(this.el).append(this.template({userPerms : this.userPerms,project : this.project.toJSON()}));
        return this;
    }
});
/////////////////////////////////////////////////
