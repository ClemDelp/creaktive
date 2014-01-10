
/////////////////////////////////////////////////
// Explorer
/////////////////////////////////////////////////
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
        "change .color" : "changeColor",
        "click .add" : "addPoche",
        "click .removePoche" : "removePoche",
        "click .selectable" : "selection"
    },
    removePoche: function(e){
        var poche = this.poches.get(e.target.getAttribute('data-id-poche'));
        poche.destroy();
        this.current_filters.length = 0;
    },
    changeColor: function(e){
        var poche = this.poches.get(e.target.getAttribute('data-id-poche'));
        poche.set('color',e.target.value);
        poche.save();
    },
    selection: function(e){
        console.log("filter selected");
        var Class = e.target.className.split(' ');
        var index = Class.indexOf('alert');
        if(index > -1){
            /* Deselection */
            var indexFilter = this.current_filters.indexOf(e.target.getAttribute("data-filter-title"));
            if(indexFilter > -1){this.current_filters.splice(indexFilter,1);}
            $("#"+e.target.id).removeClass('alert');
            this.current_filters.trigger('change',e.target.getAttribute("data-filter-title"));
        }
        else{
            /* Selection */
            if(e.target.id !="notClassified"){$('#notClassified').removeClass('success');}// On deselectionne notClassified
            this.current_filters.unshift(e.target.getAttribute("data-filter-title"));
            if(e.target.getAttribute("data-filter-title") == "notClassified"){
                this.current_filters.length=0;
                this.render();
                this.current_filters.trigger('notClassified');
            }else{
                this.current_filters.trigger('change',e.target.getAttribute("data-filter-title"));
            }
            $("#"+e.target.id).addClass('alert');
        }
        console.log("current filters",this.current_filters)
    },
    addPoche : function(e){
        console.log("Add a new poche");
        global.models.newP = new global.Models.Poche({
            id: guid(),
            title: $("#newP").val(),
            user : "clem",
            color : "#FF0000",
            description : $("#newP_description").val(),
            date : getDate()
        });
        global.models.newP.save();
        this.poches.add(global.models.newP);
        this.current_filters.length = 0;
        this.current_filters.trigger('newPoche');
    },   
    render : function() {
        var renderedContent = this.template({poches:this.poches.toJSON()});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});

/***********************************************/
explorer.Views.Post = Backbone.View.extend({
    className: "small-2 large-2 columns",
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
    events : {
        "click .selectable" : "changeClass",
        "click .details" : "open_modal_details_box"
    },
    open_modal_details_box :function(e){
        k_details.views.modal = new k_details.Views.Main({
            knowledge:this.knowledge,
            user:this.user
        });
        k_details.views.modal.render();
        $('#detailsKnoledgeModal').foundation('reveal', 'open');
    },
    changeClass : function(e){
        var Class = this.el.className.split(' ');
        var index = Class.indexOf('callout');
        if(index > -1){
            /* Deselection */
            $(this.el).removeClass('callout')
        }
        else{
            /* Selection */
            $(this.el).addClass('callout')
        }
    },
    render : function() {
        // Post header
        var renderedContent = this.template({post:this.knowledge.toJSON()});
        $(this.el).html(renderedContent);
        // Post content
        // postDetails_view = new explorer.Views.PostDetails({
        //     knowledge:this.knowledge,
        //     user:this.user
        // });
        // $(this.el).append(postDetails_view.render().el);

        return this;
    }
});
/***********************************************/
explorer.Views.Search = Backbone.View.extend({
    initialize : function(json) {
        console.log("Search view constructor");
        _.bindAll(this, 'render');
        // Variables
        this.current_selection = json.current_selection;
        this.knowledges = json.knowledges;
        // Template
        this.template = _.template($('#search-template').html());
    },
    events : {
        "change .search" : "search",
    },
    search: function(e){
        this.knowledges.each(function(k){
            if(k.get('title').toLowerCase() == e.target.value.toLowerCase()){
                alert("Match!");
            }
        });
    },
    render: function(){
        var renderedContent = this.template();
        $(this.el).html(renderedContent);
        return this;
    }
});
/***************************************/
explorer.Views.Posts = Backbone.View.extend({
    
    className : "small-10 large-10 columns",
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


        this.template = _.template($('#publish-module-template').html());
        
    },
    applyFilterToSelection: function(pocheTitle){
        console.log("Manage filters");
        collection = this.knowledges;
        this.current_selection.forEach(function(k_id){
            k = this.collection.get(k_id);
            if(_.union(k.get('tags'),this.current_filters).length == k.get('tags').length){
                console.log("On enlève le tag de K: "+pocheTitle);
                k.get('tags').splice(_.indexOf(k.get('tags'),pocheTitle),1);
            }else{
                console.log("On update les tags de K avec: "+_.union(k.get('tags'),this.current_filters));
                k.set('tags',_.union(k.get('tags'),this.current_filters));
            }
            k.save();
        });
        this.current_selection.length = 0;
        this.current_selection.trigger('change');
        this.render();
        
    },
    events : {
        "click .addPost" : "addKnowledge",
        "click .removePost" : "removeKnowledge",
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
    removeKnowledge: function(e){
        knowledge = this.knowledges.get(e.target.getAttribute('data-id-post'));
        knowledge.destroy();
    },
    addKnowledge : function(e){
        console.log("Add knowledge");
        var tags = [];
        this.current_filters.forEach(function(f){tags.unshift(f)})
        global.models.newK = new global.Models.Knowledge({
            id:guid(),
            user: this.user,
            title : $('#new_k_title').val(),
            //content : CKEDITOR.instances.new_k_content.getData(),
            tags: this.current_filters,
            comments:[],
            date: getDate(),
            date2:new Date().getTime()
        });
        global.models.newK.save();
        this.knowledges.add(global.models.newK);
        this.current_selection.trigger("create",global.models.newK.get('id'));
    },
    displayNotClassified: function(){
        // Publish module template
        var renderedContent = this.template({
            filters:this.current_filters,
            user:this.user.toJSON()
        });        
        $(this.el).html(renderedContent);

        // search Bar
        search_view = new explorer.Views.Search({
            current_selection:this.current_selection,
            knowledges: this.knowledges
        });
        $(this.el).append(search_view.render().el);

        
        // Each Post
        knowledges_el = this.el;
        user_ = this.user;
        this.knowledges.each(function(k){
            // Si comments est un array on le transforme en collection ds le model
            if($.type(k.get('comments')) == "array"){k.set('comments',new global.Collections.Comments(k.get('comments')));}
            // Si le model n'a pas de tags
            if(k.get('tags').length == 0){
                knowledge_v = new explorer.Views.Post({knowledge:k,user:this.user_});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        return this;
    },
    render : function(){
        // Publish module template
        var renderedContent = this.template({
            filters:this.current_filters,
            user:this.user.toJSON()
        });
        $(this.el).html(renderedContent);

        // search Bar
        // search_view = new explorer.Views.Search({
        //     current_selection:this.current_selection,
        //     knowledges: this.knowledges
        // });
        // $(this.el).append(search_view.render().el);

        // Each Post
        knowledges_el = this.el;
        current_filters = this.current_filters;
        user_ = this.user;
        this.knowledges.each(function(k){
            // Si comments est un array on le transforme en collection ds le model
            if($.type(k.get('comments')) == "array"){k.set('comments',new global.Collections.Comments(k.get('comments')));}
            // Si les filtres sont inclu ds les tag du model
            if(_.intersection(k.get('tags'),this.current_filters).length == this.current_filters.length){
                knowledge_v = new explorer.Views.Post({knowledge:k,user:this.user_});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        checkContainer();
        return this;
    }
});
/***********************************************/
explorer.Views.Main = Backbone.View.extend({
    tagName : "div",
    //className : "row",
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
    },
    render : function() {
        // Poches
        filter = new explorer.Views.Poches({
            poches:this.poches,
            currentFilters:this.current_filters
        });
        $(this.el).append(filter.render().el);
        // Knowledges
        knowledges = new explorer.Views.Posts({
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

