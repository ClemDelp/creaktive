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
    el_evaluation_radar : "#evaluationRadar_container",
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
        this.template = _.template($('#normalisation-suggestion-template').html());
        // Events
    },
    events : {
        "click .k_localisation" : "k_localisation",
        "change .template_selection" : "apply_template", 
    },
    /////////////////////////////////////////
    // ACTIONS
    /////////////////////////////////////////
    setEvaluationRadar : function(){
        var canvas = $('<canvas>',{id:"myEvaluationChart"});
        $(ckSuggestion.el_evaluation_radar).append(canvas);
        var data = {
            labels: ["originalité", "variété", "valeur", "robustesse"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81]
                }
            ]
        };
        var ctx = document.getElementById("myEvaluationChart").getContext("2d");
        ctx.canvas.width  = $('#evaluationRadar_container').width();
        ctx.canvas.height = $('#evaluationRadar_container').height();
        var myRadarChart = new Chart(ctx).Radar(data);
    },
    k_localisation : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = e.target.getAttribute('data-value')
        element.save({inside : value});
    },
    apply_template : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val()
        element.save({css_manu : value});
    },
    /////////////////////////////////////////
    //
    /////////////////////////////////////////
    get_normalisations : function(){
        // init
        this.render_init();
        // Get normalisaiton for concepts
        $.post("/suggestion/get_normalisations",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(suggestions){
            console.log(suggestions)
            suggestions.forEach(function(suggestion){
                // set the target
                var type = suggestion.element.type;
                if(suggestion.normalized){
                    if(type == "concept") ckSuggestion.views.main.render_c_normalized(suggestion);
                    if(type == "knowledge") ckSuggestion.views.main.render_k_normalized(suggestion);
                }else{
                    if(type == "concept") ckSuggestion.views.main.render_c_not_normalized(suggestion);
                    if(type == "knowledge") ckSuggestion.views.main.render_k_not_normalized(suggestion);
                }
            })
        });
    },
    preparEvaluations : function(){
        $('#evaluations_table').html('');

        $.post("/suggestion/getEvaluations",{
            elements : bbmap.views.main.elements.toJSON(), 
            links : bbmap.views.main.links.toJSON()
        }, function(evaluations){
            console.log(evaluations)  
        });
    },
    ///////////////////////////////////
    render_init : function(){
        console.log('init suggestion template')
        $(ckSuggestion.el_c_normalized).empty();
        $(ckSuggestion.el_k_normalized).empty();
        $(ckSuggestion.el_c_not_normalized).empty();
        $(ckSuggestion.el_k_not_normalized).empty();
    }, 
    render_c_normalized : function(suggestion){
        console.log(suggestion)
        $(ckSuggestion.el_c_normalized).append(this.template({suggestion : suggestion}));
        return this;
    },
    render_c_not_normalized : function(suggestion){
        $(ckSuggestion.el_c_not_normalized).append(this.template({suggestion : suggestion}));
        return this;
    },
    render_k_normalized : function(suggestion){
        $(ckSuggestion.el_k_normalized).append(this.template({suggestion : suggestion}));
        return this;
    },
    render_k_not_normalized : function(suggestion){
        $(ckSuggestion.el_k_not_normalized).append(this.template({suggestion : suggestion}));
        return this;
    }
});
/**************************************/
