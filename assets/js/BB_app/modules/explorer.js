/////////////////////////////////////////////////////////////////////
/*Module explorer*/
/////////////////////////////////////////////////////////////////////
explorer.Views.Poches = Backbone.View.extend({
    tagName: "div",
    className: "panel",
    initialize : function(json) {
        console.log("Poches view initialise");
        _.bindAll(this, 'render');
        /*Poches*/
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        /*Template*/
        this.template = _.template($('#poches-template').html());
        /*Variables*/
        this.current_filters = json.currentFilters;
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
        this.collection.add(global.models.newP);
        this.current_filters.length = 0;
        this.current_filters.trigger('newPoche');
    },
    removePoche : function(e){
        console.log("Remove the poche");
    },    
    render : function() {
        var renderedContent = this.template({poches:this.collection.toJSON()});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
explorer.Views.Knowledge = Backbone.View.extend({
    className : "panel",
    initialize : function() {
        console.log("Knowedge view initialise");
        _.bindAll(this, 'render');
        /*Knowledge*/
        this.model.bind('reset', this.render);
        this.model.bind('add', this.render);
        this.model.bind('remove', this.render);
        /*Template*/
        this.template = _.template($('#knowledge-template').html());
    },
    events : {
        "click .remove" : "removeKnowledge",
        "click .selectable" : "manageClass"
    },
    manageClass: function(){
        if(_.indexOf($(this.el).context.className.split(" "),'callout') > -1){
            $(this.el).removeClass("callout");
        }else{
            $(this.el).addClass("callout");
        }
    },
    removeKnowledge : function(e){
        conole.log("Remove the knowledge");
    },
    render : function() {
        var renderedContent = this.template({knowledge:this.model.toJSON()});
        $(this.el).html(renderedContent);
        $(document).foundation();
        return this;
    }
});
/***********************************************/
explorer.Views.Knowledges = Backbone.View.extend({
    initialize : function(json) {
        console.log("Knowledges view initialise");
        _.bindAll(this, 'render');
        /*Knowledges*/
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        /*Template*/
        this.template = _.template($('#knowledges-template').html());
        /*Variables*/
        this.current_filters = json.currentFilters;
        this.current_filters.on('change',this.applyFilterToSelection, this);
        this.current_filters.on('newPoche',this.render, this);
        this.current_filters.on('notClassified',this.displayNotClassified, this);
        this.current_selection = json.current_selection;

    },
    applyFilterToSelection: function(pocheTitle){
        console.log("Manage filters");
        collection = this.collection;
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
        "click .add" : "addKnowledge",
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
            title : $("#newK").val(), 
            content : "", 
            user : "clem", 
            date : getDate(), 
            color : "#FFF", 
            tag : tags
        });
        console.log("this current filters: ",this.current_filters)
        global.models.newK.save();
        this.collection.add(global.models.newK);
        this.current_selection.trigger("create",global.models.newK.get('id'));
    },
    displayNotClassified: function(){
        var renderedContent = this.template();
        $(this.el).html(renderedContent);
        knowledges_el = this.el;
        this.collection.each(function(k){
            if(k.get('tag').length == 0){
                knowledge_v = new explorer.Views.Knowledge({model:k});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        return this;
    },
    render : function(){
        var renderedContent = this.template();
        $(this.el).html(renderedContent);
        knowledges_el = this.el;
        current_filters = this.current_filters;
        this.collection.each(function(k){
            if(_.intersection(k.get('tag'),this.current_filters).length == this.current_filters.length){
                knowledge_v = new explorer.Views.Knowledge({model:k});
                $(this.knowledges_el).append(knowledge_v.render().el);
            }
        });
        return this;
    }
});
/***********************************************/
explorer.Views.Explorer = Backbone.View.extend({
    tagName : "div",
    initialize : function(json) {
        console.log("Explorer view initialise");
        _.bindAll(this, 'render');
        /*Poches*/
        this.poches = json.poches;
        /*Variables*/
        this.current_filters = [];
        _.extend(this.current_filters, Backbone.Events);
        this.current_selection = json.current_selection;
    },
    render : function() {
        filter = new explorer.Views.Poches({collection:this.poches,currentFilters:this.current_filters});
        $(this.el).append(filter.render().el);
        knowledges = new explorer.Views.Knowledges({collection:this.collection,currentFilters:this.current_filters,current_selection:this.current_selection});
        $(this.el).append(knowledges.render().el);
        $(document).foundation();
        return this;
    }
});