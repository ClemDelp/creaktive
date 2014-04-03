/***************************************/
var CKLayout = {
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
CKLayout.Views.Main = Backbone.View.extend({
    initialize:function(json){
        _.bindAll(this, 'render');
        // Variables
        this.model              = json.model;
        this.user               = json.user;
        this.eventAggregator    = json.eventAggregator;
    },
    render:function(){
        $(this.el).html('');
        // Model editor module
        $(this.el).append(new modelEditor.Views.Main({
            className       : "large-4 medium-4 small-4 columns",
            user            : this.user,
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Comments module
        $(this.el).append(new comments.Views.Main({
            className       : "large-4 medium-4 small-4 columns",
            model           : this.model,
            user            : this.user,
            eventAggregator : this.eventAggregator
        }).render().el);
        // Attachment module
        $(this.el).append(new attachment.Views.Main({
            className       : "large-4 medium-4 small-4 columns",
            model           : this.model,
            eventAggregator : this.eventAggregator
        }).render().el);

        return this;
    }
});