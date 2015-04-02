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
        "click .tuto" : "openTuto",
        "click .valid_tuto" : "valid_tuto"
    },
    openTuto : function(e){
        e.preventDefault();
        var tuto = e.target.getAttribute("data-tuto");
        var tuto_template = _.template($('#tuto-'+tuto+'-template').html());
        $('#tutosModal_container').html(tuto_template())
        $('#tutosModal').foundation('reveal','open');
    },
    valid_tuto : function(e){
        e.preventDefault();
        alert('rr')
        $('#tutosModal').foundation('reveal','close');
    },
    render : function(){        
        $(this.el).empty();
        $(this.el).append(this.template_list())
        $(document).foundation();
        return this;
    }
});
/////////////////////////////////////////////////