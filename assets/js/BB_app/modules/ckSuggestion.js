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
    el_evaluation_radar : "#graph_radar_evaluation",
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
        this.evaluation_tr = _.template($('#evaluation-suggestion-template').html());
        this.radar = _.template($('#evaluation-radar-template').html());
        // Events
    },
    events : {
        "click .k_localisation" : "k_localisation",
        "change .template_selection" : "apply_template", 
    },
    /////////////////////////////////////////
    get_normalisations : function(){
        // Get normalisation suggestions
        $.post("/suggestion/get_normalisations",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(suggestions){
            var c_normalized = [];
            var k_normalized = [];
            var c_not_normalized = [];
            var k_not_normalized = [];
            suggestions.forEach(function(suggestion){
                // set the target
                var type = suggestion.element.type;
                if(suggestion.normalized){
                    if(type == "concept") c_normalized.push(suggestion);
                    if(type == "knowledge") k_normalized.push(suggestion);
                }else{
                    if(type == "concept") c_not_normalized.push(suggestion);
                    if(type == "knowledge") k_not_normalized.push(suggestion);
                }
            });
            ckSuggestion.views.main.render_c_normalized(c_normalized);
            ckSuggestion.views.main.render_k_normalized(k_normalized);
            ckSuggestion.views.main.render_c_not_normalized(c_not_normalized);
            ckSuggestion.views.main.render_k_not_normalized(k_not_normalized);
        });
        // Get evaluation suggestions
        $.post("/suggestion/get_evaluations",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(json){
            console.log(json)
            ckSuggestion.views.main.render_evaluation(json)
        });
    },
    /////////////////////////////////////////
    // ACTIONS
    /////////////////////////////////////////
    k_localisation : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = e.target.getAttribute('data-value');
        element.save({inside : value});
    },
    apply_template : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({css_manu : value});
    },
    ///////////////////////////////////
    render_evaluation : function(json){
        var suggestions = json.suggestions;
        var evaluations = json.evaluations;
        // init
        $(ckSuggestion.el_evaluation_radar).empty();
        $(ckSuggestion.el_evaluation_suggestion).empty();
        // RADAR
        $(ckSuggestion.el_evaluation_radar).append(this.radar({evaluations : evaluations}));
        var data = {
            labels: [
                evaluations.options.originality.name.fr, 
                evaluations.options.variety.name.fr,
                evaluations.options.value.name.fr,
                evaluations.options.strength.name.fr
            ],
            datasets: [
                {
                    label: "Info",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [
                        evaluations.options.originality.value, 
                        evaluations.options.variete.value, 
                        evaluations.options.valeur.value, 
                        evaluations.options.robustesse.value
                    ]
                }
            ]
        };
        var ctx = document.getElementById("myEvaluationChart").getContext("2d");
        ctx.canvas.width  = $(el_evaluation_radar).width();
        ctx.canvas.height = $(el_evaluation_radar).height();
        var myRadarChart = new Chart(ctx).Radar(data);
        // Suggestion tables
        suggestions.forEach(function(suggestion){
            $(ckSuggestion.el_evaluation_suggestion).append(ckSuggestion.views.main.evaluation_tr({suggestion : suggestion}));
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
