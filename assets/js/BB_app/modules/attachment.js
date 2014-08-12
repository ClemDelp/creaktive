
/////////////////////////////////////////////////
var attachment = {
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
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
attachment.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.eventAggregator = global.eventAggregator;
        // Templates
        this.template = _.template($('#attachment-list-template').html()); 
    },
    events : {
        "click .removeFile" : "removeFile",
        "change #uploadfile" : "uploadFile"
    },
    uploadFile : function(e){
      e.preventDefault();
      e.stopPropagation();
        _this=this;
        global.Functions.uploadFile(e, function(amz_id, fileName){
            var newattachment = {
                    id : guid(),
                    name : fileName,
                    path : fileName,
                    url : amz_id
                };

            _this.model.get('attachment').unshift(newattachment);
            _this.eventAggregator.trigger('fileuploaded');
            _this.model.save();
            _this.render();
        })  
    },


removeFile : function(e){
    this.model.save({
      attachment : _.without(this.model.get('attachment'), _.findWhere(this.model.get('attachment'), {id : e.target.getAttribute('data-file-id')} ))
    })
    this.eventAggregator.trigger('fileuploaded');


    //socket.post("/file/destroy", {file : i});
    this.render();
},

render : function() { 
    _this1=this;
    $(this.el).html("");
    $(this.el).append(this.template({
        attachments : this.model.get('attachment')
    }));
    return this;
}
});
