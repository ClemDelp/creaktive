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
        this.eventAggregator = json.eventAggregator;

        this.eventAggregator.on('fileuploaded', this.render,this)
        this.eventAggregator.on('fileuploaded', function(){
          console.log("EVENT")
        },this)
        // Templates
        this.template_diapo = _.template($('#imagesList-diapo-template').html());  
        this.template_image = _.template($("#imagesList_image_template").html());    
    },
    events : {},
    render : function(){
        _this0=this;
        // Init
        $(this.el).html('');
        // filter attachment get only images
        images = [];
        this.model.get('attachment').forEach(function(attachment){
            if(attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)){images.unshift(attachment)}
        })
        // get the diapo
        $(this.el).append(this.template_diapo({images:images}));
        //console.log(images);
        images.forEach(function(image){
            $.get('/s3/getUrl?amz_id='+image.url, function(imagedate){
                image.imagedate = imagedate;
                //console.log(image);
                $("#imageList").append(_this0.template_image({
                    image : image,
                }))
                delete image.imagedate;
            })
        })



        $(document).foundation();
        
        return this;
    }
});
