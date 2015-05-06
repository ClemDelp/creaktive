/////////////////////////////////////////////////
var dd = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new dd.Views.Main({
        el : json.el,
        dds : global.collections.DDs,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
dd.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.dds = json.dds; 
        // Events
        // Templates
        this.template_list = _.template($('#dd-list-template').html());
    },
    events : {
        
    },
    // openTuto : function(e){
    //     e.preventDefault();
    //     var tuto = e.target.getAttribute("data-tuto");
    //     var tuto_template = _.template($('#tuto-'+tuto+'-template').html());
    //     $('#ddModal_container').html(tuto_template())
    //     $('#ddModal').foundation('reveal','open');
    // },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_list())
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////