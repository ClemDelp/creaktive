/////////////////////////////////////////////////
// K_details (modal)
/////////////////////////////////////////////////
/***************************************/
details.Views.Labels = Backbone.View.extend({
    tagName:"fieldset",
    initialize : function(json){
        _.bindAll(this, 'render');
        this.model = json.model;
        this.type = json.type;
        this.currentProject = json.currentProject;
        
        this.model.bind("change", this.render);

        this.template = _.template($('#details-labels-template').html()); 
    },

    render : function(){
        $(this.el).html("");
        var chosenLabel = ["#27AE60","#F39C12","#C0392B"];
        var modelColor = this.model.get('color');
        
        for (var i =0;  i<chosenLabel.length ; i++) {
            if(modelColor == chosenLabel[i]) chosenLabel[i] = "<img src='img/tick.png'></img>";
            else chosenLabel[i] ="";
        };
        
        var labels = []
        if(this.type === "concept") {
            labels[0] = {color :this.currentProject.get('cLabels')[0].color, label:this.currentProject.get('cLabels')[0].label};
            labels[1] = {color :this.currentProject.get('cLabels')[1].color, label:this.currentProject.get('cLabels')[1].label};
            labels[2] = {color :this.currentProject.get('cLabels')[2].color, label:this.currentProject.get('cLabels')[2].label};
        }
        if(this.type  === "knowledge") {
            labels[0] = {color :this.currentProject.get('kLabels')[0].color, label:this.currentProject.get('kLabels')[0].label};
            labels[1] = {color :this.currentProject.get('kLabels')[1].color, label:this.currentProject.get('kLabels')[1].label};
            labels[2] = {color :this.currentProject.get('kLabels')[2].color, label:this.currentProject.get('kLabels')[2].label};
        }

        var renderedContent = this.template({
            model:this.model.toJSON(),
            labels : labels,
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
        this.model = json.model;



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
        this.type = json.type;
        this.currentProject = json.currentProject;
    },
    events : {
        "click .setLabel" : "setLabel",
    },

    setLabel : function(e){
        //console.log("Set label");
        this.model.set({color: e.target.getAttribute('data-color')});
        this.model.save({color: e.target.getAttribute('data-color')});
        this.eventAggregator.trigger("colorChanged", this.model);
        this.eventAggregator.trigger("kColorChanged", this.model);
    },
    render : function(){
        $(this.el).html("");
        labels = new details.Views.Labels({
            model : this.model,
            type : this.type,
            currentProject : this.currentProject
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
details.Views.AttachedFiles = Backbone.View.extend({
    tagName : "fieldset",
initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render', 'fileAdded');
        // Variables

        this.model = json.model;

        this.files = this.model.get('attachment');

        this.eventAggregator = json.eventAggregator

        this.eventAggregator.on("uploadCompleted", this.fileAdded, this);
        // Templates
        this.template = _.template($('#details-files-template').html());
    },

    events : {
        "click .openFile" : "openFile",
        "click .removeFile" : "removeFile"
    },

    removeFile : function(e){
        console.log(e.target.getAttribute('data-file-id'))
        var i = {};
        _.each(this.files, function(f){
            if(f.id === e.target.getAttribute('data-file-id')) i = f
        })
        this.files =  _.without(this.files, i);
        this.model.set({attachment : this.files})
        this.model.save();
        socket.post("/file/destroy", {file : i});
        this.render();
    },

    openFile : function(e){
        console.log(e.target.getAttribute('data-file-path'));
        $.download('file/get',{path : e.target.getAttribute('data-file-path')} );

    },

    fileAdded : function (e){
        console.log("File : ", e);
        if(e.result === "success"){
            this.files.unshift({
                id : e.id,
                name : e.name,
                path : e.path
            });
            this.model.save();
            this.render();
        };

    },
    render : function(){
        $(this.el).html("")
        var renderedContent = this.template({files : this.files});
        $(this.el).append(renderedContent)
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
        e.preventDefault();
        this.model.set({
            title:$("#"+ e.target.getAttribute('data-action')).val(),
            content:CKEDITOR.instances.editor.getData()
        });
        this.model.save();
        this.eventAggregator.trigger("titleChanged", this.model);
        this.eventAggregator.trigger("kTitleChanged", this.model);

    },
    render : function(){
        $(this.el).html("");
        //console.log("LEFT PART MODAL RENDER")
        // change k title and content template part
        var renderedContent = this.template({model:this.model.toJSON()});
        $(this.el).html(renderedContent);
        
        files_ = new details.Views.AttachedFiles({
            eventAggregator : this.eventAggregator,
            model : this.model
        });
        $(this.el).append(files_.render().el);
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
        this.type = json.type;
        this.currentProject = json.currentProject;


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
            eventAggregator : this.eventAggregator,
            type : this.type,
            currentProject : this.currentProject
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
        this.model = json.model;
        this.user = json.user;

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

        if(this.type === "knowledge"){
            tagK_ = new tagK.Views.Main({
                current_knowledge : this.model,
                currentUser : this.user,
                poches:this.poches,
                eventAggregator:this.eventAggregator,
            });
            $(this.el).append(tagK_.render().el);
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
        this.currentProject = json.currentProject;

    },
    events : {
        "click .destroy" : "destroyModel",
    },


    destroyModel : function(e){
        if(this.type==="concept") this.concepts.remove(this.model);
        if(this.type==="knowledge") this.knowledges.remove(this.model);
        this.model.destroy();
        $('#detailsModal').foundation('reveal', 'close');    
    },
    render : function(){
        $(this.el).html("");
        detailsTab = new details.Views.DetailsTab({
            eventAggregator : this.eventAggregator,
            model : this.model,
            user : this.user, 
            users : this.users,
            type : this.type,
            currentProject : this.currentProject
        });
        $(this.el).append(detailsTab.render().el);

        actionTab = new details.Views.ActionTab({
                model : this.model,
                knowledges:this.knowledges,
                poches:this.poches,
                eventAggregator:this.eventAggregator,
                links:this.links,
                concepts : this.concepts,
                type : this.type,
                user : this.user
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
        this.currentProject = json.currentProject;

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
            concepts : this.concepts,
            currentProject : this.currentProject
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
        _.bindAll(this, 'render', 'nodeSelectionChanged','youhou',"onKSelected","onNotificationOpenK");
        _this = this;
        // Variables
        this.user = json.user;
        this.users = json.users;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        this.links = json.links;
        this.currentProject = json.currentProject;

        this.model = {};
        this.type = "concept";
        this.eventAggregator.on("nodeSelectionChanged", this.nodeSelectionChanged);
        this.eventAggregator.on("youhou", this.youhou);
        this.eventAggregator.on("kSelected", this.onKSelected)
        this.eventAggregator.on("notificationOpenK", this.onNotificationOpenK)

        // Reset the baseUrl of template manager
        //Backbone.TemplateManager.baseUrl = '{name}';
        
        // Create the upload manager object
        // this.uploadManager = new Backbone.UploadManager();

        // eventAggregator_ = this.eventAggregator;

        // this.uploadManager.on('filedone', function (e,f,g) {
        //     eventAggregator_.trigger("uploadCompleted",f._response.result);
        //     $('#uploadModal').foundation('reveal', 'close');
        // });

        // this.uploadManager.renderTo($('div#upload-container'));


    },

    youhou : function(e){
        console.log("Notification open C");
        this.model = this.concepts.get(e);
        this.type = "concept";
        this.render();
                this.render(function(){
           $('#detailsModal').foundation('reveal', 'open'); 
        }); 
    },
    nodeSelectionChanged : function (e){alert('open')
        console.log("C selected");
        this.model = this.concepts.get(e);
        this.type = "concept";
        this.render(function(){
           $('#detailsModal').foundation('reveal', 'open'); 
        });       
    },
    onKSelected : function(e){
        console.log("K selected");
        this.model = this.knowledges.get(e);
        this.type = "knowledge",
        this.render(function(){
           $('#detailsModal').foundation('reveal', 'open'); 
        });  
    },

    onNotificationOpenK : function(e){
            console.log("Notification open K");
                    this.model = this.knowledges.get(e);
        this.type = "knowledge";
        // this.render();
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
            concepts : this.concepts,
            currentProject : this.currentProject
        });
        $(this.el).append(modal.render().el);
                
        
        
        $(document).foundation();
        // Render it in our div
        if(callback) callback();
    }
});




