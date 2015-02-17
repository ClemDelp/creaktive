/////////////////////////////////////////////////
var bbmap = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  // Parameters
  window_height : $(window).height() - 50,
  zoom : new Backbone.Model({val : 1}),
  node_size : function(){ return 18*this.zoom.get('val'); },
  horizontal_gap : function(){ return 200*this.zoom.get('val'); },
  vertical_gap : function(){ return 80*this.zoom.get('val');},
  stats : {
    "c_empty" : {
      title: "C",
      desc : "empty concept",
      stat : 0
    },
    "c_full" : {
      title: "C",
      desc: "concept with description",
      stat : 0
    },
    "k_empty" : {
      title: "K",
      desc : "empty knowledge",
      stat : 0
    },
    "k_full" : {
      title: "K",
      desc: "knowledge with description",
      stat : 0
    },
    "p_empty" : {
      title: "P",
      desc : "no linked knowledges",
      stat : 0
    },
    "p_full" : {
      title: "P",
      desc: "with linked knowledges",
      stat : 0
    },
    "other" : {
      title: "?",
      desc: "way to explore",
      stat : 0
    },
    "cc_link" : {
      title: "C-C",
      desc: "operator C to C",
      stat : 0
    },
    "co_link" : {
      title: "C-*",
      desc: "operator C to *",
      stat : 0
    },
    "kk_link" : {
      title: "K-K",
      desc: "operator K to K",
      stat : 0
    },
    "ko_link" : {
      title: "K-*",
      desc: "operator K to *",
      stat : 0
    },
    "pp_link" : {
      title: "P-P",
      desc: "operator P to P",
      stat : 0
    },
    "po_link" : {
      title: "P-*",
      desc: "operator P to *",
      stat : 0
    },
    "c_nbre" : {
      title: "dC",
      desc: "concept number",
      stat : 0
    },
    "c_perc" : {
      title: "%C",
      desc: "percentage of concept",
      stat : 0
    },
    
    "k_nbre" : {
      title: "dK",
      desc: "knowledge number",
      stat : 0
    },
    
    "k_perc" : {
      title: "%K",
      desc: "percentage of knowledge",
      stat : 0
    }
  },
  // Constructor
  init: function () {
    // main
    this.views.main = new this.Views.Main({
      el              : "#bbmap_container",
      elements        : global.collections.Elements,
      concepts        : global.collections.Concepts,
      project         : global.models.currentProject,
      user            : global.models.current_user,
      users           : global.collections.Users,
      knowledges      : global.collections.Knowledges,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      eventAggregator : global.eventAggregator,
      notifications   : global.collections.Notifications,
      mode            : global.mode,
      init            : true,
      ckOperator      : global.ckOperator,
      filter          : global.filter,
      news            : global.collections.News

    });
  },
};






