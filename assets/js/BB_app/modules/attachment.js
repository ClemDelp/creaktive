
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
        // Templates
        this.template = _.template($('#attachment-list-template').html());
    },
    events : {
        "click .openFile" : "openFile",
        "click .removeFile" : "removeFile",
        "change #uploadFile" : "uploadFile"
    },
    uploadFile : function(e){
        e.preventDefault();
        _this = this;
        var s3upload = new S3Upload({
            file_dom_selector: 'uploadFile',
            s3_sign_put_url: '/S3/upload_sign',
            onProgress: function(percent, message) {
                $('#status').html('Upload progress: ' + percent + '% ' + message);
            },
            onFinishS3Put: function(amz_id, file) {
                _this.model.get('attachment').unshift({
                    id : guid(),
                    name : file.name,
                    path : file.name,
                    url : amz_id
                });
                _this.model.save();
                _this.render();
            },
            onError: function(status) {
                console.log(status)
                $('#status').html('Upload error: ' + status);
            }
        });
        this.render();
},
removeFile : function(e){
    console.log(e.target.getAttribute('data-file-id'))
    var i = {};
    _.each(this.model.get('attachment'), function(f){
        if(f.id === e.target.getAttribute('data-file-id')) i = f
    })
    console.log(_.without(this.model.get('attachment'), i))
    this.model.set({attachment : _.without(this.model.get('attachment'), i)})
    this.model.save();
    //socket.post("/file/destroy", {file : i});
    this.render();
},
openFile : function(e){
    console.log(e.target.getAttribute('data-file-path'));
    $.download('file/get',{path : e.target.getAttribute('data-file-path')} );
},
render : function() {
    $(this.el).html("");
    $(this.el).append(this.template({
        model : this.model.toJSON()
    }));
    return this;
}
});
