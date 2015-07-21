/*************************************/
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
            links : global.collections.Links,
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
        this.links = json.links;
        this.elements = json.elements; 
        this.normalisations = {};
        this.evaluations = {};   
        this.project = global.models.currentProject;
        // Template
    },
    events : {

    },
    create_new_tagged_element : function(json){
        // pour eviter le duplicate key dans mongo si on crée une poche associée
        // setTimeout(function(){
            var data = {
                type: json.type,
                title: json.title,
            }
            // on ajoute le tag en attribut de l'element
            data[json.prefix+json.tag] = json.tag;
            var newElement = ckSuggestion.views.main.elements.newElement(data,false);
            
            //newElement.save(json);
            //this.elements.add(newElement);
            //return newElement;
        // },2000);
        if(json.cb) json.cb();   
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
        if(ckSuggestion.views.dds == undefined){
            ckSuggestion.views.dds = new ckSuggestion.Views.DDs({
                el : "#ck_dd_container",
                elements : this.elements
            });
        }
        ckSuggestion.views.dds.analyse();
    },
});
/***************************************/
ckSuggestion.Views.DDs = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.dd_analyses = [];
        this.elements = json.elements;
        // Templates
        this.dd_template = _.template($('#ck-analyse-keywords-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
    },
    analyse : function(){
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_dd_keywords",{
            elements : ckSuggestion.views.main.elements.toJSON(),
        }, function(dd_per_keyword){
            ckSuggestion.views.dds.dd_analyses = dd_per_keyword;
            ckSuggestion.views.dds.render(dd_per_keyword);
        });
    },
    render : function(dd_per_keyword){
        $(this.el).empty();
        var _this = this;
        // each dd
        if(dd_per_keyword.length == 0){
            $(_this.el).append("<div class='row'>No keywords found</div>")
        }else{
            dd_per_keyword.forEach(function(dds){
                $(_this.el).append(new ckSuggestion.Views.DD({
                    element : dds.element,
                    dd : dds.dd
                }).render().el)
            })    
        }
        
    }

});

ckSuggestion.Views.DD = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables
        this.element = json.element;
        this.dd = json.dd;
        // Templates
        this.dd_template = _.template($('#ck-analyse-keywords-template').html());
        this.header_template = _.template($('#ck-header-perc-template').html());
    },
    events : {
        "click .new_cadrage" : "new_dd_element", 
    },
    new_dd_element : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // // create poche if needed
        var _this = this;
        this.dd.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)){
                var json = {
                    type : "poche",
                    title : analyse.title.fr+" / "+analyse.title.en,
                    prefix : "tag_"+_this.element.id+"_",
                    tag : analyse.tag,
                }
                ckSuggestion.views.main.create_new_tagged_element(json);  
            }
        });
        //Create the element
        var json = {
            type : "knowledge",
            title : $(this.el).find("#"+tag+"_value").val(),
            tag : tag,
            prefix : "tag_"+_this.element.id+"_",
            cb : ckSuggestion.views.dds.analyse
        }
        ckSuggestion.views.main.create_new_tagged_element(json); 
    },
    render : function(){
        $(this.el).empty();
        // perc
        var all = this.dd.length;
        var done = 0;
        this.dd.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = Math.round(done*100/all);
        // Append
        $(this.el).append(this.header_template({
            sentence : "<p>Could be interesting to do the dominante design of <b>"+this.element.title+"</b></p>",
            perc : perc
        }));
        $(this.el).append(this.dd_template({
            keywords : this.dd
        }));

        return this;
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
        // Events
    },
    events : {
        "click .new_cadrage" : "new_cadrage_keywords", 
    },
    new_cadrage_keywords : function(e){
        e.preventDefault();
        var tag = e.target.getAttribute('data-tag');
        // create poche if needed
        this.cadrage_analyses.forEach(function(analyse){
            if((analyse.tag == tag)&&(analyse.poche == undefined)){
                var json = {
                    type : "poche",
                    title : analyse.title.fr+" / "+analyse.title.en,
                    tag : analyse.tag,
                    prefix : "tag_"
                }
                ckSuggestion.views.main.create_new_tagged_element(json);
            }
        });
        // Create the element
        var json = {
            type : "knowledge",
            title : $("#"+tag+"_value").val(),
            tag : tag,
            prefix : "tag_",
            cb : function(){
              ckSuggestion.views.cadrage.analyse();  
              ckSuggestion.views.dds.analyse();  
            } 
        }
        ckSuggestion.views.main.create_new_tagged_element(json);
        //this.analyse();
    },
    analyse : function(){
        /////////////////////////////////////
        // CADRAGE KEYWORDS ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/analyse_cadrage_keywords",{
            elements : ckSuggestion.views.cadrage.elements.toJSON(),
        }, function(analyses){
            ckSuggestion.views.cadrage.cadrage_analyses = analyses;
            ckSuggestion.views.cadrage.render(analyses);
        });
    },
    render : function(analyses){
        $(this.el).empty();
        // perc
        var all = analyses.length;
        var done = 0;
        analyses.forEach(function(analyse){
            if(analyse.tagged.length > 0) done++;
        });
        var perc = Math.round(done*100/all);
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
        // this.v2or_analyses_template = _.template($('#ck-v2or-analyses-template').html());    
        // this.v2or_values_template = _.template($('#ck-v2or-values-template').html());  
        this.v2or_analyse_template = _.template($('#ck-v2or-analyse-template').html());  
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
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(explorations){
            ckSuggestion.views.evaluation.render_explorations(explorations);
        });
        /////////////////////////////////////
        // V2OR VALUES
        ///////////////////////////////////// 
        // $.post("/suggestion/get_v2or_values",{
        //     elements : ckSuggestion.views.main.elements.toJSON(),
        //     links : ckSuggestion.views.main.links.toJSON(),
        // }, function(values){
        //     ckSuggestion.views.evaluation.evaluations = values;
        //     // update project if it's the first time
        //     if(ckSuggestion.views.main.project.get("goal") == undefined){
        //         ckSuggestion.views.main.project.save({
        //             goal : {
        //                 strength: values.strength.options[0].value,
        //                 variety: values.variety.options[0].value,
        //                 originality: values.originality.options[0].value,
        //                 value: values.value.options[0].value
        //             }           
        //         });
        //     }
        //     ckSuggestion.views.evaluation.render_v2or_values(values)
        // });
        /////////////////////////////////////
        // RISK ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/get_risk_analyse",{
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(analyse){
            ckSuggestion.views.evaluation.render_risk_analyse(analyse);
        });
        /////////////////////////////////////
        // ORIGINALITY V2OR ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/get_originality_v2or_analyse",{
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(analyse){
            ckSuggestion.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // VARIETY V2OR ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/get_variety_v2or_analyse",{
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(analyse){
            ckSuggestion.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // VALUE V2OR ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/get_value_v2or_analyse",{
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(analyse){
            ckSuggestion.views.evaluation.render_v2or_analyse(analyse);
        });
        /////////////////////////////////////
        // STRENGTH V2OR ANALYSE
        /////////////////////////////////////   
        $.post("/suggestion/get_strength_v2or_analyse",{
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
        }, function(analyse){
            ckSuggestion.views.evaluation.render_v2or_analyse(analyse);
        });

    },
    render_explorations : function(explorations){
        $(this.el).append(this.explorations_template({
            explorations : explorations
        }));
    },
    render_v2or_analyse : function(analyse){
        // perc
        var value = analyse.value;
        var all = 3;
        var done = analyse.value;
        var perc = Math.round(done*100/all);
        // color
        var color = "";
        if(value<=1) color = "alert";
        else if((value>1)&&(value<=2)) color = "";
        else if((value>2)&&(value<=3)) color = "success";
        // append
        $(this.el).append(this.v2or_analyse_template({
            analyse : analyse,
            perc : perc,
            color : color
        }));
    },
    render_risk_analyse : function(analyse){
        // perc
        var value = analyse.value;
        var all = 3;
        var done = analyse.value;
        var perc = Math.round(done*100/all);
        // color
        var color = "";
        if(value<=1) color = "success";
        else if((value>1)&&(value<=2)) color = "";
        else if((value>2)&&(value<=3)) color = "alert";
        // append
        $(this.el).append(this.v2or_analyse_template({
            analyse : analyse,
            perc : perc,
            color : color
        }));
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
        var perc = Math.round(done*100/all);
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
            elements : ckSuggestion.views.main.elements.toJSON(),
            links : ckSuggestion.views.main.links.toJSON(),
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
        var perc = Math.round(done*100/all);
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
/**************************************/



