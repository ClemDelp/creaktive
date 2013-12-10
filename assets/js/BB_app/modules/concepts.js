//////////////////////////////////////////////////////////////////
/****************************************************************/
/*views*/
/****************************************************************/
concepts.Views.ConceptsView = Backbone.View.extend({
    el : '#concepts-container',
    initialize : function(json){
        _.bindAll(this, 'render');
        /*Concepts*/
        this.collection.bind('add', this.render);
        this.collection.bind('reset', this.render);
        this.collection.bind('remove', this.remove);

        this.template = _.template($('#concepts-template').html());
    },

    render: function(){

        var renderedContent = this.template({concepts : this.colletion});
        $(this.el).html(renderedContent);
        console.log('tuu')
        
        this.map();


        // return this;
    },

    map : function(){

        window.onerror = alert;
        console.log('>>>>', $('#container'))
        var container = $('#container'),
        mapRepository = observable({}),
        isTouch = false,
        renderImages = false;
        console.log('aaaaa');
        var json = this.test_tree();
        console.log("tututu", json);
        var idea = MAPJS.content(json);
        mapModel = new MAPJS.MapModel(mapRepository, MAPJS.KineticMediator.layoutCalculator);
        console.log(container);
        container.mapWidget(console,mapModel, isTouch, renderImages);
        console.log('cccc');
        jQuery('body').mapToolbarWidget(mapModel);
        jQuery('body').attachmentEditorWidget(mapModel);
        var pngExporter = new MAPJS.PNGExporter(mapRepository);
        $("[data-mm-action='export-image']").click(pngExporter.exportMap);
        pngExporter.addEventListener('mapExported', function (url) {
            $("<img/>").attr('src',url).appendTo('body');
        });
        mapModel.addEventListener('analytic', console.log.bind(console));
        mapRepository.dispatchEvent('mapLoaded', idea);
        window.mapModel = mapModel;
    },

     test_tree : function() {
    return {"title":"1 should check all","id":1, "attr": { "style": { background: '#FF0000' }, attachment: { contentType: 'text/html', content: 'content <b>bold content</b>'}}, "ideas":{"1":{attr: {collapsed: true }, "title":"2 is very very lng www.google.com","id":2,"ideas":{"1":{"title":"3 is also very long","id":3}}},"11":{"title":"4","id":4,"ideas":{"1":{"title":"5","id":5,"ideas":{"1":{"title":"6","id":6},"2":{"title":"7 is long","id":7,"ideas":{"1":{"title":"8","id":8},"2":{"title":"9","id":9},"3":{"title":"10","id":10},"4":{"title":"11","id":11},"5":{"title":"12","id":12}}}}}}},"12":{"title":"A cunning plan...","id":15},"13":{"title":"A cunning plan...","id":17},"14":{"title":"We'll be famous...","id":19},"15":{"title":"A brilliant idea...","id":21,"ideas":{"1":{"title":"A brilliant idea...","id":24},"2":{"title":"A cunning plan...","id":25},"3":{"title":"A brilliant idea...","id":26},"4":{"title":"A brilliant idea...","id":27},"5":{"title":"A brilliant idea...","id":28},"6":{"title":"A cunning plan...","id":29},"7":{"title":"A brilliant idea...","id":30},"8":{"title":"A brilliant idea...","id":31}}},"16":{"title":"A cunning plan...","id":23},"-1":{"title":"A brilliant idea...","id":13},"-2":{"title":"A brilliant idea...","id":14},"-3":{"title":"A cunning plan...","id":16},"-4":{"title":"We'll be famous...","id":18},"-5":{"title":"We'll be famous...","id":20},"-6":{"title":"A brilliant idea...","id":22}}};
}


});