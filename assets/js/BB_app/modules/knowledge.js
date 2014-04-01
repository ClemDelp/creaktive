knowledge.Views.Main = Backbone.View.extend({
    tagName: "div",
    className: "panel small-12 medium-12 large-12",
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.user = json.user;
        this.knowledge = json.knowledge;
        this.files = this.knowledge.get('attachment');
        this.eventAggregator = json.eventAggregator;
        this.mode = "normal";
        this.template_knowledge_normal = _.template($('#knowledge-normal-template').html());
        this.template_knowledge_edition = _.template($('#knowledge-edition-template').html());
        // Events
        this.knowledge.bind('change',this.render);
    },
    events : {
        "click .openTagsModal"  : "openTagsModal",
        "click .openCommentsModal"  : "openCommentsModal",
        "click .openAttachmentModal"  : "openAttachmentModal",
        "click .edit"  : "editMode",
        "click .updateKnowledge"  : "updateKnowledge",
        "click .cancelEdition"  : "cancelEdition",
        "click .update"  : "updateKnowledge",
        "click .updateLabel" : "updateLabel",
        "click .remove" : "removeKnowledge",
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
        this.knowledge.set({attachment : this.files})
        this.knowledge.save();
        socket.post("/file/destroy", {file : i});
        this.render();
    },
    openFile : function(e){
        console.log(e.target.getAttribute('data-file-path'));
        $.download('file/get',{path : e.target.getAttribute('data-file-path')} );

    },
    cancelEdition : function(e){
        e.preventDefault();
        this.mode = "normal";
        this.render();
    },
    removeKnowledge : function(e){
        this.knowledge.destroy();
        $(this.el).hide('slow');    
    },
    updateLabel : function(e){
        e.preventDefault();
        this.knowledge.set({color:e.target.getAttribute("data-label-color")}).save();
        this.render();
    },
    updateKnowledge : function(e){
        e.preventDefault();
        //alert(CKEDITOR.instances.editor.getData())
        this.knowledge.set({
            user : this.user,
            title:$(this.el).find(".title").val(),
            content:CKEDITOR.instances.editor.getData(),
            date: getDate(),
            date2:new Date().getTime()
        });
        this.knowledge.save();
        this.mode = "normal";
        this.render();
    },
    editMode : function(e){
        e.preventDefault();
        this.mode = "edition";
        this.render();
        CKEDITOR.replaceAll('ckeditor');
    },
    openAttachmentModal: function(e){
        e.preventDefault();
        this.eventAggregator.trigger("openAttachmentModal",e.target.getAttribute("data-knowledge-id"));
    },
    openTagsModal: function(e){
        e.preventDefault();
        this.eventAggregator.trigger("openTagsModal",e.target.getAttribute("data-knowledge-id"));
    },
    openCommentsModal: function(e){
        e.preventDefault();
        this.eventAggregator.trigger("openCommentsModal",e.target.getAttribute("data-knowledge-id"));
    },
    render : function(){
        $(this.el).html('');
        // content
        if(this.mode == "normal"){
            $(this.el).append(this.template_knowledge_normal({knowledge : this.knowledge.toJSON()}));
        } else if(this.mode == "edition"){
            $(this.el).append(this.template_knowledge_edition({knowledge : this.knowledge.toJSON()}));    
        }
        
        return this;
    }
});
