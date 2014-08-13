/////////////////////////////////////////////////
var reportsList = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
reportsList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.reports = new Backbone.Collection(json.reports); // collection
        this.project = json.project; // model
        // Templates
        this.template = _.template($('#reportsList-template').html());
    },
    render : function(){        
        ///////////////////////
        // init
        var _this = this;
        $(this.el).empty();
        console.log(this.reports)
        $(this.el).append(this.template({reports : this.reports.toJSON(), project : this.project.toJSON()}));
        return this;
    }
});
/////////////////////////////////////////////////
