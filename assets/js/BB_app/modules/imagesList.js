/**************************************/
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
        this.eventAggregator = json.eventAggregator;
        this.listenTo(this.eventAggregator,'fileuploaded',this.render,this);
        // Templates
        this.template_diapo = _.template($('#imagesList-diapo-template').html());  

    },
    events : {},
    render : function(){
        // Init
        $(this.el).empty();
        // filter attachment get only images
        var images = [];
        this.model.get('attachment').forEach(function(attachment){
            if(attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){images.unshift(attachment)}
        })
        // get the diapo
        $(this.el).append(this.template_diapo({images:images}));
        

        $(document).foundation();
        
        return this;
    }
});
