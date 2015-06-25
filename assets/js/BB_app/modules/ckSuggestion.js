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
    el_c_normalized : "#c_normalized_table",
    el_k_normalized : "#k_normalized_table",
    el_c_not_normalized : "#c_not_normalized_table",
    el_k_not_normalized : "#k_not_normalized_table",
    el_k_localisation : "#localisation_table",
    el_radar_detail : "#radar_detail_container",

    el_evaluation_suggestion : "#evaluations_table",


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
        //this.mode    = json.mode;
        this.project = global.models.currentProject;
        // Templates
        this.normalisation_tr = _.template($('#normalisation-suggestion-template').html());
        this.localisation_tr = _.template($('#normalisation-localisation-template').html());
        this.evaluation_tr = _.template($('#evaluation-suggestion-template').html());
        this.radar_detail = _.template($('#radar-detail-template').html());
        // Events
    },
    events : {
        "change .k_localisation" : "k_localisation",
        "change .template_selection" : "apply_template", 
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
            ckSuggestion.views.main.render_localisations(normalisations.localisations);
            
        });
        // Get evaluation suggestions
        $.post("/suggestion/get_evaluations",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(json){
            ckSuggestion.views.main.render_evaluation(json)
        });
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
            if($("#radar_detail_container").height() > 100){
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
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
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
                var ctx = document.getElementById("myEvaluationChart").getContext("2d");
                ctx.canvas.width  = $("#radar_graph_container").width() - 50;
                ctx.canvas.height = $("#radar_detail_container").height() - 50;
                console.log(ctx.canvas.width,ctx.canvas.height)
                var myRadarChart = new Chart(ctx).Radar(data);

                clearInterval(x);
            }
        }, 1000);

        // Suggestion tables
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_evaluation_suggestion).append(ckSuggestion.views.main.evaluation_tr({suggestion : suggestion}));
        });
    },
    render_localisations : function(localisations){
        $(ckSuggestion.el_k_localisation).empty();
        localisations.forEach(function(localisation){
            $(ckSuggestion.el_k_localisation).append(ckSuggestion.views.main.localisation_tr({localisation : localisation}));
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
