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
  eventAggregator : global.eventAggregator,
  init: function (json) {
    this.views.main = new this.Views.Main({
      el : json.el,
      users : global.collections.Users,
      permissions : global.collections.Permissions,
      mode    : json.mode,
      project : global.models.currentProject
    });
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
usersList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.mode = json.mode;
        this.permissions = json.permissions;
        this.project = json.project;
        this.infos = {
          "init" : "Search for a person in CreaKtive by name or email address, or enter an email address to invite someone new.",
          "email" : "? We don’t know that person. Add a name and click “Send” and we’ll add a virtual member and send them an invite email. They'll automatically receive access to the board once they sign up and confirm their email address.",
          "noResult" : "No results",
        };
        // Templates
        this.template = _.template($('#usersList-template').html());
    },
    events : {
      "keyup .search_members" : "search",
      "click .invite" : "inviteUser",
      "click .addPermission" : "addPermission", 
      "change .changePermission" : "changePermission"
    },
    setMode : function(mode){
      this.mode = mode;
      this.render();
    },
    addPermission : function(e){
      e.preventDefault();
      var user_id_ = e.target.getAttribute('data-id-user');
      var right_ = "rw"; // default value
      var already_exist = this.permissions.findWhere({user_id : user_id_,project_id : this.project.id})
      if((right_ != "u")&&(already_exist == undefined)){
          this.permissions.create({
              id : guid(),
              right : right_,
              user_id : user_id_,
              project_id : this.project.id
          });
          $.post("/user/inviteRegisteredUser", {guest : global.collections.Users.get(user_id_).toJSON(), host: global.models.current_user.toJSON()});
      }else{
        swal("Oups!", "User already linked!", "warning");
      }
      this.render();  
    },
    changePermission : function(e){
      e.preventDefault();
      var _this = this;
      swal({   
          title: "Warning",   
          text: "Are tou sure to perform this action ?",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Yes",   
          closeOnConfirm: true,
          allowOutsideClick : true
      }, 
      function(isConfirm){   
        if (isConfirm) {
          var user_id = e.target.getAttribute('data-id-user');
          var project_id = _this.project.get('id');
          var right_ = $("#"+e.target.getAttribute('data-id-user')+"_right").val();
          if(right_ == "u"){
            var permissions_to_remove = _this.permissions.filter(function(permission){return ((permission.get('project_id') == project_id) && (permission.get('user_id') == user_id))});
            permissions_to_remove.forEach(function(permission){
                permission.destroy();
            });    
          }else if((right_ == "r")||(right_=="rw")||(right_=="admin")){
            var permissions_to_update = _this.permissions.filter(function(permission){return ((permission.get('project_id') == project_id) && (permission.get('user_id') == user_id))});
            permissions_to_update.forEach(function(permission){
                permission.set({"right":right_});
                permission.save();
            });
          }
        } 
        _this.render();
      });
    },
    search: function(e){
        e.preventDefault();
        var el_result = $('#usersList_search_result');
        var el_info = $('#usersList_search_info');
        el_result.html('');
        el_info.html('');
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.users.each(function(c){
          if(research_size>0){
            if(research.toLowerCase() == c.get('name').substr(0,research_size).toLowerCase() ||
                research.toLowerCase() == c.get('email').substr(0,research_size).toLowerCase()){
                matched.add(c);
                el_result.append("<tr><td><img width='30' title='"+c.get('name')+"' src='"+c.get('img')+"'></td><td>"+c.get('name')+"</td><td><a data-id-user='"+c.get('id')+"' href='#' class='button tiny radius success addPermission' style='margin:0px'><b data-id-user='"+c.get('id')+"'>+</b></a></td></tr>")
            }
          }
        });
        if(matched.length == 0){
          if(api.isValidEmailAddress(research)) el_info.html("<b>"+research+"</b>"+this.infos.email+"<br><a href='#' class='button invite small expand radius success'>Send <img title='Send email' src='/img/icones/Sent-Mail-32.png'/></a>");
          else el_info.html(this.infos.noResult);
        }
    },
    inviteUser : function(e){
      e.preventDefault();
      _this = this;
      if(this.users.where({email : $('#research_value').val()}).length > 0 ){
          swal("This user is already registered!", "please select him on the right part of the members page", "warning")
          $('#research_value').val("");
      }else{
        $.post("/user/inviteUser", {email :  $('#research_value').val(), project : usersList.views.main.project.get('id')}, function(data){

          _this.users.add(data.user);
          _this.permissions.add(data.permission);
          $('#research_value').val("");
          _this.render();
        });
      }
    },
    render : function(){        
      ///////////////////////
      // init
      var userPerms = api.getUserPermissionByProject(this.permissions,this.users,this.project.get('id')); //users hav to be [{user json,permission json},{user json,permission json},...]
      $(this.el).empty();
      $(this.el).append(this.template({
        userPerms : userPerms,
        project : this.project.toJSON(),
        info : this.infos.init,
        mode : this.mode
      }));
      return this;
    }
});
/////////////////////////////////////////////////
