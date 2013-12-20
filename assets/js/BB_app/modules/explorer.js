/////////////////////////////////////////////////////////////////////
/* Timela views*/
/////////////////////////////////////////////////////////////////////
explorer.Views.CommentView = Backbone.View.extend({
    className : "comment",
    initialize : function(json) {
        console.log("comment view constructor");
        _.bindAll(this, 'render');
        // Variables
        this.comment = json.comment;
        // Events
        this.model.bind('remove', this.remove, this);
        // Template
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
explorer.Views.CommentsView = Backbone.View.extend({
    initialize : function(json) { 
        console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.comments = json.comments;
        this.post = json.post;
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
            user : CurrentUser,
            date : getDate(),
            content : $("#"+this.model.get('id')+"_input_comment").val()
        });
        /*On ajoute le commentaire au model*/
        id_post =this.model.gt('id');
        this.timeline.get('posts')

        this.model.addComment(new_comment);
        /*On ajoute à la collection pour permettre la suppression*/
        this.comments.unshift([new_comment]);
        /*On ajoute le commentaire à la vue*/
        new_comment_view = new explorer.Views.CommentView({model:new_comment});
        $("#"+this.model.get('id')+"_comment").before(new_comment_view.render().el);
        /*On vide le formulaire*/
        $("#"+this.model.get('id')+"_input_comment").val("");
    },
    removeComment : function(e){
        console.log('remove this comment !');
        e.preventDefault();
        comment_to_remove = this.comments.get(e.target.getAttribute("data-id-comment"));
        this.model.removeComment(comment_to_remove.toJSON());
        collapse("#"+comment_to_remove.get('id')+"_comment");
    },
    render : function() {
        list_comment_views = [];
        this.comments.each(function(comment_){
            comment_view = new explorer.Views.CommentView({comment: comment_});
            this.list_comment_views.unshift(comment_view.render().$el.html());
        });
        var renderedContent = this.template({
            views : list_comment_views, 
            post : this.post, 
            c_user : this.user.toJSON()
        });
        $(this.el).html(renderedContent);
        return this;
    }
});
/////////////////////////////////////////////////////////////////////
// Explorer views
/////////////////////////////////////////////////////////////////////
explorer.Views.Knowledge = Backbone.View.extend({
    tagName : "ul",
    className : "panel cbp_tmtimeline",
    initialize : function(json) {
        console.log("Knowedge view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledge = json.knowledge;
        this.user = json.user;
        this.edit = "off";
        // Template
        this.template = _.template($('#post-template').html());
    },
    // events : {
    //     "click .remove" : "removeKnowledge",
    //     "click .selectable" : "manageClass"
    // },
    // manageClass: function(){
    //     if(_.indexOf($(this.el).context.className.split(" "),'callout') > -1){
    //         $(this.el).removeClass("callout");
    //     }else{
    //         $(this.el).addClass("callout");
    //     }
    // },
    // removeKnowledge : function(e){
    //     conole.log("Remove the knowledge");
    // },
    render : function() {
        // Post
        var renderedContent = this.template({ 
            post : this.knowledge.toJSON(), 
            c_user: this.user.toJSON(),
            edit : this.edit
        });
        $(this.el).html(renderedContent);
        // Comments
        comments_view = new explorer.Views.CommentsView({
            comments: this.knowledge.get('comments'), 
            post:this.knowledge,
            user:this.user
        });
        $(this.el).append(comments_view.render().el);

        return this;
    }
});
/***********************************************/
explorer.Views.Poches = Backbone.View.extend({
    tagName: "div",
    className: "small-2 large-2 columns",
    initialize : function(json) {
        console.log("Poches view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.poches = json.poches;
        this.current_filters = json.currentFilters;
        // Events
        this.poches.bind('reset', this.render);
        this.poches.bind('add', this.render);
        this.poches.bind('remove', this.render);
        // Template
        this.template = _.template($('#poches-template').html());        
    },
    events : {
        "click .add" : "addPoche",
        "click .remove" : "removePoche",
        "click .selectable" : "filterSelected"
    },
    filterSelected: function(e){
        console.log("filter selected");
        var Class = e.target.className.split(' ');
        var index = Class.indexOf('success');
        if(index > -1){/* Deselection */
            
            var indexFilter = this.current_filters.indexOf(e.target.getAttribute("data-filter-title"));
            if(indexFilter > -1){this.current_filters.splice(indexFilter,1);}
            $("#"+e.target.id).removeClass('success');
            this.current_filters.trigger('change',e.target.getAttribute("data-filter-title"));
        }
        else{/* Selection */
            if(e.target.id !="notClassified"){$('#notClassified').removeClass('success');}// On deselectionne notClassified
            this.current_filters.unshift(e.target.getAttribute("data-filter-title"));
            if(e.target.getAttribute("data-filter-title") == "notClassified"){
                this.current_filters.length=0;
                this.render();
                this.current_filters.trigger('notClassified');
            }else{
                this.current_filters.trigger('change',e.target.getAttribute("data-filter-title"));
            }
            $("#"+e.target.id).addClass('success');
        }
    },
    addPoche : function(e){
        console.log("Add a new poche");
        global.models.newP = new global.Models.Poche({
            id: guid(),
            title: $("#newP").val(),
            user : "clem",
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
        this.current_filters.length = 0;
        this.current_filters.trigger('newPoche');
    },
    removePoche : function(e){
        console.log("Remove the poche");
    },    
    render : function() {
        var renderedContent = this.template({poches:this.poches.toJSON()});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
explorer.Views.Knowledges = Backbone.View.extend({
    tagName: "div",
    className: "small-10 large-10 columns",
    initialize : function(json) {
        console.log("Knowledges view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.user = json.user;
        this.current_filters = json.currentFilters;
        this.current_selection = json.current_selection;
        // Events
        this.knowledges.bind('reset', this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);

        this.current_filters.on('change',this.applyFilterToSelection, this);
        this.current_filters.on('newPoche',this.render, this);
        this.current_filters.on('notClassified',this.displayNotClassified, this);

        this.current_selection.on('create', function(){
            alert("dlkfjslkfjdlskf")
        });

        // Template
        this.template = _.template($('#publish-module-template').html());
        
    },
    applyFilterToSelection: function(pocheTitle){
        console.log("Manage filters");
        collection = this.knowledges;
        this.current_selection.forEach(function(k_id){
            k = this.collection.get(k_id);
            if(_.union(k.get('tag'),this.current_filters).length == k.get('tag').length){
                console.log("On enlève le tag de K: "+pocheTitle);
                k.get('tag').splice(_.indexOf(k.get('tag'),pocheTitle),1);
            }else{
                console.log("On update les tags de K avec: "+_.union(k.get('tag'),this.current_filters));
                k.set('tag',_.union(k.get('tag'),this.current_filters));
            }
            k.save();
        });
        this.current_selection.length = 0;
        this.current_selection.trigger('change');
        this.render();
        
    },
    events : {
        "click .addPost" : "addKnowledge",
        "click .selectable" : "addToSelection"
    },
    addToSelection : function(e){
        console.log("Knowledge added to selection");
        if($("#selector_"+e.target.getAttribute('data-id-knowledge')).is(':checked')){
            console.log("Add this K to selection");
            this.current_selection.unshift(e.target.getAttribute('data-id-knowledge'));
            this.current_selection.trigger('change');
        }else{
            console.log("Remove this K to selection");
            var indexFilter = this.current_selection.indexOf(e.target.getAttribute('data-id-knowledge'));
            if(indexFilter > -1){
                this.current_selection.splice(indexFilter,1);
                this.current_selection.trigger('change');
            }
        }
        console.log(this.current_selection)
    },
    addKnowledge : function(e){
        console.log("Add knowledge");
        var tags = [];
        this.current_filters.forEach(function(f){tags.unshift(f)})
        global.models.newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
            title : $('#new_k_title').val(),
            content : $('#new_k_title').val(),
            tags: this.$('#new_k_tags').val().split(","),
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        global.models.newK.save();
        this.knowledges.add(global.models.newK);
        this.current_selection.trigger("create",global.models.newK.get('id'));
    },
    displayNotClassified: function(){
        var renderedContent = this.template();
        $(this.el).html(renderedContent);
        knowledges_el = this.el;
        this.knowledges.each(function(k){
            if(k.get('tag').length == 0){
                knowledge_v = new explorer.Views.Knowledge({knowledge:k});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        return this;
    },
    render : function(){
        var renderedContent = this.template({user:this.user.toJSON()});
        $(this.el).html(renderedContent);
        knowledges_el = this.el;
        current_filters = this.current_filters;
        user_ = this.user;
        this.knowledges.each(function(k){
            console.log('comments',k.get('comments'))
            k.set('comments',new global.Collections.Comments(k.get('comments')))
            if(_.intersection(k.get('tag'),this.current_filters).length == this.current_filters.length){
                knowledge_v = new explorer.Views.Knowledge({knowledge:k,user:this.user_});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        return this;
    }
});
/***********************************************/
explorer.Views.Main = Backbone.View.extend({
    tagName : "div",
    initialize : function(json) {
        console.log("Explorer view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.knowledges = json.knowledges;
        this.user = json.user;
        this.poches = json.poches;
        this.current_selection = json.current_selection;
        this.current_filters = [];
        // EventsAggregator
        _.extend(this.current_filters, Backbone.Events);
        this.current_selection = json.current_selection;
    },
    render : function() {
        // Poches
        filter = new explorer.Views.Poches({
            poches:this.poches,
            currentFilters:this.current_filters
        });
        $(this.el).append(filter.render().el);
        // Knowledges
        knowledges = new explorer.Views.Knowledges({
            knowledges:this.knowledges,
            user:this.user,
            currentFilters:this.current_filters,
            current_selection:this.current_selection
        });
        $(this.el).append(knowledges.render().el);
               
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


jQuery(document).ready(function() {
  checkContainer();
});

function checkContainer () {
  if($('#new_k_content').is(':visible')){ //if the container is visible on the page
    CKEDITOR.replace('new_k_content');  //Adds a grid to the html
  } else {
    setTimeout(checkContainer, 50); //wait 50 ms, then try again
  }
}