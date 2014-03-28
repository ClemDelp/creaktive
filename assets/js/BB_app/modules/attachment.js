/***************************************/
attachment.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.eventAggregator = json.eventAggregator;
        _eventAggregator = this.eventAggregator;
        // Reset the baseUrl of template manager
        Backbone.TemplateManager.baseUrl = '{name}';
        // Create the upload manager object
        this.uploadManager = new Backbone.UploadManager();
        this.uploadManager.on('filedone', function (e,f,g) {
            _eventAggregator.trigger("uploadCompleted",f._response.result);
        });
        //this.uploadManager.renderTo($('div#upload-container'));
        // Events
        // Templates
        this.template = _.template($('#attachment-upload-form-template').html());
    },
    events : {},
    
    render : function() {
        $(this.el).html("");
        $(this.el).append(this.template());
        this.uploadManager.renderTo($(this.el).find('#upload-container'));
        return this;
    }
});
/***************************************/