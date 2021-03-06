
/////////////////////////////////////////////////
var attachment = {
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
      model : json.model,
      users : global.collections.Users,
      user : global.models.current_user,
      mode    : json.mode,
      project : global.models.currentProject,
      attachments : global.collections.Attachments,
    });
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
attachment.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        this.users = json.users;
        this.mode    = json.mode;
        this.project = json.project;
        this.attachments = json.attachments;
        // Templates
        this.template_input = _.template($('#attachment-input-template').html()); 
        this.template_diapo = _.template($('#attachment-diapo-template').html());  
    },
    events : {
        "change #uploadfile" : "uploadFile",
    },
    uploadFile : function(e){
      e.preventDefault();
      e.stopPropagation();
      var _this=this;
      var files = e.target.files;
      _.each(files, function(file){
        _this.attachments.create({
          id : guid(),
          name : file.name,
          path : file.name,
          url : file.name,
          project : _this.project.get('id'),
          attachedTo : _this.model.get('id'),
          user : _this.user.get('id'), // id
          date : getDate(),
        });
        
        
      })

      global.Functions.uploadFile(files, function(amz_id, fileName){
        _this.render();
      });  
    },
    render : function() {
      var _this = this;
      $(this.el).empty();
      // filter attachment get only images
      var images = [];
      this.attachments.forEach(function(attachment){
        if((attachment.get('attachedTo') == _this.model.get('id')) && (attachment.get('name').toLowerCase().match(/\.(jpg|jpeg|png|gif)$/))){images.unshift(attachment.toJSON())}
      })
      // get the diapo
      //$(this.el).append(this.template_diapo({images:images}));
      // Attachments
      var nbr = 0;
      var container = $('<div>',{class:'row'});
      var container2 = $('<div>',{style:'padding:15px;'});

      var table = $('<table>',{class:'large-12 medium-12 small-12 tableAttachement'});
      this.attachments.each(function(model){
        if(model.get('attachedTo') == _this.model.get('id')){
          nbr +=1;
          table.append(new attachment.Views.Attachment({
            tagName : "tr",
            user : _this.users.get(model.get('user')),
            mode : _this.mode,
            model : model
          }).render().el)
        }
      });
      container.append('<div id="mainAttachement" class="large-12 medium-12 small-12 columns"><h5>Attachments<strong> ('+nbr+')</strong> :</h5></div>');
      container2.append(table);
      container.append(container2);
      $(this.el).append(container);
      // Imput
      if(this.mode == "edit") $(this.el).append(this.template_input());

      $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////
attachment.Views.Attachment = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render','close');
        // Variables
        this.user = json.user;
        this.mode    = json.mode;
        this.attachment = json.model;
        // Events
        this.listenTo(this.attachment, "destroy", this.close)
        // Templates
        this.template_el = _.template($('#attachment-el-template').html()); 
    },
    events : {
        "click .remove" : "remove"
    },
    close : function(){
      this.remove();
    },
    remove : function(e){
      e.preventDefault();
      this.attachment.destroy();
      this.render();
      
    },
    render : function() {
      $(this.el).empty();
      $(this.el).append(this.template_el({
        user : this.user.toJSON(),
        mode : this.mode,
        attachment : this.attachment.toJSON()
      }));
      return this;
    }
});
