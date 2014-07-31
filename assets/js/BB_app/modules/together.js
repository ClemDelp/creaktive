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
      this.listenTo(this.user,"change:location", this.updateLocation,this);
      // Templates
      this.template_user = _.template($('#together-user-template').html());
    },
    events : {},
    updateLocation : function(){
      if(this.user.get('location') != together.views.main.pathname){
        $("#avatar"+this.user.get('id')).hide('slow');
        $("#cursor"+this.user.get('id')).hide('slow');
      }
    },
    updateCursor : function(){
      console.log(this.user.get('location'))
      if(this.user.get('location') == together.views.main.pathname){
        // Si l'utilisateur est sur la mm page
        $("#avatar"+this.user.get('id')).show('slow');
        if(together.views.main.cursor_mode == true){
          // Si la page est /bbmap
          $("#cursor"+this.user.get('id')).show('slow');
          var styles = {
              'left': this.user.get('left') +'px',
              'top':  this.user.get('top')  + 'px',
              'z-index' : '9999999999'
          };
          $("#cursor"+this.user.get('id')).css( styles );
        }
      }
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
      together.views.main = this;
      // Variables
      this.project         = json.currentProject;
      this.user            = json.user;
      this.users           = json.users;
      this.eventAggregator = json.eventAggregator;
      this.cursor_mode     = false;
      this.pathname        = window.location.pathname;
      // Conditions
      this.user.save({location : this.pathname});
      if(this.pathname == "/bbmap") this.cursor_mode = true;
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
