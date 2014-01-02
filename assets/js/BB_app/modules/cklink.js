/***********************************************/
cklink.Views.Poches = Backbone.View.extend({
    initialize : function(json) {
        console.log("KLINKED view initialise");
        // Variables
        this.current_filters = json.current_filters;
        this.poches = json.poches;
        // Events
        _.bindAll(this, 'render');
        // Template
        this.template = _.template($('#cklink-poches-template').html());  
    },
    events : {
        "change #cklink_poches" : "updateFilter"
    },
    updateFilter : function(e){
        this.current_filters.length = 0;
        filters = this.current_filters;
        $('#'+e.target.id+' :selected').each(function(i, selected){ 
          filters[i] = $(selected).val(); 
        });
        this.current_filters.trigger('change')
        console.log(this.current_filters)
    },
    render : function() {
        // Poches template
        var renderedContent = this.template({
            poches:this.poches.toJSON()
        });
        $(this.el).append(renderedContent);
        return this;
    }
});
/***********************************************/
cklink.Views.Knowledges = Backbone.View.extend({
    initialize : function(json) {
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges = json.knowledges;
        this.current_filters = json.current_filters;
        this.links = json.links;
        // Events
        _.bindAll(this, 'render');
        this.current_filters.on('change',this.render);
    },
    events : {
        "click .selectable" : "newLink",
    },
    newLink: function(e){
        // Change the background color
        var Class = e.target.className.split(',');
        var index = Class.indexOf('alert');
        if(index > -1){/* Deselection */$("#"+e.target.id).removeClass('alert');}
        else{/* Selection */$("#"+e.target.id).addClass('alert')}
        collapse("#"+e.target.id)
        // Create a new link
        var concept_id = this.current_concept.get('id');
        global.models.newLink = new global.Models.CKLink({
            id :guid(),
            user : "",
            date : getDate(),
            concept : concept_id,
            knowledge : e.target.getAttribute('data-id-knowledge')
        });
        // Save the new link and add it to links collection
        global.models.newLink.save();
        this.links.add([global.models.newLink]);

    },
    render : function() {
        $(this.el).html("");
        // Each Knowledge
        knowledges_el = this.el;
        current_filters = this.current_filters;
        this.knowledges.each(function(k){
            // Si les filtres sont inclu ds les tag du model
            if((_.intersection(k.get('tags'),this.current_filters).length == this.current_filters.length)||(this.current_filters[0] == "")){
                $(this.knowledges_el).append('<a id="cklink_'+k.get('id')+'" data-id-knowledge="'+k.get('id')+'" class="button tiny expand selectable">'+k.get('title')+'</a>');
            }
        });

        
        return this;
    }
});
/***********************************************/
cklink.Views.Acc2 = Backbone.View.extend({
    tagName:"div",
    className:"content",
    id:"panel2",
    initialize : function(json) {
        console.log("Acc2 view initialise");
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.links = json.links;

        this.current_filters = [];
        _.extend(this.current_filters, Backbone.Events); 

        // Events
        _.bindAll(this, 'render');
    },
    render : function() {
        // Poches view
        p_view = new cklink.Views.Poches({
            current_filters:this.current_filters,
            poches:this.poches
        });
        $(this.el).append(p_view.render().el);
        // Knowledges view
        // Accrodion klinked header
       
        k_view = new cklink.Views.Knowledges({
            current_filters:this.current_filters,
            knowledges:this.knowledges,
            current_concept: this.current_concept,
            links:this.links
        });
        $(this.el).append(k_view.render().el);
        return this;
    }
});
/***********************************************/
cklink.Views.Explorer = Backbone.View.extend({
    tagName: "dd",
    initialize : function(json) {
        console.log("KLINKED view initialise");
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.links = json.links;

        // Events
        _.bindAll(this, 'render');
    },
    render : function() {
        $(this.el).html('<a href="#panel2">Link K to ...</a> ');
        // Poches view
        acc2_view = new cklink.Views.Acc2({
            current_concept:this.current_concept,
            knowledges:this.knowledges,
            poches:this.poches,
            links:this.links
        });
        $(this.el).append(acc2_view.render().el);
        
        return this;
    }
});
/***********************************************/
cklink.Views.Klinked = Backbone.View.extend({
    tagName: "dd",
    initialize : function(json) {
        console.log("KLINKED view initialise");
        // Variables
        this.current_concept = json.current_concept;
        this.knowledges = json.knowledges;
        this.links = json.links;
        // Events
        _.bindAll(this, 'render');
        this.links.bind('add', this.render);
        this.links.bind('remove', this.render);
        // Template
        this.template = _.template($('#cklink-klinked-template').html());  
    },
    events : {
        "click .removeKtoC" : "removeLink",
    },
    removeLink: function(e){
        var current_concept_ = this.current_concept;
        var links_to_remove = this.links.filter(function(link){
            return (
                link.get('knowledge') == e.target.getAttribute('data-id-knowledge') &&
                link.get('concept') == this.current_concept_.get('id')
            );
        });
        links_to_remove.forEach(function(link){
            link.destroy();
        });
    },
    render : function() {
        $(this.el).html('');
        // Select the knowledge already linked
        current_concept_=this.current_concept;
        var links_list = this.links.filter(function(link){ 
            return link.get('concept') == this.current_concept_.get('id'); 
        });

        knowledges_list = new global.Collections.Knowledges();
        knowledges_ = this.knowledges;
        links_list.forEach(function(link){
            this.knowledges_list.add([this.knowledges_.get(link.get('knowledge'))]);
        });
        // klinked view
        var renderedContent = this.template({
            knowledges:knowledges_list.toJSON()
        });
        $(this.el).append(renderedContent);
        
        return this;
    }
});
/***********************************************/
cklink.Views.Accordion = Backbone.View.extend({
    tagName:"dl",
    className:"accordion",
    initialize: function(json){
        // Variables
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.current_concept = json.current_concept;
        this.links = json.links;
        // Events
        _.bindAll(this, 'render');

        $(this.el).attr( "data-accordion","")
    },
    render: function(){
        // Klinked view
        klinked = new cklink.Views.Klinked({
            current_concept:this.current_concept,
            knowledges:this.knowledges,
            links:this.links
        });
        $(this.el).append(klinked.render().el);
        // Explorer view
        explorer_view = new cklink.Views.Explorer({
            knowledges : this.knowledges,
            poches : this.poches,
            current_concept : this.current_concept,
            links:this.links
        });
        $(this.el).append(explorer_view.render().el);

        return this;
    }
});
/***********************************************/
cklink.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        console.log("CKLINK MAIN view initialise");
        // Variables
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.current_concept = json.current_concept;
        this.links = json.links;
        // Events
        _.bindAll(this, 'render');

        this.poches.bind('reset', this.render);
        this.poches.bind('add', this.render);
        this.poches.bind('remove', this.render);

        this.links.bind('reset', this.render);

        this.knowledges.bind('reset', this.render);
        this.knowledges.bind('add', this.render);
        this.knowledges.bind('remove', this.render);

        this.current_concept = new global.Models.ConceptModel({
            id :guid(),
            title : "Tutu le concept",
            user : "clem",
            date : getDate(),
            content : "lalala le content",
            color : "#FFF",
            id_father : ""
        });
        this.current_concept.on('change',this.render);
        // Template
        this.template = _.template($('#cklink-current-concept-template').html());       
    },
    render : function() {
        // Current concept view
        var renderedContent = this.template({
            concept:this.current_concept.toJSON()
        });
        $(this.el).html(renderedContent);
        // Accordion
        accordion = new cklink.Views.Accordion({
            knowledges:this.knowledges,
            poches:this.poches,
            links:this.links,
            current_concept:this.current_concept
        });
        $(this.el).append(accordion.render().el);
        $(document).foundation();
        return this;
    }
});
/***************************************/    