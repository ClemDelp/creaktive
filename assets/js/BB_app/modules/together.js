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
      this.listenTo(this.user,"change:online", this.updateStatus,this);
      // Templates
      this.template_user = _.template($('#together-user-template').html());
    },
    events : {},
    updateCursor : function(){
      $("#avatar"+this.user.get('id')).show('slow');
      $("#cursor"+this.user.get('id')).show('slow');
      var styles = {
          'left': this.user.get('left') +'px',
          'top':  this.user.get('top')  + 'px',
          'z-index' : '9999999999'
      };
      $("#cursor"+this.user.get('id')).css( styles );
    },
    updateStatus : function(){
      alert('close');
      $("#avatar"+this.user.get('id')).hide('slow');
      $("#cursor"+this.user.get('id')).hide('slow');
    },
    render : function(){
        $(this.el).empty();
        $("body").append("<span id='cursor"+this.user.get('id')+"' style='display:none;position:absolute;'>"+this.user.get('name')+"</span>")
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
        if(rec%10 == 0){
          var clientX = event.clientX;
          var clientY = event.clientY ;
          together.views.main.user.save({
            top:  clientY,
            left: clientX
          });
        }
        rec = rec + 1;
      });
      // this.user.set({status : "online"}).save();
      // ifvisible.setIdleDuration(10);
      // ifvisible.idle(function(){
      //   // This code will work when page goes into idle status
      //   console.log('you are offline')
      //   together.views.main.user.set({status : "offline"}).save();
      // });
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
