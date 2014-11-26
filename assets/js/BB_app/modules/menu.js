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
    this.views.main = new this.Views.Main({
        el : "#menu_container",
        project :  global.models.currentProject,
        user : global.models.current_user,
        pathname : window.location.pathname,
    });
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
        this.project = json.project;
        this.user = json.user;
        this.pathname = json.pathname;
        this.links = [];
        ///////////////////////////
        // links list
        var visu = {href : "#visu", name : "Visualization"};
        var edit = {href : "#edit", name : "Edition"};
        var timeline = {href : "#timeline", name : "Timeline"};
        var bbmap_visu = {href : "/bbmap?projectId="+this.project.get('id')+"#visu", name : "Visualization"};
        var bbmap_edit = {href : "/bbmap?projectId="+this.project.get('id')+"#edit", name : "Edition"};
        var bbmap_timeline = {href : "/bbmap?projectId="+this.project.get('id')+"#timeline", name : "Timeline"};
        var backup = {href : "/backup?projectId="+this.project.get('id'), name : "Backup"};
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
        var mobileInterface = {href : "/mobileInterface?projectId="+this.project.get('id'), name : "Version mobile"};
        var mobileManager = {href : "/mobileManager", name : "Version mobile"};
        
        //Find user permission

        // Build specific menu
        if(this.pathname == "/"){ 
            this.links = [mobileManager,profile,logout];
        }
        else if(this.pathname == "/bbmap") {
            var permission = global.collections.Permissions.findWhere({user_id : global.models.current_user.get('id'), project_id : this.project.get('id')}).get('right');
            if(permission === "r") this.links = [manager,mobileInterface,profile,logout];
            else this.links = [visu,edit,backup,manager,rapports_manager,users_manager,mobileInterface,profile,logout];
        }
        else if(this.pathname == "/ckpreviewer") {
            var permission = global.collections.Permissions.findWhere({user_id : global.models.current_user.get('id'), project_id : this.project.get('id')}).get('right');
            if(permission === "r") this.links = [bbmap_visu,manager,mobileInterface,profile,logout];
            else this.links = [bbmap_visu,bbmap_edit,backup,manager,users_manager,mobileInterface,profile,logout];
        }
        else if(this.pathname == "/userManager") {
            var permission = global.collections.Permissions.findWhere({user_id : global.models.current_user.get('id'), project_id : this.project.get('id')}).get('right');
            if(permission === "r") this.links = [bbmap_visu,manager,mobileInterface,profile,logout];
            else this.links = [bbmap_visu,bbmap_edit,backup,manager,rapports_manager,mobileInterface,profile,logout];
        }
        else if(this.pathname == "/editprofile") {
            this.links = [mobileManager,manager,logout]; 
        }
        else if(this.pathname == "/backup") {
            var permission = global.collections.Permissions.findWhere({user_id : global.models.current_user.get('id'), project_id : this.project.get('id')}).get('right');
            if(permission === "r") this.links = [bbmap_visu,manager,mobileInterface,profile,logout];
            else this.links = [bbmap_visu,bbmap_edit,manager,rapports_manager,mobileInterface,profile,logout]; 
        }
        



        // Templates
        this.template_menu = _.template($('#menu-template').html());
    },
    render : function(){        
        // init
        $(this.el).empty();
        if(this.links.length > 0) $(this.el).append(this.template_menu({
            links  : this.links,
            project : this.project.toJSON(),
            user : this.user.toJSON()
        }));
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
