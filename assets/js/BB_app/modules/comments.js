/////////////////////////////////////////////////
var comments = {
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
      comments : json.comments
    });
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
comments.Views.Comment = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.comment = json.comment;
        // Templates
        this.template = _.template($('#comments-comment-template').html());
    },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({
            user : this.user.toJSON(),
            comment : this.comment.toJSON()
        }))
        return this;
    }
});
/////////////////////////////////////////////////
comments.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        this.users = json.users;
        this.mode    = json.mode;
        this.project = json.project;
        this.comments = json.comments;
        // Templates
        this.template_header = _.template($('#comments-header-template').html());
        // Events
        
    },
    events : {
        "click .addComment" : "newComment"
    },
    newComment : function(e){
        e.preventDefault();
        var content = $('#input_comment').val()
        var new_comment = new global.Models.Comment({
            id:guid(),
            project : this.project.get('id'),
            attachedTo : this.model.get('id'),
            user : this.user.get('id'), // id
            date : getDate(),
            content : content,
        });
        new_comment.save();
        this.comments.add(new_comment);
        this.render();
    },
    render : function() {
        $(this.el).empty();
        var _this = this;
        $(this.el).append(this.template_header({
            comments : comments,
            mode : this.mode
        }));
        this.comments.forEach(function(comment){
            if(comment.get('attachedTo') == _this.model.get('id')){
                $(_this.el).append(new comments.Views.Comment({
                    comment : comment,
                    user : _this.users.get(comment.get('user'))
                }).render().el);    
            }
            
        });
        return this;
    }
});
/***************************************/