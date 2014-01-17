/////////////////////////////////////////////////
// K_details (modal)
/////////////////////////////////////////////////
/***************************************/
details.Views.Labels = Backbone.View.extend({
    tagName:"fieldset",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.model = json.model
        
        this.model.bind("change", this.render);

        this.template = _.template($('#details-labels-template').html()); 
    },

    render : function(){
        $(this.el).html("");
        var chosenLabel = ["#FF0000","#FFF000","#04B404"];
        var modelColor = this.model.get('color');
        for (var i =0;  i<chosenLabel.length ; i++) {
            if(modelColor == chosenLabel[i]) chosenLabel[i] = "<img src='img/tick.png'></img>";
            else chosenLabel[i] ="";
        };
        var renderedContent = this.template({
            model:this.model.toJSON(),
            chosenLabel : chosenLabel
        });
         $(this.el).append(renderedContent);
         $(document).foundation();
        return this;
    }
});
/***************************************/
details.Views.Member = Backbone.View.extend({
    tagName:"li",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.member = json.member
        this.template = _.template($('#details-member-template').html()); 
    },
    render : function(){
        $(this.el).html("");
        var renderedContent = this.template({member:this.member});
         $(this.el).append(renderedContent);
        return this;
    }
});
/***************************************/
details.Views.MembersUl = Backbone.View.extend({
    tagName:"ul",
    className:"small-block-grid-2 medium-block-grid-3 large-block-grid-4",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.model = json.model;
        this.members = json.members;
        this.template = _.template($('#details-members-template').html()); 
    },
    render : function(){
        $(this.el).html("");
        mul_this = this;
        this.members.each(function(member){
            member_ = new details.Views.Member({
                member : member.toJSON()
            });
            $(mul_this.el).append(member_.render().el);
        })
        return this;
    }
});
/***************************************/
details.Views.Members = Backbone.View.extend({
    tagName:"fieldset",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.model = json.model;
        this.users = json.users;

        this.members = this.model.get("members");
        this.members.bind("add", this.render);
        this.members.bind("remove", this.render);


        this.template = _.template($('#details-members-template').html()); 
    },
    events : {
        "click .removeMember" : "removeMember",
        "click .addMember" : "addMember"
    },
    addMember : function(e){
        //console.log("Add member");
        this.members.add(this.users.get(e.target.getAttribute('data-user-id')))
        this.model.save({members : this.members.toJSON()});
    },
    render : function(){
        $(this.el).html("");
        var renderedContent = this.template({model:this.model.toJSON(), users : this.users.toJSON()});
         $(this.el).append(renderedContent);
         membersUl = new details.Views.MembersUl({
            model : this.model,
            members : this.members
         });
         $(this.el).append(membersUl.render().el);
         $(document).foundation();
        return this;
    }
});
/***************************************/
details.Views.Actions = Backbone.View.extend({
    tagName:"fieldset",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.model = json.model
        this.template = _.template($('#details-actions-template').html()); 
    },
    render : function(){
        $(this.el).html("");
        var renderedContent = this.template({model:this.model.toJSON()});
         $(this.el).append(renderedContent);
        return this;
    }
});
/***************************************/
details.Views.RightPart = Backbone.View.extend({
    tagName: "div",
    className: "small-4 large-4 columns",
    initialize : function(json) {
        //console.log("Right part of details K view initialise");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.eventAggregator = json.eventAggregator;
        this.user = json.user;
        this.users = json.users;
        this.users.bind("reset", this.render);
    },
    events : {
        "click .setLabel" : "setLabel",
    },

    setLabel : function(e){
        //console.log("Set label");
        this.model.set({color: e.target.getAttribute('data-color')});
        this.model.save({color: e.target.getAttribute('data-color')});
        if(this.eventAggregator) this.eventAggregator.trigger("colorChanged", this.model);
    },
    render : function(){
        $(this.el).html("");
        labels = new details.Views.Labels({
            model : this.model,
        });
        $(this.el).append(labels.render().el);

        members = new details.Views.Members({
            model : this.model,
            users : this.users,
        });
        $(this.el).append(members.render().el);

        actions = new details.Views.Actions({
            model : this.model
        });
        $(this.el).append(actions.render().el);
        $(document).foundation();
        return this;
    }
});
/***************************************/
details.Views.Comment = Backbone.View.extend({
    className : "comment",
    initialize : function(json) {
        //console.log("comment view constructor");
        _.bindAll(this, 'render');
        // Variables
        this.comment = json.comment;
        // Template
        this.template = _.template($('#details-comment-template').html());
    },
    render: function(){
        $(this.el).html("");
        var renderedContent = this.template({comment : this.comment.toJSON()});
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
details.Views.Comments = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.comments = json.comments;
        this.comments.bind("add", this.render);
        this.comments.bind("remove", this.render);
        this.user = json.user;
        // Templates
        this.template = _.template($('#details-comments-template').html());
    },
    events : {
        'submit form' : 'addComment',
        'click .remove' : 'removeComment'
    },
    addComment: function(e){
        e.preventDefault(); 
        //console.log('addComment !'); 
        
        this.comments.add({
            id:guid(),
            user : this.user,
            date : getDate(),
            content : $("#"+this.model.get('id')+"_input_comment").val()
        });
        this.model.save({comments : this.comments.toJSON()});
        /*On ajoute le commentaire au model*/
        // this.model.get('comments').unshift(new_comment);
        // this.model.save();

        /*On vide le formulaire*/
        $("#"+this.model.get('id')+"_input_comment").val("");
    },
    removeComment : function(e){
        //console.log('remove this comment !');
        e.preventDefault();
        comment = this.comments.get(e.target.getAttribute("data-id-comment"));
        this.comments.remove(comment);
        this.model.save({comments : this.comments.toJSON()});
        //console.log(comment)

    },
    render : function() {
        $(this.el).html("");
        // Each comment
        list_comment_views = [];
        this.comments.each(function(comment_){
            comment_view = new details.Views.Comment({comment: comment_});
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
details.Views.LeftPart = Backbone.View.extend({
    tagName: "div",
    className: "small-8 large-8 columns",
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.user = json.user;
        this.comments = json.comments;
        this.eventAggregator = json.eventAggregator;
        // Template

        this.template = _.template($("#details-title-ckeditor-template").html()); 
    },
    events : {
        "click .update_informations" : "update_informations",
    },
    update_informations : function(e){
        this.model.set({
            title:$("#"+ e.target.getAttribute('data-action')).val(),
            content:CKEDITOR.instances.editor.getData()
        });
        this.model.save();
        if(this.eventAggregator) this.eventAggregator.trigger("titleChanged", this.model);

    },
    render : function(){
        $(this.el).html("");
        //console.log("LEFT PART MODAL RENDER")
        // change k title and content template part
        var renderedContent = this.template({model:this.model.toJSON()});
        $(this.el).html(renderedContent);
        // Knowledge comments
        comments_view = new details.Views.Comments({
            comments:this.comments,
            model : this.model,
            user:this.user
        });
        $(this.el).append(comments_view.render().el);

        return this;
    }
});

/****************************************************************/
details.Views.DetailsTab = Backbone.View.extend({
    tagName:"div",
    className:"content active",
    id : "panelDetails",
    initialize : function(json) {
        _.bindAll(this, 'render');
        
        // Variables
        this.eventAggregator = json.eventAggregator;
        this.model = json.model;
        this.user = json.user; 
        this.users = json.users;
    },

    render : function() {              
         //console.log("CONCEPT MODAL RENDER")
        $(this.el).html("");
        // Left part
        leftPart_view = new details.Views.LeftPart({
            comments: this.model.get('comments'), 
            model:this.model,
            user:this.user,
            eventAggregator : this.eventAggregator
        });
        $(this.el).html(leftPart_view.render().el);
        // right part
        rightPart_view = new details.Views.RightPart({
            model:this.model,
            user:this.user,
            users : this.users,
            eventAggregator : this.eventAggregator
        });
        $(this.el).append(rightPart_view.render().el);
        return this;

    }
});
/****************************************************************/
details.Views.ActionTab = Backbone.View.extend({
    tagName:"div",
    className:"content",
    id : "panelAction",
    initialize : function(json) {
        _.bindAll(this, 'render');
        
        // Variables
        this.eventAggregator = json.eventAggregator;
        this.type = json.type,
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.links = json.links;
        this.model = json.model

    },

    render : function(){
        $(this.el).html("");
        if(this.type === "concept"){
            cklink_   = new cklink.Views.Main({
                current_concept : this.model,
                knowledges:this.knowledges,
                poches:this.poches,
                eventAggregator:this.eventAggregator,
                links:this.links,
                concepts : this.concepts
            });
            $(this.el).append(cklink_.render().el);
        }

        return this;
    }
});

/****************************************************************/
details.Views.ModalTabsContent = Backbone.View.extend({
    tagName:"div",
    className:"tabs-content",
    initialize : function(json) {
        _.bindAll(this, 'render');
        
        // Variables
        this.model = json.model;
        this.user = json.user;
        this.users = json.users;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.links = json.links;
        this.type = json.type;

    },
    render : function(){
        $(this.el).html("");
        detailsTab = new details.Views.DetailsTab({
            eventAggregator : this.eventAggregator,
            model : this.model,
            user : this.user, 
            users : this.users
        });
        $(this.el).append(detailsTab.render().el);

        actionTab = new details.Views.ActionTab({
                model : this.model,
                knowledges:this.knowledges,
                poches:this.poches,
                eventAggregator:this.eventAggregator,
                links:this.links,
                concepts : this.concepts,
                type : this.type
        });
        $(this.el).append(actionTab.render().el);
        return this;
    }
});
/****************************************************************/
details.Views.Modal = Backbone.View.extend({
    tagName:"div",
    className:"reveal-modal",
    id :"detailsModal",
    initialize : function(json) {
        _.bindAll(this, 'render');
        $(this.el).attr( "data-reveal","")
        
        // Variables
        this.model = json.model
        this.user = json.user;
        this.users = json.users;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.links = json.links;
        this.type = json.type;

        this.template = _.template($("#details-modal-template").html()); 

    },
    render : function(){
        
        $(this.el).html("");
        $(this.el).attr( "data-model-id",this.model.id);
        var renderedContent = this.template();
        $(this.el).append(renderedContent);

        tabs = new details.Views.ModalTabsContent({
            user : this.user,
            model : this.model,
            users : this.users,
            eventAggregator : this.eventAggregator,
            type : this.type,
            poches : this.poches,
            links : this.links,
            knowledges : this.knowledges,
            concepts : this.concepts
        });
        $(this.el).append(tabs.render().el);
        $(this.el).append('<a class="close-reveal-modal">&#215;</a>');
        return this;
    }
});



/***************************************/
details.Views.Main = Backbone.View.extend({
    el:"#details_container",
    initialize : function(json) {
        _.bindAll(this, 'render', 'nodeSelectionChanged','youhou');
        // Variables
        this.user = json.user;
        this.users = json.users;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.links = json.links;

        this.model = {};
        this.type = "concept";
        this.eventAggregator.on("nodeSelectionChanged", this.nodeSelectionChanged);
        this.eventAggregator.on("youhou", this.youhou);

    },

    youhou : function(e){
        this.model = this.concepts.get(e);
        this.render();
         $('#detailsModal').foundation('reveal', 'open');
    },
    nodeSelectionChanged : function (e){
        this.model = this.concepts.get(e);
        this.type = "concept";
        this.render(function(){
           $('#detailsModal').foundation('reveal', 'open'); 
        });
        

    },
    render : function(callback){
        
        //console.log("CONCEPT MODAL RENDER")
        $(this.el).html("");
        modal = new details.Views.Modal({
            user : this.user,
            model : this.model,
            users : this.users,
            eventAggregator : this.eventAggregator,
            type : this.type,
            poches : this.poches,
            links : this.links,
            knowledges : this.knowledges,
            concepts : this.concepts
        });
        $(this.el).append(modal.render().el);
        $(document).foundation();
        if(callback) callback();
    }
});




