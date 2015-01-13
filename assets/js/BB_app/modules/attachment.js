
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
        this.template_el = _.template($('#attachment-el-template').html()); 
        this.template_diapo = _.template($('#attachment-diapo-template').html());  
    },
    events : {
        "change #uploadfile" : "uploadFile"
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
        $(this.el).append(this.template_diapo({images:images}));
        // Attachments
        var nbr = 0;
        var table = $('<table>',{style:'width:100%'});
        this.attachments.each(function(attachment){
          if(attachment.get('attachedTo') == _this.model.get('id')){
            nbr +=1;
            table.append(_this.template_el({
              user : _this.users.get(attachment.get('user')).toJSON(),
              attachment : attachment.toJSON()
            }));
          }
        });
        $(this.el).append('<div class="large-12 medium-12 small-12 columns"><b>Attachments ('+nbr+')</b></div>');
        $(this.el).append(table);
        // Imput
        if(this.mode == "edit") $(this.el).append(this.template_input());

        $(document).foundation();
        return this;
    }
});
