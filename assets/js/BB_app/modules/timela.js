//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/
timela.Views.CommentView = Backbone.View.extend({
    className : "comment",
    initialize : function(json) {
        console.log("comment view constructor");
        _.bindAll(this, 'render');
        this.model.bind('add', this.render);
        this.model.bind('remove', this.remove);
        this.template = _.template($('#comment-template').html());
    },
    remove : function(){
        this.remove();
    },
    render: function(){
        var renderedContent = this.template({comment : this.model.toJSON()});
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
timela.Views.CommentsView = Backbone.View.extend({
    initialize : function(json) { 
        console.log("comments view constructor!");
        _.bindAll(this, 'render');
        /*Comments*/
        this.collection.bind('reset', this.render);
        /*this.collection.bind('add', this.render);*/
        this.collection.bind('remove', this.remove);
        /*Post*/
        this.model.bind('change', this.render);
        /*Variables*/
        this.timeline = json.timeline;
        /*Templates*/
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
            user : CurrentUser,
            date : getDate(),
            content : $("#"+this.model.get('id')+"_input_comment").val()
        });
        /*On ajoute le commentaire au model*/
        id_post =this.model.gt('id');
        this.timeline.get('posts')

        this.model.addComment(new_comment);
        /*On ajoute à la collection pour permettre la suppression*/
        this.collection.unshift([new_comment]);
        /*On ajoute le commentaire à la vue*/
        new_comment_view = new timela.Views.CommentView({model:new_comment});
        $("#"+this.model.get('id')+"_comment").before(new_comment_view.render().el);
        /*On vide le formulaire*/
        $("#"+this.model.get('id')+"_input_comment").val("");
    },
    removeComment : function(e){
        console.log('remove this comment !');
        e.preventDefault();
        comment_to_remove = this.collection.get(e.target.getAttribute("data-id-comment"));
        this.model.removeComment(comment_to_remove.toJSON());
        collapse("#"+comment_to_remove.get('id')+"_comment");
    },
    render : function() {
        list_comment_views = [];
        this.collection.each(function(comment){
            comment_view = new timela.Views.CommentView({model: comment});
            /*$(this.el).append(comment_view.render().el);*/
            this.list_comment_views.unshift(comment_view.render().$el.html());
        });
        var renderedContent = this.template({views : list_comment_views, post : this.model, c_user : CurrentUser.toJSON()});
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/  
timela.Views.PostView = Backbone.View.extend({
    tagName : "ul",
    className : "panel cbp_tmtimeline",
    initialize : function(json) {
        console.log("version view constructor");
        _.bindAll(this, 'render');
        /*Post*/
        this.model.bind('add', this.render);
        //this.model.bind('remove', this.remove, this);
        /*Template*/
        this.template = _.template($('#post-template').html());
        /*Variables*/
        this.timeline = json.timeline;
        this.user = json.user;
        this.edit = "off";
    },
    /*remove : function(){
        this.remove();
    },*/
    render: function(){
        var renderedContent = this.template({ 
            post : this.model.toJSON(), 
            c_user: this.user.toJSON(),
            edit : this.edit
        });
        $(this.el).html(renderedContent);
        // Comments
        comments_collection = new global.Collections.CommentsCollection().add(this.model.get('comments'));
        comments_view = new timela.Views.CommentsView({collection: comments_collection, model:this.model, timeline:this.timeline});
        $(this.el).append(comments_view.render().el);
        return this;
    }
});
/***************************************/
timela.Views.PostsView = Backbone.View.extend({
    initialize : function(json) {  
        console.log("posts view constructor!");
        _.bindAll(this, 'render');
        /*Timeline*/
        this.model.bind('change',this.render);
        /*Posts*/
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        // Variables
        this.user = json.user;
    },
    events: {
        "click .removePost" : "removePost",
    },
    removePost: function(e){
        console.log("remove post");
        id_post = e.target.getAttribute('data-id-post');
        this.collection.remove(this.collection.get(id_post));// Remove from the view collection
        this.model.removePostByID(id_post);// Remove from the timeline object and the bdd
    },
    render : function() {
        $(this.el).html("");//reset the view
        postsView_el = this.el;
        user_ = this.user;
        timeline = this.model;
        this.collection.each(function(post){
            // Posts
            post_view = new timela.Views.PostView({model: post,user:this.user_,timeline:this.timeline});
            $(postsView_el).append(post_view.render().el);
            
        });
        return this;
    }
});
/***************************************/
timela.Views.View_PublishModule = Backbone.View.extend({
    initialize : function(json){
        console.log('View_PublishModule initialize !');
        _.bindAll(this, 'render');
        /*Timeline*/
        this.timeline = json.timeline;
        /*Current user*/
        this.model.bind('reset', this.render);
        this.model.bind('add', this.render);
        this.model.bind('remove', this.remove);
        /*Template*/
        this.template = _.template($('#publish-module-template').html());
    },
    events : {
        'click .addPost' : 'addPost',
    },
    addPost : function(e) {
        e.preventDefault();
        console.log('Add post !');
        new_post = new global.Models.Post({
            id: guid(), 
            user: this.model,
            content : $('#editor1').val(),
            //content : CKEDITOR.instances.editor1.getData(),
            tags: this.$('#tags_post').val().split(","),
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        this.timeline.addPost(new_post);
        this.collection.unshift(new_post);
        //CKEDITOR.instances.editor1.setData('');
        collapse('#addText_row');
    },
    render : function() {
        console.log('View_PublishModule render !');
        var renderedContent = this.template({current_user:this.model.toJSON()});
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
timela.Views.Timeline = Backbone.View.extend({
    initialize : function(json) {  
        console.log("posts view constructor!");
        _.bindAll(this, 'render');
        /*Timeline*/
        /*this.model.on('change', this.render);*/
        /*this.model.bind('change', this.render);*/
        /*this.model.bind('add', this.render);
        this.model.bind('remove', this.remove);*/
        /*Posts*/
        this.collection = new global.Collections.Posts(this.model.get('posts'));
        this.model.set('posts',this.collection);
        // this.model.get('posts').each(function(post){
        //     /*alert(post.get('id'));*/
        // })
        /*Variables*/
        this.user=json.user;        
    },
    events: {
        "click .removePost" : "removePost",
    },
    removePost: function(e){
        id_post = e.target.getAttribute('data-id-post');
        this.model.removePostByID(id_post);
    },
    
    /*remove : function(){
        this.remove();
    },*/
    render : function() {
        $(this.el).html("");//reset the view
        /*PublishModule*/
        publishModule  = new timela.Views.View_PublishModule({timeline:this.model,model:this.user,collection:this.collection});// Timelines, Current user, Knowledge
        $(this.el).append(publishModule.render().el);
        /*Posts*/
        post_view = new timela.Views.PostsView({collection: this.collection,user:this.user,model:this.model});
        $(this.el).append(post_view.render().el);
        return this;
    }
});

timela.Views.Main = Backbone.View.extend({
    initialize : function(json) {  
        console.log("posts view constructor!");
        _.bindAll(this, 'render');

        this.current_selection = json.current_selection;
        this.user = json.user;
        this.current_selection.on('create',this.newTimeline, this);

        this.collection.bind("add", this.render);
    },
    newTimeline: function(k_id){
        timela.models.newT = new global.Models.Timeline({
            id:guid(),
            knowledge : k_id,
            posts : [],
            date : getDate()
        });
        timela.models.newT.save();
    },
    render : function() {
        current_selection_ = this.current_selection;
        if(this.current_selection.length != 0){// Si une K a ete selectionnée ds lexplorer
            timeline_ = this.collection.find(function(timeline){return timeline.get('knowledge') == _.first(this.current_selection_);});
            console.log(timeline_)
            _.extend(timeline_, Backbone.Events);
            /*Timeline*/
            timeline = new timela.Views.Timeline({model:timeline_,user:this.user});// Timeline, current_selection
            $(this.el).append(timeline.render().el);
        };

        return this;
    }
});
/***************************************/    
var Buffer = 3;
var First = 0;
var End = 0;
var CurrentFilter = "all";
var CurrentUser = new global.Models.User();

function getSelection(collection){
    buffer=this.getBuffer();
    first=this.getFirst();
    end=this.getEnd();
    next=buffer+end;
    /*alert("end "+end);
    alert("next "+next);*/
    size=collection.length;
    new_collection=new global.Collections.PostsCollection();
    for (i=first; i<next;i++){
        new_collection.add(collection.at(i));
    }
    /*alert("selection "+new_collection.length);*/
    return new_collection;
};

function expand(id){$(id).show('slow');};
function collapse(id){$(id).hide('slow');};
function next(){
    this.setEnd(this.get('end')+this.get('buffer'));
    this.getTimeline().render();
};

function unset(array,object){
    var index = _.indexOf(array, object)
    if(index > -1){
        array.splice(index,1)
    }
}

function unset_foireux(array,com){
    array.forEach(function(object){
        if(object.id == com.id){  
            array.splice(array.indexOf(object),1)
        }        
    });
}
