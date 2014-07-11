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
        this.users = new Backbone.Collection(json.users);
        this.project = json.project
        // Templates
        this.template = _.template($('#usersList-template').html());
    },
    render : function(){        
        ///////////////////////
        // init
        var _this = this;
        $(this.el).empty();
        $(this.el).append(this.template({users : this.users.toJSON(), project : this.project.toJSON()}));
        return this;
    }
});
/////////////////////////////////////////////////
