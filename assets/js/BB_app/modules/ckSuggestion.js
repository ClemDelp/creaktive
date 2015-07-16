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

    explorations_el : "#explorations_container",
    v2or_analyse_el : "#v2or_analyse_container",
    cadrage_keywords_el : "#cadrage_keywords_container",


    el_radar_detail : "#radar_detail_container",

    el_evaluation_suggestion : "#evaluations_table",

    
    init: function (json) {
        if(ckSuggestion.views.main == undefined){
            this.views.main = new this.Views.Main({
                el : "#suggestions_modal",
                elements : global.collections.Elements,
                //mode    : json.mode,
                project : global.models.currentProject,
            });
            
        }
        this.views.main.get_creaktive_analyses();
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
        this.radar_detail = _.template($('#radar-detail-template').html());
        this.actions_perc = _.template($('#actions-percentage-template').html());

        this.objectif_slider = _.template($('#objectif-sliders-template').html());

        this.explorations_template = _.template($('#ck-explorations-template').html());
        this.v2or_analyse_template = _.template($('#ck-v2or-analyse-template').html());
        this.cadrage_keywords_template = _.template($('#ck-cadrage-keywords-template').html());
        // Events
    },
    events : {
        "change .k_localisation" : "k_localisation",
        "change .template_selection" : "apply_template",
        "click .refresh" : "get_creaktive_analyses",
        // "click .updateObjectifCanvas" : "updateObjectifCanvas",
        "click .new_cadrage" : "new_cadrage_keywords", 
    },
    /////////////////////////////////////////
    new_cadrage_keywords : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        console.log($("#"+tag+"_value").val());
        //
        var json = {
            type: "knowledge",
            title: $("#"+tag+"_value").val(),
        }
        var newElement = this.elements.newElement(json,false);
        // on ajoute le tag en attribut de l'element
        var json = {};
        json["tag_"+tag] = tag;
        newElement.save(json)
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
    get_creaktive_analyses : function(){
        /////////////////////////////////////
        // STATUT
        /////////////////////////////////////   
        $.post("/suggestion/get_statuts",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(normalisations){
            ckSuggestion.views.main.normalisations = normalisations;
            //console.log(normalisations)
            // STATUT
            var c_normalized = [];
            var k_normalized = [];
            var c_not_normalized = [];
            var k_not_normalized = [];

            normalisations.forEach(function(statut){
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
            // Action menu render
            ckSuggestion.views.main.render_actions_perc({
                // c_normalized : c_normalized,
                // k_normalized : k_normalized,
                // c_not_normalized : c_not_normalized,
                // k_not_normalized : k_not_normalized,
                // k_localized : k_localized,
                // k_not_localized : k_not_localized
            });
        });
        /////////////////////////////////////
        // LOCALISATION   
        /////////////////////////////////////   
        $.post("/suggestion/get_localisations",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(localisations){
            var auto = localisations.auto;
            var manu = localisations.manu;
            // AUTO
            auto.forEach(function(analyse){
                var k = ckSuggestion.views.main.elements.get(analyse.knowledge.id);
                k.save({inside : analyse.inside});
            })
            // MANU
            var k_localized = [];
            var k_not_localized = [];
            manu.forEach(function(localisation){
                if(localisation.knowledge.inside != "") k_localized.push(localisation);
                else k_not_localized.push(localisation);
            });
            ckSuggestion.views.main.render_k_localized(k_localized);
            ckSuggestion.views.main.render_k_not_localized(k_not_localized);

        });
        /////////////////////////////////////
        // EXPLORATION ANALYSE
        ///////////////////////////////////// 
        $.post("/suggestion/get_explorations_analyse",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(explorations){
            console.log(explorations)
            ckSuggestion.views.main.render_explorations(explorations);
        });
        /////////////////////////////////////
        // V2OR VALUES
        ///////////////////////////////////// 
        $.post("/suggestion/get_v2or_values",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(values){
            ckSuggestion.views.main.evaluations = values;
            // update project if it's the first time
            if(ckSuggestion.views.main.project.get("goal") == undefined){
                ckSuggestion.views.main.project.save({
                    goal : {
                        strength: values.strength.options[0].value,
                        variety: values.variety.options[0].value,
                        originality: values.originality.options[0].value,
                        value: values.value.options[0].value
                    }           
                });
            }
            ckSuggestion.views.main.render_v2or_values(values)
        });
        /////////////////////////////////////
        // EVALUATION
        /////////////////////////////////////   
        $.post("/suggestion/get_v2or_analyse",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(analyses){
            ckSuggestion.views.main.render_v2or_analyse(analyses);
        });
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_cadrage_keywords",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(analyse){
            ckSuggestion.views.main.render_cadrage_analyse_key_words(analyse);
        });
    },
    ///////////////////////////////////
    render_cadrage_analyse_key_words : function(cadrage_keywords){
        $(ckSuggestion.cadrage_keywords_el).empty();
        $(ckSuggestion.cadrage_keywords_el).append(this.cadrage_keywords_template({keyWords : cadrage_keywords}))
    },
    ///////////////////////////////////
    generateChart : function(data,id,width,height){
        var ctx = document.getElementById(id).getContext("2d");
        ctx.canvas.width  = width;
        ctx.canvas.height = height;
        var myRadarChart = new Chart(ctx).Radar(data);
    },
    ///////////////////////////////////
    render_explorations : function(explorations){
        $(ckSuggestion.explorations_el).empty();
        $(ckSuggestion.explorations_el).append(this.explorations_template({
            explorations : explorations
        }));
    },
    ///////////////////////////////////
    render_v2or_values : function(values){
        // init
        $(ckSuggestion.el_radar_detail).empty();
        $(ckSuggestion.el_evaluation_suggestion).empty();
        // RADAR
        $(ckSuggestion.el_radar_detail).append(this.radar_detail({evaluations : values}));
        
        // var x = setInterval(function(){
        //     if($("#radar_detail_container").height() > 0){
        //         var data = {
        //             labels: [
        //                 values.originality.options[0].name.fr, 
        //                 values.variety.options[0].name.fr,
        //                 values.value.options[0].name.fr,
        //                 values.strength.options[0].name.fr
        //             ],
        //             datasets: [
        //                 {
        //                     label: "Evaluation",
        //                     fillColor: "rgba(151,187,205,0.2)",
        //                     strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
        //                     pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
        //                     pointStrokeColor: "#fff",
        //                     pointHighlightFill: "#fff",
        //                     pointHighlightStroke: "rgba(151,187,205,1)",
        //                     data: [
        //                         values.originality.options[0].value, 
        //                         values.variety.options[0].value, 
        //                         values.value.options[0].value, 
        //                         values.strength.options[0].value
        //                     ]
        //                 }
        //             ]
        //         };
        //         ckSuggestion.views.main.generateChart(data,"myEvaluationChart",$("#radar_graph_container").width(),$("#radar_detail_container").height());
        //         clearInterval(x);
        //     }
        // }, 1000);
    },
    render_v2or_analyse : function(analyses){
        // Suggestion tables
        analyses.forEach(function(analyse){
            $(ckSuggestion.v2or_analyse_el).append(ckSuggestion.views.main.v2or_analyse_template({suggestion : analyse}));
        });
    },
    render_actions_perc : function(json){

        // var all = json.c_normalized.length + json.k_normalized.length + json.c_not_normalized.length + json.k_not_normalized.length + json.k_localized.length + json.k_not_localized.length
        // var done =  json.c_normalized.length + json.k_normalized.length + json.k_localized.length;
        var perc = 0;

        //if(all != 0) perc = Math.round((done*100/all)*100)/100;

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
///////////////////////////////////
    // render_suggestions : function(json){
    //     var evaluations = json.evaluations;
    //     // init
    //     $(ckSuggestion.el_objectif_sliders_container).empty();
    //     // objectif sliders
    //     var parameters = [
    //         evaluations.originality.options[0],
    //         evaluations.variety.options[0],
    //         evaluations.value.options[0],
    //         evaluations.strength.options[0]
    //     ]
    //     $(ckSuggestion.el_objectif_sliders_container).append(this.objectif_slider({parameters : parameters}));
        
    //     var x = setInterval(function(){
    //         if($("#objectif_sliders_container").height() > 0){
    //             var data = {
    //                 labels: [
    //                     evaluations.originality.options[0].name.fr, 
    //                     evaluations.variety.options[0].name.fr,
    //                     evaluations.value.options[0].name.fr,
    //                     evaluations.strength.options[0].name.fr
    //                 ],
    //                 datasets: [
    //                     {
    //                         label: "Objectf",
    //                         fillColor: "rgba(151,187,205,0.2)",
    //                         strokeColor: "#C8D200",//"rgba(151,187,205,1)",
    //                         pointColor: "#C8D200",//"rgba(151,187,205,1)",
    //                         pointStrokeColor: "#fff",
    //                         pointHighlightFill: "#fff",
    //                         pointHighlightStroke: "rgba(151,187,205,1)",
    //                         data: [
    //                             ckSuggestion.views.main.project.get('goal').originality, 
    //                             ckSuggestion.views.main.project.get('goal').variety, 
    //                             ckSuggestion.views.main.project.get('goal').value, 
    //                             ckSuggestion.views.main.project.get('goal').strength
    //                         ]
    //                     },
    //                     {
    //                         label: "Evaluation",
    //                         fillColor: "rgba(151,187,205,0.2)",
    //                         strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
    //                         pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
    //                         pointStrokeColor: "#fff",
    //                         pointHighlightFill: "#fff",
    //                         pointHighlightStroke: "rgba(151,187,205,1)",
    //                         data: [
    //                             evaluations.originality.options[0].value, 
    //                             evaluations.variety.options[0].value, 
    //                             evaluations.value.options[0].value, 
    //                             evaluations.strength.options[0].value
    //                         ]
    //                     }
    //                 ]
    //             };

    //             ckSuggestion.views.main.generateChart(data,"objectif_radar_canvas",$("#objectif_radar").width(),$("#objectif_sliders_container").height());

    //             $(document).foundation();
    //             clearInterval(x);   
    //         }
    //     }, 1000);
    // },

    // updateObjectifCanvas : function(e){
    //     e.preventDefault();
    //     // get objectif value 
    //     var originiality_objectif = $("#Originality_objectif").attr('data-slider');
    //     var variety_objectif = $("#Variety_objectif").attr('data-slider'); 
    //     var value_objectif = $("#Value_objectif").attr('data-slider');
    //     var strength_objectif = $("#Strength_objectif").attr('data-slider');
    //     // 
    //     var evaluations = ckSuggestion.views.main.evaluations;
    //     // update the current Project with news objectifs
    //     this.project.save({
    //         goal : {strength: strength_objectif,variety: variety_objectif,originality: originiality_objectif,value: value_objectif},
    //         step : 1,
    //     });
    //     // prepar data for chart
    //     var data = {
    //         labels: [
    //             evaluations.originality.options[0].name.fr, 
    //             evaluations.variety.options[0].name.fr,
    //             evaluations.value.options[0].name.fr,
    //             evaluations.strength.options[0].name.fr
    //         ],
    //         datasets: [
    //             {
    //                 label: "Objectf",
    //                 fillColor: "rgba(151,187,205,0.2)",
    //                 strokeColor: "#C8D200",//"rgba(151,187,205,1)",
    //                 pointColor: "#C8D200",//"rgba(151,187,205,1)",
    //                 pointStrokeColor: "#fff",
    //                 pointHighlightFill: "#fff",
    //                 pointHighlightStroke: "rgba(151,187,205,1)",
    //                 data: [
    //                     originiality_objectif,
    //                     variety_objectif,
    //                     value_objectif,
    //                     strength_objectif,
    //                 ]
    //             },
    //             {
    //                 label: "Evaluation",
    //                 fillColor: "rgba(151,187,205,0.2)",
    //                 strokeColor: "#1B9DD3",//"rgba(151,187,205,1)",
    //                 pointColor: "#1B9DD3",//"rgba(151,187,205,1)",
    //                 pointStrokeColor: "#fff",
    //                 pointHighlightFill: "#fff",
    //                 pointHighlightStroke: "rgba(151,187,205,1)",
    //                 data: [
    //                     evaluations.originality.options[0].value, 
    //                     evaluations.variety.options[0].value, 
    //                     evaluations.value.options[0].value, 
    //                     evaluations.strength.options[0].value
    //                 ]
    //             }
    //         ]
    //     };

    //     ckSuggestion.views.main.generateChart(data,"objectif_radar_canvas",$("#objectif_radar").width(),$("#objectif_sliders_container").height());

    // },
