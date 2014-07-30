/////////////////////////////////////////////////
var together = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Parameters
  
  // Constructor
  init: function (mode, filter) {
    this.views.main = new this.Views.Main({
      el              : "#togetherjs-dock",
      project         : global.models.currentProject,
      user            : global.models.current_user,
      users           : global.collections.Users,
      eventAggregator : global.eventAggregator
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
together.Views.User = Backbone.View.extend({
    initialize : function(json){
      _.bindAll(this, 'render');
      // Variables
      this.user = json.user;
      // Events
      this.listenTo(this.user,"change:top change:left", this.updateCursor,this);
      // Templates
      this.template_user = _.template($('#together-user-template').html());
    },
    events : {},
    updateCursor : function(){
      alert('cursor is moving')
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template_user({user : this.user.toJSON()}))
        return this;
    }
});
/////////////////////////////////////////////////
together.Views.Main = Backbone.View.extend({
    initialize : function(json){
      _.bindAll(this, 'render');
      // Variables
      this.project         = json.currentProject;
      this.user            = json.user;
      this.users           = json.users;
      this.eventAggregator = json.eventAggregator;
      // Events
      var rec = 0;
      $( "body" ).mousemove(function( event ){
        if(rec%50 == 0){
          var clientX = event.clientX;
          var clientY = event.clientY ;
          // together.views.main.user.save({
          //   top:  clientY,
          //   left: clientX
          // });
        }
        rec = rec + 1;
      });
      // Templates

    },
    events : {},
    render : function(){
      // Init
      var _this = this;
      $(this.el).empty();
      this.users.each(function(user){
        $(_this.el).append(new together.Views.User({user : user}).render().el);
      });

      return this;
    }
});
