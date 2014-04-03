/***************************************/
attachment.Views.Main = Backbone.View.extend({
    initialize : function(json) { 
        //console.log("comments view constructor!");
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        this.files = this.model.get('attachment');
        this.eventAggregator = json.eventAggregator;
        _eventAggregator = this.eventAggregator;
        // Events
        // Templates
        this.template = _.template($('#attachment-list-template').html());
    },
    events : {
        "click .openFile" : "openFile",
        "click .removeFile" : "removeFile",
        "change .uploadFile" : "uploadFile"
    },
    uploadFile : function(e){
        e.preventDefault();
        files = e.target.files;
        console.log(files)
        // Create a formdata object and add the files
        var data = new FormData();
        $.each(files, function(key, value)
        {
            data.append(key, value);
        });
        _this = this;
        $.ajax({
            url: '/file/upload',
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
                    console.log(data);
                    if(data.result === "success"){
                        _this.files.unshift({
                            id : data.id,
                            name : data.name,
                            path : data.path
                        });
                        _this.model.save();
                        _this.render();
                    };
                }
                else
                {
                    // Handle errors here
                    alert('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                alert('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    },
    removeFile : function(e){
        console.log(e.target.getAttribute('data-file-id'))
        var i = {};
        _.each(this.files, function(f){
            if(f.id === e.target.getAttribute('data-file-id')) i = f
        })
        this.files =  _.without(this.files, i);
        this.model.set({attachment : this.files})
        this.model.save();
        socket.post("/file/destroy", {file : i});
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
