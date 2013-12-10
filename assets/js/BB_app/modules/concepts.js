//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/
concepts.Views.MapView = Backbone.View.extend({
    el : '#map-container',
    initialize : function(json){
        _.bindAll(this, 'render');
        /*Concepts*/
        this.collection.bind('add', this.render);
        this.collection.bind('reset', this.render);
        this.collection.bind('remove', this.remove);

        /*CurrentProject*/
        this.currentProject = json.currentProject;

        /*EventAgregator*/
        this.eventAggregator = json.eventAggregator;

        this.template = _.template($('#map-template').html());

    },

    render: function(){
        var renderedContent = this.template({concepts : this.collection});
        $(this.el).html(renderedContent);
        this.map();
        return this;
    },

    map : function(){
        var c0; 
        c0 = this.collection.findWhere({id_father : ""})                       
        if(!c0){
            c0 = new global.Models.ConceptModel({
                id : guide(),
                title : "c0",
                user : this.currentUser,
                // date, content, color
            })
        }
        window.onerror = alert;
        var container = $('#container'),
        mapRepository = observable({}),
        isTouch = false,
        renderImages = false;
        var idea = MAPJS.content(c0.toJSON());
        mapModel = new MAPJS.MapModel(mapRepository, MAPJS.KineticMediator.layoutCalculator);
        container.mapWidget(console,mapModel, isTouch, renderImages);
        jQuery('body').mapToolbarWidget(mapModel);
        jQuery('body').attachmentEditorWidget(mapModel);
        var pngExporter = new MAPJS.PNGExporter(mapRepository);
        $("[data-mm-action='export-image']").click(pngExporter.exportMap);
        pngExporter.addEventListener('mapExported', function (url) {
            $("<img/>").attr('src',url).appendTo('body');
        });
        mapModel.addEventListener('analytic', console.log.bind(console));
        mapRepository.dispatchEvent('mapLoaded', idea);
        window.mapModel = mapModel;
        window.idea = idea;

        mapModel.addEventListener('nodeSelectionChanged', function(e){
            _this.eventAggregator.selectedNode = e;
            _this.eventAggregator.trigger("nodeSelectionChanged", e)
        });

        this.populate(c0.id, this.collection.where({id_father : c0.id}));

        idea.addEventListener('changed', function(command, args){
            console.log("******",command, args);
            if (command === 'addSubIdea') {
                new_concept = new global.Models.ConceptModel({
                    id : guid(),
                    title : args[1],
                    user : this.currentUser,
                    // date, content, color
                });

                new_concept.save();
            }
            if (command === 'updateTitle') {
            }
            // if (command === 'addSubIdea') {
            // }
            // if (command === 'addSubIdea') {
            // }
            // if (command === 'addSubIdea') {
            // }
            // if (command === 'addSubIdea') {
            // }
        });
        
    },

    populate : function(id_father, children){

        for (var i = children.length - 1; i >= 0; i--) {
            mapModel.createFromDB(id_father, children[i].toJSON())
            var c = this.collection.where({id_father : children[i].id})
            if(c.length > 0){
                this.populate(children[i].id, c)
            }
        };
        
    },


});
/****************************************************************/
concepts.Views.KnowledgeView = Backbone.View.extend({
    el : '#knowledge-container',
    initialize : function(json){
        _.bindAll(this, 'render');
        _.bindAll(this, 'selectedNodeChange');

        /*Concepts*/
        this.concepts = json.concepts;
        
        /*EventAgregator*/
        this.eventAggregator = json.eventAggregator;

        this.eventAggregator.on("nodeSelectionChanged", this.selectedNodeChange);

        this.template = _.template($('#knowledge-template').html());
    },

    selectedNodeChange : function(id_concept){
        var currentConcept, renderedContent, _this;
        _this = this;
        try{
            currentConcept = this.concepts.get(id_concept);
            renderedContent = this.template({currentConcept : currentConcept.toJSON()});
            $(this.el).html(renderedContent);
        }catch(e){
            console.log(e)
        }

    },

    render: function(){
        var renderedContent = this.template({currentConcept : {title : "null"}});
        $(this.el).html(renderedContent);
        return this;
    }
});