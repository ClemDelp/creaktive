//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/
concepts.Views.MapView = Backbone.View.extend({
    el : '#map-container',
    initialize : function(json){
        var container, mapRepository, isTouch, renderImages, idea, mapModel, pngExporter;
        _.bindAll(this, 'render');
        /*Concepts*/
        this.collection.bind('add', this.render);
        this.collection.bind('reset', this.render);
        this.collection.bind('remove', this.remove);

        /*CurrentProject*/
        this.currentProject = json.currentProject;

        /*CurrentUser*/
        this.currentUser = json.currentUser;

        /*EventAgregator*/
        this.eventAggregator = json.eventAggregator;

        /*currentNodeSelected*/
        this.currentNodeSelected = {};

        this.template = _.template($('#map-template').html());

        /* Map */
        container = $('#container');
        mapRepository = observable({});
        isTouch = false;
        renderImages = false;
        idea = MAPJS.content({});
        mapModel = new MAPJS.MapModel(mapRepository, MAPJS.KineticMediator.layoutCalculator);
        container.mapWidget(console,mapModel, isTouch, renderImages);
        jQuery('body').mapToolbarWidget(mapModel);
        jQuery('body').attachmentEditorWidget(mapModel);
        pngExporter = new MAPJS.PNGExporter(mapRepository);
        $("[data-mm-action='export-image']").click(pngExporter.exportMap);
        pngExporter.addEventListener('mapExported', function (url) {
            $("<img/>").attr('src',url).appendTo('body');
        });
        mapModel.addEventListener('analytic', console.log.bind(console));

        
        this.mapRepository = mapRepository;
        this.mapModel = mapModel;
        this.idea = idea;

    },

    events : {
        "click .known" : "evaluate",
        "click .reachable" : "evaluate",
        "click .alternative" : "evaluate",
    },

    render: function(){
        var renderedContent ;
        console.log("render");
        renderedContent = this.template({concepts : this.collection});
        $(this.el).html(renderedContent);
        this.map();
        return this;
    },

    map : function(){
        /*
        * Build the map and add listener
        */
        var c0, _this;
        _this = this; 
        c0 = this.collection.findWhere({id_father : ""});
        attr = {
            style : {
                background : c0.get('color')
            } 
        };  
        c0.set({attr:attr})                    
        if(!c0){
            c0 = new global.Models.ConceptModel({
                id : guid(),
                title : "c0",
                user : this.currentUser,
                // date, content, color
            });
            _this.collection.create(c0);
        }        

        _this.idea = MAPJS.content(c0.toJSON());
        _this.mapRepository.dispatchEvent('mapLoaded', _this.idea);

        _this.mapModel.addEventListener('nodeSelectionChanged', function(e){
            _this.eventAggregator.trigger("nodeSelectionChanged", e);
            _this.currentNodeSelected = e;
        });

        _this.populate(c0.id, this.collection.where({id_father : c0.id}));

        _this.idea.addEventListener('changed', function(command, args){
            _this.onMapChange(command, args);
        });
        
    },

    onMapChange : function(command, args){
        /*
        * Actions to realize on map change
        */
        console.log("******",command, args);
        _this = this;
        if (command === 'addSubIdea') {
            new_concept = new global.Models.ConceptModel({
                id : args[2],
                title : args[1],
                user : this.currentUser,
                id_father : args[0]
                // date, content, color
            });

            _this.collection.create(new_concept);
        }
        if (command === 'updateTitle') {
            c = _this.collection.get(args[0]);
            c.set({title : args[1]});
            c.save();
        }
        if (command === 'removeSubIdea') {
            c = _this.collection.get(args[0]);
            $.get('/concept/destroy/' + args[0]);
            console.log(_this.collection)
            
        }
        if (command === 'updateAttr') {
            if(args[1] === "style"){
                c = _this.collection.get(args[0]);
                c.set({color:args[2].background});
                c.save();
            }
        }
        // if (command === 'addSubIdea') {
        // }
        // if (command === 'addSubIdea') {
        // }
    },

    populate : function(id_father, children){
        /*
        * Populate the map with the DB objects
        */
        for (var i = children.length - 1; i >= 0; i--) {
            this.mapModel.createFromDB(id_father, children[i].toJSON())
            var c = this.collection.where({id_father : children[i].id})
            if(c.length > 0){
                this.populate(children[i].id, c)
            }
        };
        
    },

    evaluation : [
        {
            level : "known",
            color : "#01DFD7",
        },
        {
            level : "reachable",
            color : "#08298A",
        },
        {
            level : "alternative",
            color : "#088A68",
        },

    ],

    evaluate : function (e) {
        /*
        * Color the concept with the color of the evaluation
        */
        e.preventDefault();
        var color = _.findWhere(this.evaluation, {level : e.target.getAttribute("level")}).color ;
        this.mapModel.updateStyle("Evaluation", "background", color);
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
        var renderedContent ;
        renderedContent = this.template({currentConcept : {title : "null"}});
        $(this.el).html(renderedContent);
        return this;
    }
});