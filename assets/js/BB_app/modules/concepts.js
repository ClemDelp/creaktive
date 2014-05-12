/////////////////////////////////////////
// Modal
/////////////////////////////////////////
concepts.Views.semanticModal = Backbone.View.extend({
    el:"#concepts_semanticModal_container",
    initialize:function(json){
        _.bindAll(this, 'render', 'openSemanticModal');
        // Variables
        this.links = json.links;
        this.concept = {};
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        this.knowledges_list = [];
        // Events
        this.eventAggregator.on("openSemanticModal", this.openSemanticModal);
        // Templates
        this.template_modal = _.template($('#concepts-semanticModal-template').html()); 
    },
    events: {
        "click .linkToC" : "linkToC"
    },
    linkToC : function(e){
        e.preventDefault();
        _this = this;
        new_cklink = new global.Models.CKLink({
            id : guid(),
            user : "",
            date : getDate(),
            concept : this.concept.get('id'),
            knowledge : this.knowledges.get(e.target.getAttribute("data-id-knowledge"))
        });
        new_cklink.save();
    },
    openSemanticModal : function(json){
        this.concept = json.from;
        hits = json.hits;
        _this = this;

        hits.forEach(function(knowledge){
            _this.knowledges.each(function(_knowledge){
                if(knowledge._source.id == _knowledge.get('id')){_this.knowledges_list.unshift(_knowledge);}    
            });
        })
        this.render(function(){
            $('#concepts_semanticModal_container').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html('');
        $(this.el).append(this.template_modal({knowledges : this.knowledges_list}));
        // openModal callback to reveal the modal
        if(callback) callback();
    }
});
//////////////////////////////////////////////////////////////////
// views
//////////////////////////////////////////////////////////////////
concepts.Views.MapView = Backbone.View.extend({
    tagName: "div",
    initialize : function(json){

        _.bindAll(this, 'render','colorChanged',"titleChanged","onConceptRemoved","map");
        // Vaiables
        this.links = json.links;
        this.concepts = json.concepts;
        this.eventAggregator = json.eventAggregator;
        this.currentProject = json.currentProject;
        this.currentUser = json.currentUser;
        this.currentConcept = new global.Models.ConceptModel();
        this.knowledges = json.knowledges;
        this.semanticModal_view = new concepts.Views.semanticModal({
            links : this.links,
            knowledges : this.knowledges,
            eventAggregator : this.eventAggregator
        });
        // Events
        this.concepts.bind('reset', this.map);        
        this.eventAggregator.on("colorChanged", this.colorChanged);
        this.eventAggregator.on("titleChanged", this.titleChanged);
        this.eventAggregator.on("conceptRemoved", this.onConceptRemoved);
        // Template
        this.template = _.template($('#map-template').html());
        // MAP
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
            window.location = url;

            // var oImage = document.getElementById(url);
            // var imgCanvas = document.createElement("canvas");
            // document.body.appendChild(imgCanvas);
            // if (typeof imgCanvas.getContext == "undefined" || !imgCanvas.getContext) {
            //     alert("browser does not support this action, sorry");
            //     return false;
            // }

            // try {
            //     var context = imgCanvas.getContext("2d");
            //     var width = oImage.width;
            //     var height = oImage.height;
            //     imgCanvas.width = width;
            //     imgCanvas.height = height;
            //     imgCanvas.style.width = width + "px";
            //     imgCanvas.style.height = height + "px";
            //     context.drawImage(oImage, 0, 0, width, height);
            //     var rawImageData = imgCanvas.toDataURL("image/png;base64");
            //     rawImageData = rawImageData.replace("image/png", "image/octet-stream");
            //     document.location.href = rawImageData;
            //     document.body.removeChild(imgCanvas);
            // }
            // catch (err) {
            //     console.log(err)
            //     document.body.removeChild(imgCanvas);
            //     alert("Sorry, can't download");
            // }

            // return true;

        });

        mapModel.addEventListener('analytic', console.log.bind(console));

        
        this.mapRepository = mapRepository;
        this.mapModel = mapModel;
        this.idea = idea;

        window.mapModel = mapModel;
    },

    onConceptRemoved : function(e){
        global.collections.Concepts.fetch({reset:true});
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
        //Modal
        this.semanticModal_view.render();
        $(document).foundation();

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
        
        //this.populate(c0.id, this.concepts.where({id_father : c0.id}));
        socket.get("/concept/generateTree", function(data){
            _this.idea = MAPJS.content(data.tree);
            _this.mapRepository.dispatchEvent('mapLoaded', _this.idea);
            // _this.mapModel.addEventListener("nodeSelection", function(id){
            //     socket.post('/elasticsearch/searchKnowledge',{nodeTitle: _this.concepts.get(id).get('title')}, function (response) {
            //         console.log('Hits! ',response)
            //         if(response.hits.hits.length > 0){
            //             _this.eventAggregator.trigger('title_notification',{
            //                 msg : response.hits.hits.length+" knowledge(s) matched for "+_this.concepts.get(id).get('title')+"!",
            //                 type: "success",
            //                 from : _this.concepts.get(id),
            //                 hits : response.hits.hits
            //             });
            //         }else{
            //             _this.eventAggregator.trigger('title_notification',{
            //                 msg : "no matching for "+_this.concepts.get(id).get('title')+"!",
            //                 type : "secondary",
            //                 hits : {}
            //             })
            //         }
                    
            //     });
            // });
            _this.mapModel.addEventListener("openDetails", function(e){
                var concept_id = e;
                _this.eventAggregator.trigger("nodeSelectionChanged", concept_id);
                _this.currentConcept = _this.concepts.get(concept_id);
            })

            _this.idea.addEventListener('changed', function(command, args){
                _this.onMapChange(command, args);
            });
        })


        
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
                id_father : args[0],
                position : _this.concepts.get(args[0]).get("position") + 1
                siblingOrder : 
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
        if (command === 'insertIntermediate') {
            console.log("insertIntermediate ", command, args)
            c = _this.concepts.get(args[0]);
            _this.concepts.create({
                id : args[2],
                title : args[1],
                user : this.currentUser,
                id_father : c.get('id_father')
                // date, content, color
            })

            c.set({id_father : args[2]});
            c.save();
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
