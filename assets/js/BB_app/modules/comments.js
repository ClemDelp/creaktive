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
  init: function () {}
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
comments.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        // Templates
        this.template = _.template($('#comments-template').html());
        // Events
        this.listenTo(this.model,"remove",this.removeView,this);     
    },
    events : {
        'click .addComment' : 'addComment',
        'click .removeComment' : 'removeComment'
    },
    removeView : function(){
      this.remove();
    },
    addComment: function(e){
        e.preventDefault(); 
        this.model.get('comments').add({
            id:guid(),
            user : this.user,
            date : getDate(),
            content : $(this.el).find(".input_comment").val()
        });
        this.model.save();
    },
    removeComment : function(e){
        e.preventDefault();
        comment = this.model.get('comments').get(e.target.getAttribute("data-id-comment"));
        this.model.get('comments').remove(comment);
        this.model.save();
    },
    render : function() {
        $(this.el).empty();
        $(this.el).append(this.template({
            user : this.user,
            model : this.model,
            comments : this.model.get('comments').toJSON()
        }));

        return this;
    }
});
/***************************************/