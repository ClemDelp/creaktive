
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
        this.template_image = _.template($('#attachment_image_template').html()); 
    },
    events : {
        "click .openFile" : "openFile",
        "click .removeFile" : "removeFile",
        "change #uploadfile" : "uploadFile"
    },
    uploadFile : function(e){
        e.stopPropagation(); // Stop stuff happening
        e.preventDefault(); // Totally stop stuff happening
        global.Functions.uploadFile(e, function(amz_id, fileName){
            _this.model.get('attachment').unshift({
                    id : guid(),
                    name : fileName,
                    path : fileName,
                    url : amz_id
                });
                _this.model.save();
                _this.render();
        })  
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
    _this=this;
  
    $(this.el).html("");
    $(this.el).append(this.template({
        model : this.model.toJSON()
    }));

    this.model.get('attachment').forEach(function(image){
        console.log(image)
        $.get('/s3/getUrl?amz_id='+image.url, function(imagedate){
            image.imagedate = imagedate;
            console.log($("#imageList"),image);
            console.log(_this.template,_this.template_image);
            $("#imageList").append(_this.template_image({
              file : image,
            }))
        })
    })



    return this;
}
});
