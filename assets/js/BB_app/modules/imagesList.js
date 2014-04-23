/***************************************/
var imagesList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {}
};
/***************************************/
imagesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        console.log("moooodel",this.model)
        this.attachments = this.model.get('attachment');
        this.knowledges = json.knowledges;
        this.eventAggregator = json.eventAggregator;
        // Templates
        this.template_diapo = _.template($('#imagesList-diapo-template').html());     
    },
    events : {},
    render : function(){
        // Init
        $(this.el).html('');
        // filter attachment get only images
        images = [];
        this.attachments.forEach(function(attachment){
            if(attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){images.unshift(attachment)}
        })
        // get the diapo
        $(this.el).append(this.template_diapo({images:images}));
        
        
        return this;
    }
});
/***************************************/