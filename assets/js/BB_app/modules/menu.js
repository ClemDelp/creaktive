/////////////////////////////////////////////////
var menu = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.main = new this.Views.Main({el : "#menu_container",});
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
menu.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.project = global.models.currentProject;
        this.pathname = window.location.pathname;
        this.links = [];
        ///////////////////////////
        // links list
        var visu = {href : "#visu", name : "Visualisation"};
        var edit = {href : "#edit", name : "Edition"};
        var timeline = {href : "#timeline", name : "Timeline"};
        var bbmap_visu = {href : "/bbmap?projectId="+this.project.get('id')+"#visu", name : "Visualisation"};
        var bbmap_edit = {href : "/bbmap?projectId="+this.project.get('id')+"#edit", name : "Edition"};
        var bbmap_timeline = {href : "/bbmap?projectId="+this.project.get('id')+"#timeline", name : "Timeline"};
        var rapports_manager = {href : "/ckpreviewer?projectId="+this.project.get('id'), name : "Reports manager"};
        var users_manager = {href : "/userManager?projectId="+this.project.get('id'), name : "Users manager"};
        var manager = {href : "/", name : "Manager"};
        var profile = {href : "/editprofile", name : "Profile"};
        var logout = {href : "/logout", name : "Logout"};
        var support = {href : "/contact", name : "Support"};
        var doc = {href : "http://creaktive.fr/documentation/", name : "Documentation"};
        var terms = {href : "http://creaktive.fr/", name : "Terms of service"};
        var policy = {href : "http://creaktive.fr/", name : "Privacy Policy"};
        var faq = {href : "http://creaktive.fr/contact/", name : "FAQ"};
        // Build specific menu
        if(this.pathname == "/") this.links = [profile,logout,support,doc,terms,policy,faq];
        else if(this.pathname == "/bbmap") this.links = [visu,edit,timeline,manager,rapports_manager,users_manager,profile,logout,support,doc,terms,policy,faq];
        else if(this.pathname == "/ckpreviewer") this.links = [bbmap_visu,bbmap_edit,bbmap_timeline,manager,users_manager,profile,logout,support,doc,terms,policy,faq];
        else if(this.pathname == "/userManager") this.links = [bbmap_visu,bbmap_edit,bbmap_timeline,manager,rapports_manager,profile,logout,support,doc,terms,policy,faq];
        else if(this.pathname == "/editprofile") this.links = [manager,logout,support,doc,terms,policy,faq]; 
        // Templates
        this.template_menu = _.template($('#menu-template').html());
    },
    render : function(){        
        // init
        $(this.el).empty();
        if(this.links.length > 0) $(this.el).append(this.template_menu({links  : this.links}));
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
