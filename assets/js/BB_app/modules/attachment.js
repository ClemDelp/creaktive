
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
        "change #uploadfile" : "uploadFile"
    },
    uploadFile : function(e){

e.stopPropagation(); // Stop stuff happening
    e.preventDefault(); // Totally stop stuff happening

    files = e.target.files;
 
    // START A LOADING SPINNER HERE
 
    // Create a formdata object and add the files
    var data = new FormData();
    $.each(files, function(key, value)
    {
        data.append(key, value);
    });
    
    $.ajax({
        url: 's3/upload',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR)
        {
            if(typeof data.error === 'undefined')
            {
                // Success so call function to process the form
                submitForm(e, data);
            }
            else
            {
                // Handle errors here
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });

        // e.preventDefault();
        // _this = this;
        // var s3upload = new S3Upload({
        //     file_dom_selector: 'uploadFile',
        //     s3_sign_put_url: '/S3/upload_sign',
        //     onProgress: function(percent, message) {
        //         $('#status').html('Upload progress: ' + percent + '% ' + message);
        //     },
        //     onFinishS3Put: function(amz_id, file) {
        //         _this.model.get('attachment').unshift({
        //             id : guid(),
        //             name : file.name,
        //             path : file.name,
        //             url : amz_id
        //         });
        //         _this.model.save();
        //         _this.render();
        //     },
        //     onError: function(status) {
        //         console.log(status)
        //         $('#status').html('Upload error: ' + status);
        //     }
        // });
        // this.render();
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
