/***************************************/
comments.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.comments = this.model.get('comments');
        this.user = json.user;
        // Events
        this.comments.bind("add", this.render);
        this.comments.bind("remove", this.render);
        // Templates
        this.template = _.template($('#comments-template').html());
    },
    events : {
        'click .add' : 'addComment',
        'click .remove' : 'removeComment'
    },
    addComment: function(e){
        e.preventDefault(); 
        this.comments.add({
            id:guid(),
            user : this.user,
            date : getDate(),
            content : $(this.el).find(".input_comment").val()
        });
        this.model.save({comments : this.comments.toJSON()});
    },
    removeComment : function(e){
        e.preventDefault();
        comment = this.comments.get(e.target.getAttribute("data-id-comment"));
        this.comments.remove(comment);
        this.model.save({comments : this.comments.toJSON()});
    },
    render : function() {
        $(this.el).html("");
        // Comments + new comment input
        $(this.el).append(this.template({
            user : this.user,
            model : this.model,
            comments : this.comments.toJSON()
        }));

        return this;
    }
});
/***************************************/