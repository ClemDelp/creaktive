/////////////////////////////////////////////////
var googleSearch = {
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
googleSearch.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.mode = json.mode;
        this.model = json.model;
        this.childViews = [];
        this.type       = json.type;
        this.perpage    = json.perpage;
        this.moreButton = json.moreButton;
        this.width      = json.width;
        // Events

        // Templates
        this.template_header = _.template($('#googleSearch-bar-template').html());
        ////////////////////////////:
        this.settings = {
            term        : this.model.get('title'), // the term what you want to looking for
            siteURL     : 'creaktive.fr',   // Change this to your site
            searchSite  : false,    // filter search on the site or not
            type        : this.type,// images / news / video / web
            append      : false,   // append new element to el
            perPage     : this.perpage,    // A maximum of 8 is allowed by Google
            page        : 0,    // The start page
            protocol    : 'https', // http or https 
            more        : this.moreButton, // display or not the more button
            width       : this.width, // display or not the more button
        }
    },
    events : {},
    render : function(settings){        
        ///////////////////////
        // init
        $(this.el).empty();
        api.googleSearch(this.settings,$(this.el));
        return this;
    }
});
/////////////////////////////////////////////////
