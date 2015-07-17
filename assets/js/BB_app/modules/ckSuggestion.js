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
    ///////////////////////
    init: function (json) {
        this.views.main = new this.Views.Main({
            el : json.el,
            elements : global.collections.Elements,
            project : global.models.currentProject,
        });
        this.views.main.render();
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
        // Template
    },
    events : {

    },
    create_new_tagged_element : function(type,title,tag){
        var json = {
            type: type,
            title: title,
        }
        var newElement = this.elements.newElement(json,false);
        // on ajoute le tag en attribut de l'element
        var json = {};
        json["tag_"+tag] = tag;
        newElement.save(json)
        return newElement;
    },
    render : function(){
        /////////////////////
        // Normalisation
        if(ckSuggestion.views.normalisation == undefined){
            ckSuggestion.views.normalisation = new ckSuggestion.Views.Normalisation({
                el : "#ck_normalisation_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.normalisation.analyse();
        /////////////////////
        // Localisation
        if(ckSuggestion.views.localisation == undefined){
            ckSuggestion.views.localisation = new ckSuggestion.Views.Localisation({
                el : "#ck_localisation_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.localisation.analyse();
        /////////////////////
        // Localisation
        if(ckSuggestion.views.evaluation == undefined){
            ckSuggestion.views.evaluation = new ckSuggestion.Views.Evaluation({
                el : "#ck_evaluation_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.evaluation.analyse();
        /////////////////////
        // Cadrage
        if(ckSuggestion.views.cadrage == undefined){
            ckSuggestion.views.cadrage = new ckSuggestion.Views.Cadrage({
                el : "#ck_cadrage_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.cadrage.analyse();
        /////////////////////
        // DD
        if(ckSuggestion.views.dd == undefined){
            ckSuggestion.views.dd = new ckSuggestion.Views.DD({
                el : "#ck_dd_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.dd.analyse();
    },
});
/***************************************/
ckSuggestion.Views.DD = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd_analyses = [];
        this.elements = json.elements;
        // Templates
        this.dd_template = _.template($('#ck-analyse-keywords-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
    },
    events : {
        "click .new_cadrage" : "new_cadrage_keywords", 
    },
    new_cadrage_keywords : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // // create poche if needed
        this.dd_analyses.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)) ckSuggestion.views.main.create_new_tagged_element("poche",analyse.title.fr+" / "+analyse.title.en,analyse.tag);
        });
        //Create the element
        ckSuggestion.views.main.create_new_tagged_element("knowledge",$("#"+tag+"_value").val(),tag);
        this.analyse();
    },
    analyse : function(){
        $(this.el).empty();
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_dd_keywords",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(analyses){
            ckSuggestion.views.dd.dd_analyses = analyses;
            ckSuggestion.views.dd.render(analyses);
        });
    },
    render : function(analyses){
        // perc
        var all = analyses.length;
        var done = 0;
        analyses.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = done*100/all;
        $(this.el).append(this.header_template({
            sentence : "Definir le dominante design de votre produit/service",
            perc : perc
        }));
        // append
        $(this.el).append(this.dd_template({
            keywords : analyses
        }));
    }

});
/***************************************/
ckSuggestion.Views.Cadrage = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.cadrage_analyses = [];
        this.elements = json.elements;
        // Templates
        this.cadrage_template = _.template($('#ck-analyse-keywords-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
    },
    events : {
        "click .new_cadrage" : "new_cadrage_keywords", 
    },
    new_cadrage_keywords : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // create poche if needed
        this.cadrage_analyses.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)) ckSuggestion.views.main.create_new_tagged_element("poche",analyse.title.fr+" / "+analyse.title.en,analyse.tag);
        });
        // Create the element
        ckSuggestion.views.main.create_new_tagged_element("knowledge",$("#"+tag+"_value").val(),tag);
        this.analyse();
    },
    analyse : function(){
        $(this.el).empty();
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_cadrage_keywords",{
            elements : bbmap.views.main.elements.toJSON(),
        }, function(analyses){
            ckSuggestion.views.cadrage.cadrage_analyses = analyses;
            ckSuggestion.views.cadrage.render(analyses);
        });
    },
    render : function(analyses){
        // perc
        var all = analyses.length;
        var done = 0;
        analyses.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = done*100/all;
        $(this.el).append(this.header_template({
            sentence : "Cadrage de la problématique",
            perc : perc
        }));
        // append
        $(this.el).append(this.cadrage_template({
            keywords : analyses
        }));
    }

});
/***************************************/
ckSuggestion.Views.Evaluation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.evaluations = [];
        this.elements = json.elements;
        // Templates
        this.explorations_template = _.template($('#ck-explorations-template').html());
        this.v2or_analyses_template = _.template($('#ck-v2or-analyses-template').html());    
        this.v2or_values_template = _.template($('#ck-v2or-values-template').html());  
        this.header_template = _.template($('#ck-header-perc-template').html());  
    },
    events : {

    },
    analyse : function(){
        $(this.el).empty();
        /////////////////////////////////////
        // EXPLORATION ANALYSE
        ///////////////////////////////////// 
        $.post("/suggestion/get_explorations_analyse",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(explorations){
            ckSuggestion.views.evaluation.render_explorations(explorations);
        });
        /////////////////////////////////////
        // V2OR VALUES
        ///////////////////////////////////// 
        $.post("/suggestion/get_v2or_values",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(values){
            ckSuggestion.views.evaluation.evaluations = values;
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
            ckSuggestion.views.evaluation.render_v2or_values(values)
        });
        /////////////////////////////////////
        // EVALUATION
        /////////////////////////////////////   
        $.post("/suggestion/get_v2or_analyse",{
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON(),
        }, function(analyses){
            ckSuggestion.views.evaluation.render_v2or_analyse(analyses);
        });
    },
    render_explorations : function(explorations){
        $(this.el).append(this.explorations_template({
            explorations : explorations
        }));
    },
    render_v2or_values : function(values){
        $(this.el).append(this.v2or_values_template({
            evaluations : values
        }));
    },
    render_v2or_analyse : function(analyses){
        var _this = this;
        analyses.forEach(function(analyse){
            $(_this.el).append(_this.v2or_analyses_template({
                suggestion : analyse
            }));    
        });
    }

});
/***************************************/
ckSuggestion.Views.Normalisation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.normalisations = {};
        this.elements = json.elements;
        // Templates
        this.normalisation_template = _.template($('#normalisation-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
        
    },
    events : {
        "change .template_selection" : "apply_template",
    },
    apply_template : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({css_manu : value});
        this.analyse();
    },
    analyse : function(){
        /////////////////////////////////////
        // STATUT
        /////////////////////////////////////   
        $.post("/suggestion/get_statuts",{
            elements : ckSuggestion.views.normalisation.elements.toJSON(),
        }, function(normalisations){
            ckSuggestion.views.normalisation.normalisations = normalisations;
            //console.log(normalisations)
            // STATUT
            var json = {
                c_normalized : [],
                k_normalized : [],
                c_not_normalized : [],
                k_not_normalized : []
            }
            normalisations.forEach(function(statut){
                // set the target
                var type = statut.element.type;
                if(statut.normalized){
                    if(type == "concept") json.c_normalized.push(statut);
                    if(type == "knowledge") json.k_normalized.push(statut);
                }else{
                    if(type == "concept") json.c_not_normalized.push(statut);
                    if(type == "knowledge") json.k_not_normalized.push(statut);
                }
            });
            ckSuggestion.views.normalisation.render(json);
        });
    },
    render : function(json){
        $(this.el).empty();
        // perc
        var all = (json.c_not_normalized.length + json.k_not_normalized.length + json.c_normalized.length + json.k_normalized.length);
        var done = json.c_normalized.length + json.k_normalized.length;
        var perc = done*100/all;
        $(this.el).append(this.header_template({
            sentence : "Categorisation CK",
            perc : perc
        }));
        // other
        $(this.el).append(this.normalisation_template({
            anchor : "cnc",
            sentence : "Concepts no categorized",
            suggestions : json.c_not_normalized
        }));

        $(this.el).append(this.normalisation_template({
            anchor : "knc",
            sentence : "Knowledges no categorized",
            suggestions : json.k_not_normalized
        }));
    
        $(this.el).append(this.normalisation_template({
            anchor : "cc",
            sentence : "Concepts categorized",
            suggestions : json.c_normalized
        }));

        $(this.el).append(this.normalisation_template({
            anchor : "kc",
            sentence : "Knowledges categorized",
            suggestions : json.k_normalized
        }));
    }
});
/***************************************/
ckSuggestion.Views.Localisation = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.localisations = {};
        this.elements = json.elements;
        // Templates
        this.localisation_template = _.template($('#localisation-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
    },
    events : {
        "change .k_localisation" : "k_localisation",
    },
    k_localisation : function(e){
        e.preventDefault();
        var element = this.elements.get(e.target.getAttribute('data-id'));
        var value = $(e.target).find("option:selected").val();
        element.save({inside : value});
        this.analyse();
    },
    analyse : function(){
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
            var json = {
                k_localized : k_localized,
                k_not_localized : k_not_localized
            }
            ckSuggestion.views.localisation.render(json);
        });
    },
    render : function(json){
        $(this.el).empty();
        // perc
        var all = 10;
        var done = 1;
        var perc = done*100/all;
        $(this.el).append(this.header_template({
            sentence : "Localisation de la connaissance",
            perc : perc
        }));
        // append
        $(this.el).append(this.localisation_template({
            anchor : "knl",
            sentence : "Knowledge not localized",
            suggestions : json.k_not_localized
        }));

        $(this.el).append(this.localisation_template({
            anchor : "kl",
            sentence : "Knowledge localized",
            suggestions : json.k_localized
        }));    }
});
/***************************************/