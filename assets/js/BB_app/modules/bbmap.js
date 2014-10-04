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
  css_knowledge_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #2980B9 2px;text-decoration: none;",
  css_concept_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;",
  css_poche_default : "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #D35400;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #D35400 2px;text-decoration: none;",
  default_templates : [
    {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;",
      id: "2e8b35bb-45d5-97b0-5d28-8e73f88c28c3",
      title: "Concept"
    },
    {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #2980B9 2px;text-decoration: none;",
      id: "33fc9b1a-0958-1d97-19d2-0ed2e2c593c6",
      title: "Knowledge"
    },
    {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #D35400;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #D35400 2px;text-decoration: none;",
      id: "92674815-4bc7-fb80-e0a0-c2bf0200f84d",
      title: "Category"
    },
    {
      css: "font-family: Arial;color: #000000;background: transparent;padding: 10px 20px 10px 20px;text-decoration: none;",
      id: "2ff4f56d-46ab-7839-704d-09b229c2a336",
      title: "Transparent"
    },
    {
      css: "-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #ffffff;background: #2ECC71;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;",
      id: "c2d0a329-67da-fd18-ab0c-6a1d6faeb084",
      title: "Know"
    },
    {
      css: "-webkit-border-radius: 27;-moz-border-radius: 27;border-radius: 27px;font-family: Arial;color: #ffffff;background: #9B59B6;padding: 10px 20px 10px 20px;border: solid #8E44AD 2px;text-decoration: none;",
      id: "ac94b001-277f-6132-bcf5-a6ee76dd8348",
      title: "Reachable"
    },
    {
      css: "-webkit-border-radius: 27;-moz-border-radius: 27;border-radius: 27px;font-family: Arial;color: #ffffff;background: #F1C40F;padding: 10px 20px 10px 20px;border: solid #F39C12 2px;text-decoration: none;",
      id: "a1ed5313-ec59-53e2-b888-baeb337ea8dc",
      title: "Alternative"
    },
    {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #3498DB;padding: 10px 20px 10px 20px;border: solid #2980B9 2px;text-decoration: none;",
      id: "7e8223f9-d39f-5246-d187-ec171022ccb6",
      title: "Validated"
    },
    {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #E67E22;padding: 10px 20px 10px 20px;border: solid #D35400 2px;text-decoration: none;",
      id: "e7f7844e-043b-1c3f-2e0d-15cd2a84be18",
      title: "Processing"
    },
    {
      css: "-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0px;font-family: Arial;color: #ffffff;background: #E74C3C;padding: 10px 20px 10px 20px;border: solid #C0392B 2px;text-decoration: none;",
      id: "adc43381-7b54-1530-7993-db9b54a0addb",
      title: "Missing"
    }
  ],
  // Constructor
  init: function () {
    // main
    this.views.main = new this.Views.Main({
      el              : "#bbmap_container",
      concepts        : global.collections.Concepts,
      project         : global.models.currentProject,
      user            : global.models.current_user,
      knowledges      : global.collections.Knowledges,
      poches          : global.collections.Poches,
      links           : global.collections.Links,
      eventAggregator : global.eventAggregator,
      notifications   : global.collections.Notifications,
      mode            : global.mode,
      init            : true,
      ckOperator      : global.ckOperator,
      filter          : global.filter,

    });
    //this.views.main.render();
  },
};






