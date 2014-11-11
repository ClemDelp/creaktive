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
        //Listeners
        this.user.on("change", this.render);
        // Templates
        this.template = _.template($('#editProfile-profile-template').html());
    },
    events : {
      "click .changeAvatar" : "changeAvatar",
      "click .editInfo" : "editInfo",
      "click .updatePassword" : "updatePassword"
    },
    updatePassword : function(e){
      e.preventDefault();
      $.post("/user/changepassword", {
        oldpassword : $('#oldpassword').val(),
        password : $('#password').val(),
        confirmPassword : $('#confirmPassword').val()
      }, function(data){
        console.log(data)
        var n = {
          wrapper:document.body,
          message:'<p>'+data+'</p>',
          layout:'growl',
          effect:'slide',
          type:'success',
          ttl:2000,
          archiveButton:false
        }    
        nlib.simplePush(n);
      });

    },
    editInfo : function(e){
      e.preventDefault();
      this.user.save({
        email : $('#email').val(),
        name : $('#username').val()
      }, {
        success : function(){
          var n = {
            wrapper:document.body,
            message:'<p>Profile updated</p>',
            layout:'growl',
            effect:'slide',
            type:'success',
            ttl:2000,
            archiveButton:false
          }    
          nlib.simplePush(n);
        }
      });

    },
    changeAvatar : function(e){
      e.preventDefault();
      this.user.save({
        img : e.target.getAttribute("data-img-src") 
      }, {
        success : function(){
          var n = {
            wrapper:document.body,
            message:'<p>Avatar updated</p>',
            layout:'growl',
            effect:'slide',
            type:'success',
            ttl:2000,
            archiveButton:false
          }    
          nlib.simplePush(n);
        }
      });
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({user : this.user.toJSON()}));
        return this;
    }
});
/////////////////////////////////////////////////
