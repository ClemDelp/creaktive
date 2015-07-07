/**************************************/
var ckSuggestion = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},

    eventAggregator : global.eventAggregator,
    el_actions_perc : "#actions_percentage",
    el_c_normalized : "#c_normalized_table",
    el_k_normalized : "#k_normalized_table",
    el_c_not_normalized : "#c_not_normalized_table",
    el_k_not_normalized : "#k_not_normalized_table",
    el_k_localized : "#k_localized_table",
    el_k_not_localized : "#k_not_localized_table",
    
    el_radar_detail : "#radar_detail_container",
    el_evaluation_suggestion : "#evaluations_table",

    el_objectif_radar : "#objectif_radar",
    el_objectif_sliders_container : "#objectif_sliders_container",
    el_objectif_suggestion_table : "#objectif_suggestion_table",
    
    init: function (json) {
        this.views.main = new this.Views.Main({
            el : "#suggestions_modal",
            elements : global.collections.Elements,
            //mode    : json.mode,
            project : global.models.currentProject,
        });
        this.views.main.get_normalisations();
    }
};
/***************************************/
ckSuggestion.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.elements = json.elements; 
        this.normalisations = {};
        this.evaluations = {};   
        this.project = global.models.currentProject;
        // Templates
        this.normalisation_tr = _.template($('#normalisation-suggestion-template').html());
        this.localisation_tr = _.template($('#normalisation-localisation-template').html());
        this.evaluation_tr = _.template($('#evaluation-suggestion-template').html());
        this.radar_detail = _.template($('#radar-detail-template').html());
        this.actions_perc = _.template($('#actions-percentage-template').html());

        this.objectif_slider = _.template($('#objectif-sliders-template').html());
        // Events
    },
    events : {
        "change .k_localisation" : "k_localisation",
        "change .template_selection" : "apply_template",
        "click .refresh" : "get_normalisations",
        "click .updateObjectifCanvas" : "updateObjectifCanvas"
    },
    /////////////////////////////////////////
    // ACTIONS
    /////////////////////////////////////////
    k_localisation : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({inside : value});
    },
    apply_template : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({css_manu : value});
    },
    /////////////////////////////////////////
    get_normalisations : function(){
        // Get normalisation suggestions
        $.post("/suggestion/get_normalisations",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(normalisations){
            ckSuggestion.views.main.normalisations = normalisations;
            console.log(normalisations)
            // STATUT
            var statuts = normalisations.statuts;
            var c_normalized = [];
            var k_normalized = [];
            var c_not_normalized = [];
            var k_not_normalized = [];
            statuts.forEach(function(statut){
                // set the target
                var type = statut.element.type;
                if(statut.normalized){
                    if(type == "concept") c_normalized.push(statut);
                    if(type == "knowledge") k_normalized.push(statut);
                }else{
                    if(type == "concept") c_not_normalized.push(statut);
                    if(type == "knowledge") k_not_normalized.push(statut);
                }
            });
            ckSuggestion.views.main.render_c_normalized(c_normalized);
            ckSuggestion.views.main.render_k_normalized(k_normalized);
            ckSuggestion.views.main.render_c_not_normalized(c_not_normalized);
            ckSuggestion.views.main.render_k_not_normalized(k_not_normalized);
            // LOCALISATION
            var k_localized = [];
            var k_not_localized = [];
            normalisations.localisations.forEach(function(localisation){
                if(localisation.element.inside != "") k_localized.push(localisation);
                else k_not_localized.push(localisation);
            });

            ckSuggestion.views.main.render_k_localized(k_localized);
            ckSuggestion.views.main.render_k_not_localized(k_not_localized);
            // Action menu render
            ckSuggestion.views.main.render_actions_perc({
                c_normalized : c_normalized,
                k_normalized : k_normalized,
                c_not_normalized : c_not_normalized,
                k_not_normalized : k_not_normalized,
                k_localized : k_localized,
                k_not_localized : k_not_localized
            });
        });
        // Get evaluation suggestions
        $.post("/suggestion/get_evaluations",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(evaluations){
            ckSuggestion.views.main.evaluations = evaluations;
            console.log(evaluations)
            // render
            ckSuggestion.views.main.render_evaluation(evaluations);
            ckSuggestion.views.main.render_suggestions(evaluations);
        });
        
    },
    ///////////////////////////////////
    updateObjectifCanvas : function(e){
        e.preventDefault();
        var evaluations = ckSuggestion.views.main.evaluations.evaluations;
        var data = {
            labels: [
                evaluations.originality.options[0].name.fr, 
                evaluations.variety.options[0].name.fr,
                evaluations.value.options[0].name.fr,
                evaluations.strength.options[0].name.fr
            ],
            datasets: [
                {
                    label: "Objectf",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "#C8D200",//"rgba(151,187,205,1)",
                    pointColor: "#C8D200",//"rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [
                        $("#Originality_objectif").attr('data-slider'), 
                        $("#Variety_objectif").attr('data-slider'), 
                        $("#Value_objectif").attr('data-slider'),
                        $("#Strength_objectif").attr('data-slider')
                    ]
                },
                {
                    label: "Evaluation",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
                    pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [
                        evaluations.originality.options[0].value, 
                        evaluations.variety.options[0].value, 
                        evaluations.value.options[0].value, 
                        evaluations.strength.options[0].value
                    ]
                }
            ]
        };

        ckSuggestion.views.main.generateChart(data,"objectif_radar_canvas",$("#objectif_radar").width(),$("#objectif_sliders_container").height());

    },
    generateChart : function(data,id,width,height){
        console.log(data,id,width,height)
        var ctx = document.getElementById(id).getContext("2d");
        ctx.canvas.width  = width;
        ctx.canvas.height = height;
        var myRadarChart = new Chart(ctx).Radar(data);
    },
    ///////////////////////////////////
    render_suggestions : function(json){
        var evaluations = json.evaluations;
        // init
        $(ckSuggestion.el_objectif_sliders_container).empty();
        // objectif sliders
        var parameters = [
            evaluations.originality.options[0],
            evaluations.variety.options[0],
            evaluations.value.options[0],
            evaluations.strength.options[0]
        ]
        $(ckSuggestion.el_objectif_sliders_container).append(this.objectif_slider({parameters : parameters}));
        
        var x = setInterval(function(){
            if($("#objectif_sliders_container").height() > 0){
                var data = {
                    labels: [
                        evaluations.originality.options[0].name.fr, 
                        evaluations.variety.options[0].name.fr,
                        evaluations.value.options[0].name.fr,
                        evaluations.strength.options[0].name.fr
                    ],
                    datasets: [
                        {
                            label: "Objectf",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "#C8D200",//"rgba(151,187,205,1)",
                            pointColor: "#C8D200",//"rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [
                                evaluations.originality.options[0].value, 
                                evaluations.variety.options[0].value, 
                                evaluations.value.options[0].value, 
                                evaluations.strength.options[0].value
                            ]
                        },
                        {
                            label: "Evaluation",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
                            pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [
                                evaluations.originality.options[0].value, 
                                evaluations.variety.options[0].value, 
                                evaluations.value.options[0].value, 
                                evaluations.strength.options[0].value
                            ]
                        }
                    ]
                };

                ckSuggestion.views.main.generateChart(data,"objectif_radar_canvas",$("#objectif_radar").width(),$("#objectif_sliders_container").height());

                $(document).foundation();
                clearInterval(x);   
            }
        }, 1000);
    },
    ///////////////////////////////////
    render_evaluation : function(json){
        var suggestions = json.suggestions;
        var evaluations = json.evaluations;
        // init
        $(ckSuggestion.el_radar_detail).empty();
        $(ckSuggestion.el_evaluation_suggestion).empty();
        // RADAR
        $(ckSuggestion.el_radar_detail).append(this.radar_detail({evaluations : evaluations}));
        
        var x = setInterval(function(){
            if($("#radar_detail_container").height() > 0){
                var data = {
                    labels: [
                        evaluations.originality.options[0].name.fr, 
                        evaluations.variety.options[0].name.fr,
                        evaluations.value.options[0].name.fr,
                        evaluations.strength.options[0].name.fr
                    ],
                    datasets: [
                        {
                            label: "Evaluation",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
                            pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [
                                evaluations.originality.options[0].value, 
                                evaluations.variety.options[0].value, 
                                evaluations.value.options[0].value, 
                                evaluations.strength.options[0].value
                            ]
                        }
                    ]
                };
                ckSuggestion.views.main.generateChart(data,"myEvaluationChart",$("#radar_graph_container").width(),$("#radar_detail_container").height());
                clearInterval(x);
            }
        }, 1000);

        // Suggestion tables
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_evaluation_suggestion).append(ckSuggestion.views.main.evaluation_tr({suggestion : suggestion}));
        });
    },
    render_actions_perc : function(json){

        var all = json.c_normalized.length + json.k_normalized.length + json.c_not_normalized.length + json.k_not_normalized.length + json.k_localized.length + json.k_not_localized.length
        var done =  json.c_normalized.length + json.k_normalized.length + json.k_localized.length;
        var perc = 0;

        if(all != 0) perc = Math.round((done*100/all)*100)/100;

        $(ckSuggestion.el_actions_perc).empty();
        $(ckSuggestion.el_actions_perc).append(this.actions_perc({perc : perc}));
    },
    render_k_localized : function(localisations){
        $(ckSuggestion.el_k_localized).empty();
        localisations.forEach(function(localisation){
            $(ckSuggestion.el_k_localized).append(ckSuggestion.views.main.localisation_tr({localisation : localisation}));
        });
    },
    render_k_not_localized : function(localisations){
        $(ckSuggestion.el_k_not_localized).empty();
        localisations.forEach(function(localisation){
            $(ckSuggestion.el_k_not_localized).append(ckSuggestion.views.main.localisation_tr({localisation : localisation}));
        });
    },
    render_c_normalized : function(suggestions){
        $(ckSuggestion.el_c_normalized).empty();
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_c_normalized).append(ckSuggestion.views.main.normalisation_tr({suggestion : suggestion}));
        });
    },
    render_c_not_normalized : function(suggestions){
        $(ckSuggestion.el_c_not_normalized).empty();
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_c_not_normalized).append(ckSuggestion.views.main.normalisation_tr({suggestion : suggestion}));
        });
    },
    render_k_normalized : function(suggestions){
        $(ckSuggestion.el_k_normalized).empty();
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_k_normalized).append(ckSuggestion.views.main.normalisation_tr({suggestion : suggestion}));
        });
    },
    render_k_not_normalized : function(suggestions){
        $(ckSuggestion.el_k_not_normalized).empty();
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_k_not_normalized).append(ckSuggestion.views.main.normalisation_tr({suggestion : suggestion}));
        }); 
    }
});
/**************************************/
