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
  default_templates : {
    "2e8b35bb-45d5-97b0-5d28-8e73f88c28c3" : {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;",
      title: "Concept",
      type : "concept"
    },
    "33fc9b1a-0958-1d97-19d2-0ed2e2c593c6" : {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;",
      title: "Knowledge",
      type : "knowledge"
    },
    "92674815-4bc7-fb80-e0a0-c2bf0200f84d" : {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #D35400;background: #ffffff;border: solid #D35400 2px;text-decoration: none;",
      title: "Category",
      type : "poche"
    },
    "2ff4f56d-46ab-7839-704d-09b229c2a336" : {
      css: "font-family: Arial;color: #000000;background: transparent;text-decoration: none;",
      title: "Transparent",
      type : "poche"
    },
    "c2d0a329-67da-fd18-ab0c-6a1d6faeb084" : {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #ffffff;background: #2ECC71;border: solid #27AE60 2px;text-decoration: none;",
      title: "Know",
      type : "concept"
    },
    "ac94b001-277f-6132-bcf5-a6ee76dd8348" : {
      css: "-webkit-border-radius: 27;-moz-border-radius: 27;border-radius: 27px;font-family: Arial;color: #ffffff;background: #9B59B6;border: solid #8E44AD 2px;text-decoration: none;",
      title: "Reachable",
      type : "concept"
    },
    "a1ed5313-ec59-53e2-b888-baeb337ea8dc" : {
      css: "-webkit-border-radius: 27;-moz-border-radius: 27;border-radius: 27px;font-family: Arial;color: #ffffff;background: #F1C40F;border: solid #F39C12 2px;text-decoration: none;",
      title: "Alternative",
      type : "concept"
    },
    "7e8223f9-d39f-5246-d187-ec171022ccb6" : {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #3498DB;border: solid #2980B9 2px;text-decoration: none;",
      title: "Validated",
      type : "knowledge"
    },
    "e7f7844e-043b-1c3f-2e0d-15cd2a84be18" : {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #E67E22;border: solid #D35400 2px;text-decoration: none;",
      title: "Processing",
      type : "knowledge"
    },
    "adc43381-7b54-1530-7993-db9b54a0addb" : {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #E74C3C;border: solid #C0392B 2px;text-decoration: none;",
      title: "Missing",
      type : "knowledge"
    }
  },
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
      "change #title" : "setPreview",
      "change #template" : "setPreview",
      "change #description" : "setPreview",
      "click .push" : "push",
      "click .fullscreen" : "putInFullScreen",
    },
    /////////////////////////////////////////////////
    push : function(e){
      e.preventDefault();
      var title = $("#title").val();
      var template_id = $("#template").val();
      var type = mobileInterface.default_templates[template_id].type;
      var css = mobileInterface.default_templates[template_id].css;
      var description = $("#description").val();
      if(title != ""){
        if(type == "concept") this.newConcept(title,type,css,description)
        else if(type == "knowledge") this.newKnowledge(title,type,css,description)
        else if(type == "poche") this.newPoche(title,type,css,description)
        this.sendSuccess()
      }else{
        this.sendError();
      }
    },
    putInFullScreen : function(e){
        e.preventDefault();
        if (screenfull.enabled) screenfull.request();
    },
    setPreview : function(){
      var title = $("#title").val();
      var template_id = $("#template").val();
      var type = mobileInterface.default_templates[template_id].type;
      var css = mobileInterface.default_templates[template_id].css;
      var description = $("#description").val();
      $('#preview').html('<div style="'+css+'" >'+title+'</div>')
    },
    /////////////////////////////////////////////////
    newConcept : function(title,type,css,description){
      var new_model = new global.Models.ConceptModel({
        id : guid(),
        type : type,
        id_father: "none",
        top : this.top,
        left: this.left,
        project: this.project.get('id'),
        title: title,
        css : css,
        content : description,
        user: this.user
      });
      new_model.save();
    },
    newKnowledge : function(title,type,css,description){
      var new_model = new global.Models.Knowledge({
        id : guid(),
        type : type,
        id_father: "none",
        top : this.top,
        left: this.left,
        project: this.project.get('id'),
        title: title,
        css : css,
        content : description,
        user: this.user
      });
      new_model.save();
    },
    newPoche : function(title,type,css,description){
      var new_model = new global.Models.Poche({
        id : guid(),
        type : type,
        id_father: "none",
        top : this.top,
        left: this.left,
        project: this.project.get('id'),
        title: title,
        css : css,
        content : description,
        user: this.user
      });
      new_model.save();
    },
    /////////////////////////////////////////////////
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
    /////////////////////////////////////////////////
    render : function(){        
        ///////////////////////
        // init
        $(this.el).empty();
        $(this.el).append(this.template({
          project:this.project.toJSON(),
          user:this.user.toJSON(),
          templates : mobileInterface.default_templates
        }))
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
