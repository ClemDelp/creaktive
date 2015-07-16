/***************************************/
var importExport = {
    // Classes
    Collections: {},
    Models: {},
    Views: {},
    // Instances
    collections: {},
    models: {},
    views: {},
    eventAggregator : global.eventAggregator,
    init: function (json) {
        if(this.views.main == undefined){
            this.views.main = new this.Views.Main({
                el:json.el
            });
            this.views.main.render();
        }
    }
};
/***************************************/
importExport.Views.Main = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        // Variables

        // Templates
        this.import_export_template = _.template($('#import-export-template').html());
        // Events
    },
    events : {
        "click .ckExport" : "exportDataToString",
        "click .ckImport" : "importData",
    },
    /////////////////////////////////////////
    exportDataToString : function(e){
        e.preventDefault();
        var data = {
            elements : bbmap.views.main.elements.toJSON(),
            links : bbmap.views.main.links.toJSON()
        }
        $('#ck_to_export').val(JSON.stringify(data))
    },
    importData : function(e){
        e.preventDefault();
        try{
            var data = jQuery.parseJSON( $('#ck_to_import').val() );
            // import elements
            var elements = data.elements;
            elements.forEach(function(json){
                var new_element = new global.Models.Element(json);
                new_element.set({
                    id : new_element.id+"-imported",
                    id_father : new_element.get('id_father')+"-imported",
                    user : global.models.current_user.get('id'),
                    date : getDate(),
                    project:bbmap.views.main.project.id
                });
                new_element.save();
                global.collections.Elements.add(new_element,{from:"client"});
            });
            // import links
            var links = data.links;
            links.forEach(function(json){
                var new_cklink = new global.Models.CKLink(json);
                new_cklink.set({
                    id : new_cklink.id+"-imported",
                    user : global.models.current_user.get('id'),
                    date : getDate(),
                    source : new_cklink.get('source')+"-imported",
                    target : new_cklink.get('target')+"-imported",
                    project:bbmap.views.main.project.id
                });
                new_cklink.save();
                global.collections.Links.add(new_cklink,{silent : false}); 
            });
            bbmap.views.main.recadrage();
        }catch(err){
            alert("improper code");
        }
    },
    /////////////////////////////////////////
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.import_export_template());
        return this;
    }
});
/***************************************/