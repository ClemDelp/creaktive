/**************************************/
var imagesList = {
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
/***************************************/
imagesList.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.model = json.model;
        //console.log("moooodel",this.model)
        this.attachments = this.model.get('attachment');
        this.knowledges = json.knowledges;
        // Templates
        this.template_diapo = _.template($('#imagesList-diapo-template').html());  
        this.template_image = _.template($("#imagesList_image_template").html());    
    },
    events : {},
    render : function(){
        _this=this;
        // Init
        $(this.el).html('');
        // filter attachment get only images
        images = [];
        this.attachments.forEach(function(attachment){
            if(attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){images.unshift(attachment)}
        })
        // get the diapo
        $(this.el).append(this.template_diapo({images:images}));
        // images.forEach(function(image){
        //     //console.log(image);
        //     $.get('/s3/getUrl?amz_id='+image.url, function(imagedate){
        //         image.imagedate = imagedate;
        //         //console.log(image,$("#imageList")[0]);
        //         $("#imageList").append(_this.template_image({
        //             image : image,
        //         }))
        //     })
        // })



        $(document).foundation();
        
        return this;
    }
});
