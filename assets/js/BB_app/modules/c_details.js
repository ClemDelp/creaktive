/////////////////////////////////////////////////
// K_details (modal)
/////////////////////////////////////////////////
/***************************************/
c_details.Views.RightPart = Backbone.View.extend({
    tagName: "div",
    className: "small-4 large-4 columns",
    initialize : function(json) {
        console.log("Right part of details K view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        // Template
        this.template = _.template($('#conceptModal-label-members-actions-template').html()); 
    },
    render : function(){
        // Knowledge title content and tags
        var renderedContent = this.template({model:this.model.toJSON()});
        $(this.el).html(renderedContent);

        return this;
    }
});
/***************************************/
c_details.Views.Comment = Backbone.View.extend({
    className : "comment",
    initialize : function(json) {
        console.log("comment view constructor");
        _.bindAll(this, 'render');
        // Variables
        this.comment = json.comment;
        // Template
        this.template = _.template($('#conceptModal-comment-template').html());
    },
    render: function(){
        var renderedContent = this.template({comment : this.comment});
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
c_details.Views.Comments = Backbone.View.extend({
    initialize : function(json) { 
        console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.model.bind("change", this.render);
        this.model.bind("destroy", this.render);
        this.user = json.user;
        // Templates
        this.template = _.template($('#conceptModal-comments-template').html());
    },
    events : {
        'submit form' : 'addComment',
        'click .remove' : 'removeComment'
    },
    addComment: function(e){
        e.preventDefault(); 
        console.log('addComment !'); 
        new_comment = {
            id:guid(),
            user : this.user,
            date : getDate(),
            content : $("#"+this.model.get('id')+"_input_comment").val()
        };
        /*On ajoute le commentaire au model*/
        this.model.get('comments').unshift(new_comment);
        this.model.save();

        /*On vide le formulaire*/
        $("#"+this.model.get('id')+"_input_comment").val("");
    },
    removeComment : function(e){
        console.log('remove this comment !');
        e.preventDefault();
        comment = this.comments.get(e.target.getAttribute("data-id-comment"));
        console.log(comment)
        //TODO : un unset_foireux ou _.withtout
        //this.model.get('comments').remove(comment)
        this.model.save();
        collapse("#"+comment.get('id')+"_comment");
    },
    render : function() {
        // Each comment
        list_comment_views = [];
        _.each(this.model.get('comments'), function(comment_){
            comment_view = new c_details.Views.Comment({comment: comment_});
            this.list_comment_views.unshift(comment_view.render().$el.html());
        });
        // All templates: comments + input comment
        var renderedContent = this.template({
            views : list_comment_views, 
            model : this.model, 
            c_user : this.user.toJSON()
        });
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
c_details.Views.LeftPart = Backbone.View.extend({
    tagName: "div",
    className: "small-8 large-8 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        this.comments = json.comments;
        // Template
        this.template = _.template($('#conceptModal-title-ckeditor-template').html()); 
    },
    events : {
        "click .update_informations" : "update_informations",
    },
    update_informations : function(e){
        this.model.set({
            title:$("#change_c_title").val(),
            content:CKEDITOR.instances.change_c_content.getData()
        });
        this.model.save();
    },
    render : function(){
        console.log("LEFT PART MODAL RENDER")
        // change k title and content template part
        var renderedContent = this.template({model:this.model.toJSON()});
        $(this.el).html(renderedContent);
        // Knowledge comments
        comments_view = new c_details.Views.Comments({
            model:this.model,
            user:this.user
        });
        $(this.el).append(comments_view.render().el);

        return this;
    }
});
/***************************************/
c_details.Views.Main = Backbone.View.extend({
    el:"#c_details_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.model = json.model;


    },
    
    render : function(){
        console.log("CONCEPT MODAL RENDER")
        $(this.el).html("");
        // Left part
        leftPart_view = new c_details.Views.LeftPart({
            comments: this.model.get('comments'), 
            model:this.model,
            user:this.user
        });
        $(this.el).html(leftPart_view.render().el);
        // right part
        rightPart_view = new c_details.Views.RightPart({
            model:this.model,
            user:this.user
        });
        $(this.el).append(rightPart_view.render().el);

        return this;
    }
});


