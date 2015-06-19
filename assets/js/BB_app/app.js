//////////////////////////////////////////////////////////////////
//                    CONTROLLER DE CREAKTIVE 
//                        Global object 
//////////////////////////////////////////////////////////////////
var global = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  Functions: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  functions: {},
  // Parameters
  rules : true,
  displayCursor : true, // to display or not users cursors in real-time : true/false
  drawingAid : false, // active or not drawing aid into bbmap editor : true/false
  mode : "visu", // define the mode into bbmap by default : visu/edit/timeline
  filter : "ckp", // define which data to display in bbmap : c/k/ck/kp/ckp
  ckOperator : true, // diplay or not ckoperator, links between C and K : true/false
  default_element_position : {left: 4500, top: 4500},
  css_knowledge_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;",
  css_concept_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;",
  css_poche_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #D35400;background: #ffffff;border: solid #D35400 2px;text-decoration: none;",
  css_transparent_element : "font-family: Arial;color: #000000;background: transparent;text-decoration: none;",
  // Constructor
  init: function (json,callback) {
    //////////////////////////////////////////////////////////////////
    // Data
    //////////////////////////////////////////////////////////////////
    this.eventAggregator = {};//this.concepts.first();
    _.extend(this.eventAggregator, Backbone.Events);
    // Models
    this.models.current_user = new this.Models.User(json.user);
    this.models.currentProject = new this.Models.ProjectModel(json.project);
    // Collection
    this.collections.News = new this.Collections.News(json.news);
    this.collections.Comments = new this.Collections.Comments(json.comments);
    this.collections.Attachments = new this.Collections.Attachments(json.attachments);
    this.collections.Elements = new this.Collections.Elements(json.elements);

    this.collections.Project_users = new this.Collections.UsersCollection(json.project_users);
    this.collections.Users = new this.Collections.UsersCollection(json.users);
    this.collections.Permissions = new this.Collections.PermissionsCollection(json.permissions);
    this.collections.Projects = new this.Collections.ProjectsCollection(json.projects);
    this.collections.Links = new this.Collections.CKLinks(json.links);
    //////////////////////////////////////////////////////////////////
    console.log("******* Connected as ", this.models.current_user.get("name"), " on ", this.models.currentProject.get("title"));
    
    /**
    * Configures the instance of TrackJS with the provided configuration.
    *
    * @method configure
    * @param {Object} params The Configuration object to apply
    * @returns {Boolean} True if the configuration was successful.
    */
    try{
      trackJs.configure({
        // Custom session identifier.
        sessionId: this.models.currentProject.get('title'),
        // Custom user identifier.
        userId: this.models.current_user.get('email'),
      });
    }catch(err){
      console.log("track is not defined")
    }
    
    rules.init();
    callback();
  },
  };