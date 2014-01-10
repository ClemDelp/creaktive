//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/
concepts.Views.MapView = Backbone.View.extend({
    tagName: "div",
    initialize : function(json){

        _.bindAll(this, 'render');
        _.bindAll(this, 'map');
        /*Concepts*/
        this.concepts = json.concepts;
        // this.concepts.bind('add', this.render);
        this.concepts.bind('reset', this.map);
        // this.concepts.bind('remove', this.remove);

        /*CurrentProject*/
        this.currentProject = json.currentProject;

        /*CurrentUser*/
        this.currentUser = json.currentUser;

        /*EventAgregator*/
        this.eventAggregator = json.eventAggregator;

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

        window.mapModel = mapModel;
    },

    render: function(){
        var renderedContent ;
        renderedContent = this.template({concepts : this.concepts});
        $(this.el).html(renderedContent);
        return this;
    },

    map : function(){
        /*
        * Build the map and add listener
        */
        var c0, _this;
        _this = this; 
        c0 = this.concepts.findWhere({position : 0});
                 
        this.idea = MAPJS.content(c0.toJSON());
        this.mapRepository.dispatchEvent('mapLoaded', this.idea);
        this.populate(c0.id, this.concepts.where({id_father : c0.id}));

        this.mapModel.addEventListener('nodeSelectionChanged', function(e){
            var concept_id = e;
            _this.eventAggregator.trigger("nodeSelectionChanged", concept_id);
        });

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

            _this.concepts.create(new_concept);
        }
        if (command === 'updateTitle') {
            c = _this.concepts.get(args[0]);
            c.set({title : args[1]});
            c.save();
        }
        if (command === 'removeSubIdea') {
            c = _this.concepts.get(args[0]);
            $.get('/concept/destroy/' + args[0]);
            console.log(_this.concepts)
            
        }
        if (command === 'updateAttr') {
            if(args[1] === "style"){
                c = _this.concepts.get(args[0]);
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
            var c = this.concepts.where({id_father : children[i].id})
            if(c.length > 0){
                this.populate(children[i].id, c)
            }
        };
        
    },



});
