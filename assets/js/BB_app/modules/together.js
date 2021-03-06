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
  ////////////////////////////
  // Parameters
  
  // Constructor
  init: function (mode, filter) {
    this.views.main = new this.Views.Main({
      el              : "#togetherjs-dock",
      project         : global.models.currentProject,
      user            : global.models.current_user,
      users           : global.collections.Project_users,
      eventAggregator : global.eventAggregator
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
together.Views.Main = Backbone.View.extend({
    initialize : function(json){
      _.bindAll(this, 'render');
      together.views.main = this;
      // Variables
      this.project         = json.project;
      this.user            = json.user;
      this.users           = json.users;
      this.eventAggregator = json.eventAggregator;
      this.cursor_mode     = false;
      this.pathname        = window.location.pathname;
      // Conditions
      this.user.save({
        location : this.pathname,
        project  : this.project.get('id')
      });
      
      if(global.displayCursor == true){
        if(this.pathname == "/bbmap") this.cursor_mode = true;
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
      } 
      
      // Events

      // Templates

    },
    events : {},
    render : function(){
      // Init
      var _this = this;
      $(this.el).empty();
      this.users.each(function(user){
        if(user.get('id') != _this.user.get('id')){
          $(_this.el).append(new together.Views.User({
            user : user,
            project : _this.project
          }).render().el);
        }
      });

      return this;
    }
});
/////////////////////////////////////////////////
together.Views.User = Backbone.View.extend({
    initialize : function(json){
      _.bindAll(this, 'render');
      // Variables
      this.user = json.user;
      this.project = json.project;
      // Events
      if(global.displayCursor == true) this.listenTo(this.user,"change:top change:left", this.updateCursor,this);
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
      //console.log(this.user.get('location'))
      if(this.user.get('location') == together.views.main.pathname){
        // Si l'utilisateur est sur la mm page
        $("#avatar"+this.user.get('id')).show('slow');
        ///////////////////////////
        // Cursor
        if((together.views.main.cursor_mode == true)&&(this.user.get('project') == this.project.get('id'))){
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
        $("body").append("<span id='cursor"+this.user.get('id')+"'' style='display:none;position:absolute;'><div class='cursor'></div>"+this.user.get('name')+"</span>")
        $(this.el).append(this.template_user({user : this.user.toJSON()}))
        return this;
    }
});
/////////////////////////////////////////////////