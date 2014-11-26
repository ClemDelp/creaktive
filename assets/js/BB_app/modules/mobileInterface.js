/////////////////////////////////////////////////
var mobileInterface = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new mobileInterface.Views.Main({
      el : json.el,
      project : global.models.currentProject,
      user : global.models.current_user
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
mobileInterface.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.project = json.project;
        this.user = json.user;
        this.template = _.template($('#mobileInterface-template').html());
        this.top = 5000;
        this.left = 5000;
    },
    events : {
      "click .addC" : "newConcept",
      "click .addK" : "newKnowledge",
      "click .fullscreen" : "putInFullScreen",
    },
    putInFullScreen : function(e){
        e.preventDefault();
        if (screenfull.enabled) screenfull.request();
        
    },
    newConcept : function(e){
      e.preventDefault();
      var _this = this;
      var title = $("#title").val();
      var description = $("#description").val();
      if(title != ""){
        var new_concept = new global.Models.ConceptModel({
            id : guid(),
            type : "concept",
            id_father: "none",
            top : _this.top,
            left: _this.left,
            project: _this.project.get('id'),
            title: title,
            css : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;",
            content : description,
            user: _this.user
        });
        new_concept.save();
        this.sendSuccess()
      }else{
        this.sendError();
      }

    },
    newKnowledge : function(e){
      e.preventDefault();
      var _this = this;
      var title = $("#title").val();
      var description = $("#description").val();
      if(title != ""){
        var new_knowledge = new global.Models.Knowledge({
            id : guid(),
            type : "knowledge",
            id_father: "none",
            top : _this.top,
            left: _this.left,
            project: _this.project.get('id'),
            title: title,
            css : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #2980B9 2px;text-decoration: none;",
            content : description,
            user: _this.user
        });
        new_knowledge.save();
        this.sendSuccess()
      }else{
        this.sendError();
      }

    },
    sendError : function(){
      $('.info').empty();
      var msg = '<div data-alert class="alert-box alert radius">Please insert a title !<a href="#" class="close">&times;</a></div>';
      $("#info").html(msg)      
      $("#title").val("");
      $("#description").val("");
      this.closeDelay();
    },
    sendSuccess : function(){
      $('.info').empty();
      var msg = '<div data-alert class="alert-box info radius">Content added successfully !<a href="#" class="close">&times;</a></div>';
      $("#info").html(msg)
      $("#title").val("");
      $("#description").val("");
      this.closeDelay();
    },
    closeDelay : function(){
      setTimeout(function(){$('#info').empty();},2000);
    },
    render : function(){        
        ///////////////////////
        // init
        $(this.el).empty();
        $(this.el).append(this.template({
          project:this.project.toJSON(),
          user:this.user.toJSON()
        }))
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
