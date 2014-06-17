/////////////////////////////////////////////////
var editProfile = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({
      el    : "#editProfile_container",
      user  : global.models.current_user
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
editProfile.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        // Variables
        this.user = json.user;
        // Templates
        this.template = _.template($('#editProfile-profile-template').html());
    },
    events : {},
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({user : this.user.toJSON()}));
        return this;
    }
});
/////////////////////////////////////////////////
