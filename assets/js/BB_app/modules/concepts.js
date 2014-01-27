//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/

concepts.Views.MapView = Backbone.View.extend({
    tagName: "div",
    initialize : function(json){

        _.bindAll(this, 'render','colorChanged',"titleChanged");
        _.bindAll(this, 'map');
        /*Concepts*/
        this.concepts = json.concepts;
        // this.concepts.bind('add', this.render);
        this.concepts.bind('reset', this.map);
        this.concepts.bind('remove', this.map);
        // this.concepts.bind('remove', this.remove);

        /*CurrentProject*/
        this.currentProject = json.currentProject;

        /*CurrentUser*/
        this.currentUser = json.currentUser;

        /*Current concept*/
        this.currentConcept = new global.Models.ConceptModel();

        /*EventAgregator*/
        this.eventAggregator = json.eventAggregator;
        this.eventAggregator.on("colorChanged", this.colorChanged);
        this.eventAggregator.on("titleChanged", this.titleChanged);

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

    titleChanged : function(e){
        console.log(e)
        mapModel.updateTitle(e.id, e.get('title'))
    },

    colorChanged : function(e){
        console.log(e);
        this.idea.updateAttr(e.id, "style", {background: e.get('color')});
        
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
        this.currentConcept = c0;

        this.idea = MAPJS.content(c0.toJSON());
        this.mapRepository.dispatchEvent('mapLoaded', this.idea);
        this.populate(c0.id, this.concepts.where({id_father : c0.id}));


        this.mapModel.addEventListener("openDetails", function(e){
            var concept_id = e;
            _this.eventAggregator.trigger("nodeSelectionChanged", concept_id);
            _this.currentConcept = _this.concepts.get(concept_id);
        })

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
            _this.concepts.remove(c)
            c.destroy();
            
        }
        if (command === 'changeParent') {
            c = _this.concepts.get(args[0]);
            c.set({id_father : args[1], old_father : c.get('id_father')});
            c.save();
        }
        if (command === 'undo') {
            console.log("UNDO ", command, args)
            

            if(args.eventMethod === "changeParent"){
                c = _this.concepts.get(args.eventArgs[0]);
                c.set({id_father : c.get('old_father')})
                c.save();
            }
            if(args.eventMethod === "addSubIdea"){
                c = _this.concepts.get(args.eventArgs[2]);
                _this.concepts.remove(c)
                c.destroy();
            }
            if(args.eventMethod === "updateTitle"){
                c = _this.concepts.get(args.eventArgs[0]);
                c.save();
            }
            if(args.eventMethod === "removeSubIdea"){
                c = _this.concepts.get(args.eventArgs[2]);
                c.save();
            }
            
        }
        if (command === 'redo') {
            console.log("REDO ", command, args)
        }
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
