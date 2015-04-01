/////////////////////////////////////////////////
var tutos = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function (json) {
    this.views.main = new tutos.Views.Main({
        el : json.el,
    });
    this.views.main.render();
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
tutos.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        
        // Events
        // Templates
        this.template_list = _.template($('#tutos-list-template').html());
    },
    events : {
        "click .tuto" : "openTuto"
    },
    openTuto : function(e){
        e.preventDefault();
        var tuto = e.target.getAttribute("data-tuto");
        var tuto_template = _.template($('#tuto-'+tuto+'-template').html());
        $('#tutosModal_container').html(tuto_template())
        $('#tutosModal').foundation('reveal','open');
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_list())
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////