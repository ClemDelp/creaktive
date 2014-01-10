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
        this.concept = json.concept;
        this.user = json.user;
        // Template
        this.template = _.template($('#label-members-actions-template').html()); 
    },
    render : function(){
        // Knowledge title content and tags
        var renderedContent = this.template({concept:this.concept.toJSON()});
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
        this.template = _.template($('#comment-template').html());
    },
    render: function(){
        var renderedContent = this.template({comment : this.comment.toJSON()});
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
        this.comments = json.comments;
        this.concept = json.concept;
        this.user = json.user;
        // Templates
        this.template = _.template($('#comments-template').html());
    },
    events : {
        'submit form' : 'addComment',
        'click .remove' : 'removeComment'
    },
    addComment: function(e){
        e.preventDefault(); 
        console.log('addComment !'); 
        new_comment = new global.Models.Comment({
            id:guid(),
            user : this.user,
            date : getDate(),
            content : $("#"+this.concept.get('id')+"_input_comment").val()
        });
        /*On ajoute le commentaire au model*/
        this.comments.add([new_comment]);
        this.concept.save();
        /*On ajoute le commentaire à la vue*/
        new_comment_view = new c_details.Views.Comment({comment:new_comment});
        $("#"+this.concept.get('id')+"_comment").before(new_comment_view.render().el);
        /*On vide le formulaire*/
        $("#"+this.concept.get('id')+"_input_comment").val("");
    },
    removeComment : function(e){
        console.log('remove this comment !');
        e.preventDefault();
        comment = this.comments.get(e.target.getAttribute("data-id-comment"));
        console.log(comment)
        this.concept.get('comments').remove(comment)
        this.concept.save();
        collapse("#"+comment.get('id')+"_comment");
    },
    render : function() {
        // Each comment
        list_comment_views = [];
        this.comments.each(function(comment_){
            comment_view = new c_details.Views.Comment({comment: comment_});
            this.list_comment_views.unshift(comment_view.render().$el.html());
        });
        // All templates: comments + input comment
        var renderedContent = this.template({
            views : list_comment_views, 
            concept : this.concept, 
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
        console.log("Left part of details k view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.concept = json.concept;
        this.user = json.user;
        this.comments = json.comments;
        // Template
        this.template = _.template($('#title-ckeditor-template').html()); 
    },
    events : {
        "click .update_informations" : "update_informations",
    },
    update_informations : function(e){
        this.concept.set({
            title:$("#change_k_title").val(),
            content:CKEDITOR.instances.change_k_content.getData()
        });
        this.concept.save();
    },
    render : function(){
        // change k title and content template part
        var renderedContent = this.template({concept:this.concept.toJSON()});
        $(this.el).html(renderedContent);
        // Knowledge comments
        comments_view = new c_details.Views.Comments({
            comments: this.concept.get('comments'), 
            concept:this.concept,
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
        console.log("c_details view initialise");
        _.bindAll(this, 'render', 'nodeSelectionChanged');
        // Variables
        this.eventAggregator = json.eventAggregator
        this.concepts = json.concepts;
        this.user = json.user;

        this.concept = new global.Models.ConceptModel();
        this.eventAggregator.on("nodeSelectionChanged", this.nodeSelectionChanged);
    },
    
    nodeSelectionChanged : function (e){
        this.concept = this.concepts.get(e);
        this.render();
    },

    render : function(){
        console.log("CONCEPT MODAL RENDER")
        $(this.el).html("");
        // // Left part
        // leftPart_view = new c_details.Views.LeftPart({
        //     comments: this.concept.get('comments'), 
        //     concept:this.concept,
        //     user:this.user
        // });
        // $(this.el).html(leftPart_view.render().el);
        // // right part
        // rightPart_view = new c_details.Views.RightPart({
        //     concept:this.concept,
        //     user:this.user
        // });
        // $(this.el).append(rightPart_view.render().el);

        $(this.el).append("<h5>"+this.concept.get('title')+"</h5>")
        return this;
    }
});



/***************************************/
jQuery(document).ready(function() {
  checkContainer();
});

function checkContainer () {
  if($('#change_k_content').is(':visible')){ //if the container is visible on the page
    CKEDITOR.replace('change_k_content');  //Adds a grid to the html
  } else {
    setTimeout(checkContainer, 50); //wait 50 ms, then try again
  }
}
