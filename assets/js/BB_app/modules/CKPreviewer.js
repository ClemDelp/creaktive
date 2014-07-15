var CKPreviewer = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
    this.views.Main = new this.Views.Main({
        a_notifications   : global.collections.all_notifs,
        eventAggregator : global.eventAggregator,
        project           : global.models.currentProject,
        user : global.models.current_user,
        screenshots : global.collections.Screenshots,
        slides : global.collections.Slides,
        presentations : global.collections.Presentations,
        knowledges : global.collections.Knowledges,
        concepts : global.collections.Concepts,
        poches : global.collections.Poches,
    });   
    this.views.Main.render();
  }
};

////////////////////////////////////////////////////////////
// VIEWS
CKPreviewer.Views.Modal = Backbone.View.extend({
    el:"#CKPreviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.model = new Backbone.Model();
        this.eventAggregator = json.eventAggregator;
        this.screenshots = json.screenshots;
        this.project = json.project;
        // Templates
        this.template_content = _.template($('#CKPreviewer_modalContent_templates').html());
        // Events
        this.eventAggregator.on("openModal", this.openModal, this);
    },
    events : {
        "click #selectzoon" : "select",
        "click #addimage" : "add",
        "click #resizeimage" : "resize",
        "click #newimage" : "new",
    },
    uploadFile : function(file,mode){
        _this = this;
        var s3upload = new S3Upload({
            file : file,
            s3_sign_put_url: '/S3/upload_sign',
            onProgress: function(percent, message) {
                console.log(percent, " ***** ", message);
            },
            onFinishS3Put: function(amz_id, file) {
                console.log("File uploaded ", amz_id);
                if(mode==1){
                    new_image = new global.Models.Screenshot({
                        id : guid(),
                        src : amz_id,
                        date : getDate(),
                        project_id : _this.project.get('id')
                    });
                    new_image.save();
                    _this.screenshots.add(new_image);
                }else{
                    _this.screenshots.remove(_this.current_screenshot);
                    _this.current_screenshot.set({'src':amz_id,'date':getDate()}).save();
                    _this.screenshots.add(_this.current_screenshot);
                }
                CKPreviewer.views.images_view.render();
            },
            onError: function(status) {
                console.log(status)
            }
        });

    },
    cutImage : function(mode){
        _this = this;
        if (this.x2==this.x1){
            alert("Please choose an area");
        }else{
            var image0 = new Image();
            image0.crossOrigin = "Anonymous";
            image0.onload=function(){
                var canvas = document.createElement("canvas");
                canvas.width = image0.width;
                canvas.height = image0.height;
                var context = canvas.getContext("2d");
                context.drawImage(image0,0,0);

                var imgData=context.getImageData(_this.x1*image0.width,_this.y1*image0.height,(_this.x2-_this.x1)*image0.width,(_this.y2-_this.y1)*image0.height);
    
                var canvas1 = document.createElement("canvas");
                canvas1.width = (_this.x2-_this.x1)*image0.width;
                canvas1.height = (_this.y2-_this.y1)*image0.height;
                var context1 = canvas1.getContext("2d");
                context1.putImageData(imgData,0,0);
                var imgdata = canvas1.toDataURL("image/png").replace(/data:image\/png;base64,/,'');
                var uintArray = Base64Binary.decode(imgdata);
                _this.uploadFile(uintArray,mode);
            };

            var src = "/getPrivateUrl?amz_id="+this.src;
            image0.src = src;

        }
    },
    resize : function(e){
        e.preventDefault();
        this.cutImage(0);
        $('#CKPreviewerModal').foundation('reveal', 'close');
    },
    new : function(e){
        e.preventDefault();
        this.cutImage(1);
        $('#CKPreviewerModal').foundation('reveal', 'close');
    },    
    select : function(e){
        e.preventDefault();
        _this=this;
        function showCoords(c)
        {
            _this.x1 = c.x/$("#cropbox").width();
            _this.x2 = c.x2/$("#cropbox").width();
            _this.y1 = c.y/$("#cropbox").height();
            _this.y2 = c.y2/$("#cropbox").height();
        };

        $(function(){
            $('#cropbox').Jcrop({
                trackDocument: true,
                onChange : showCoords,
                onSelect : showCoords
            });
        });
    },
    add : function(e){
        e.preventDefault();
        this.eventAggregator.trigger("renderImg",this.src);
        $('#CKPreviewerModal').foundation('reveal', 'close');
    },
    openModal : function(src,screenshot_id){
        this.src = src;
        this.current_screenshot = this.screenshots.get(screenshot_id);
        this.render(function(){
            $('#CKPreviewerModal').foundation('reveal', 'open'); 
            $(document).foundation();
        }); 
    },
    render:function(callback){
        $(this.el).html(''); 
        $(this.el).append(this.template_content({
            src : this.src
        }));

        // Render it in our div
        if(callback) callback();
    }
});
/***************************************/

/***************************************/

/////////////////////////////////////////
CKPreviewer.Views.MiddlePart = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.template = _.template($("#CKPreviewer_editer_template").html());
        this.project = json.project;
        this.knowledges = json.knowledges;
        this.eventAggregator  = json.eventAggregator;
        this.current_presentation = json.current_presentation;
        this.eventAggregator.on("renderImg", this.renderImg, this);
        this.eventAggregator.on("addCK", this.addCK, this);
        this.eventAggregator.on("addP", this.addP, this);
    },
    events : {
        "click .createpresentation" : "createpresentation",
        "click .clearpresentation" : "clearpresentation",
        "click .resetpresentation" : "resetpresentation",
        "click .exportDocx" : "exportDocx",
    },
    exportDocx : function(e){
        _this = this;
                if(this.current_presentation){
            var data = CKEDITOR.instances.ckeditor.getData();
            this.current_presentation.set({'data':CKEDITOR.instances.ckeditor.getData()}).save();
        }else{
            alert("Please create a presentation");
        }  
       var data = CKEDITOR.instances.ckeditor.getData();
       
        var arr = new Array();
        arr = data.split('src="');
        
        var asyncLoop = function(o){
            var i=0,
                length = o.length;
            
            var loop = function(){
                i++;
                if(i==length){o.callback(); return;}
                o.functionToLoop(loop, i);
            } 
            loop();//init
        }

        if(arr.length > 1 ){
                   asyncLoop({
            length : arr.length,
            functionToLoop : function(loop, i){
                var ind = arr[i].indexOf('" ');
                var src = arr[i].substring(0,ind);
                //Convertit en 
                _this.convertImgToBase64(src, function(base64Img,url){
                    data = data.replace(url,base64Img);
                    loop();
                });
                
            },
            callback : function(){

                $.post(
                    '/file/export2pdf',
                    {data : data}, 
                    function (url) {
                        $.download("/file/get", {path : url});
                        
                    }
                );
            }    
        });
               }else{
                $.post(
                    '/file/export2pdf',
                    {data : data}, 
                    function (data) {
                        $.download("/file/get", {path : url});
                        
                    }
                );
               }

    },

    convertImgToBase64 : function(url, callback, outputFormat){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback.call(this, dataURL,url);
            canvas = null; 
        };
        img.src = url;
    },
    resetpresentation : function(e){
        e.preventDefault();
        CKEDITOR.instances.ckeditor.setData();
        if(this.current_presentation){
            CKEDITOR.instances.ckeditor.insertHtml(this.current_presentation.get('data'));
        }
    },
    clearpresentation : function(e){
        e.preventDefault();
        CKEDITOR.instances.ckeditor.setData();
    },
    createpresentation : function(e){
        e.preventDefault();       
        if(this.current_presentation){
            var data = CKEDITOR.instances.ckeditor.getData();
            this.current_presentation.set({'data':CKEDITOR.instances.ckeditor.getData()}).save();
        }else{
            alert("Please create a presentation");
        }       
    },
    addCK : function(conceptTitle,conceptContent){
        var title = conceptTitle;
        var content = conceptContent;
        CKEDITOR.instances.ckeditor.insertHtml('<br><h1><strong>'+title+':'+'</strong></h1>'+content);
    },
    addP : function(poche){
        CKEDITOR.instances.ckeditor.insertHtml('<br><h1><strong>'+poche.get('title')+':'+'</strong></h1>'+poche.get('content'));
        this.knowledges.each(function(knowledge){
            knowledge.get('tags').forEach(function(tag){
                if(poche.get('title') == tag){
                    CKEDITOR.instances.ckeditor.insertHtml('<br><h2><strong>'+knowledge.get('title')+':'+'</strong></h2>'+knowledge.get('content'));
                }
            });
        });
    },
    renderImg : function(src){
        CKEDITOR.instances.ckeditor.insertHtml('<br><img src="/S3/getPrivateUrl?amz_id='+src+'" style="max-width: 100px" >');  
    },
    render : function(){
        $(this.el).empty();        
        $(this.el).append(this.template());
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Images = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.screenshots = json.screenshots;
        this.knowledges = json.knowledges;
        this.concepts = json.concepts;
        this.poches = json.poches;
        // Templates
        this.template = _.template($("#CKPreviewer_images_template").html()); 
    },
    events : {
        "click #image" : "addImg",
        "click #deleteimage" : "delImg",
        "click .concept" : "addConcept",
        "click .knowledge" : "addKnowledge",
        "click .poche" : "addPoche",
        "click #ImportAllknowledges" : "addAllknowledges",
        "click #ImportAllconcepts" : "addAllconcepts",
        "click #ImportAllpoches" : "addAllpoches",
    },
    addAllknowledges : function(e){
        _this = this;
        e.preventDefault();
        _.each(this.knowledges.toJSON(), function(knowledge) {
            title = knowledge.title;console.log(title);
            content = knowledge.content;console.log(content);
            _this.eventAggregator.trigger("addCK",title,content);
        });
    },
    addAllconcepts : function(e){
        _this = this;
        e.preventDefault();
        _.each(this.concepts.toJSON(), function(concept) {
            title = concept.title;
            content = concept.content;
            _this.eventAggregator.trigger("addCK",title,content);
        });
    },
    addAllpoches : function(e){
        _this = this;
        e.preventDefault();
        this.poches.each(function(poche) {
            _this.eventAggregator.trigger("addP",poche);
        });
    },
    delImg : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.screenshots.get(screenshot_id).destroy();
        CKPreviewer.views.images_view.render();
    },
    addImg : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.eventAggregator.trigger("openModal",imagesrc,screenshot_id);
    },
    addConcept : function(e){
        e.preventDefault();
        title = e.target.getAttribute("data-concepte-title");
        content = e.target.getAttribute("data-concepte-content");
        this.eventAggregator.trigger("addCK",title,content);
    },
    addKnowledge : function(e){
        e.preventDefault();
        title = e.target.getAttribute("data-knowledge-title");
        content = e.target.getAttribute("data-knowledge-content");
        this.eventAggregator.trigger("addCK",title,content);
    },
    addPoche : function(e){
        e.preventDefault();
        poche = this.poches.get(e.target.getAttribute("data-poche-id"));
        this.eventAggregator.trigger("addP",poche);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({
            images : this.screenshots.toJSON().reverse(),
            knowledges : this.knowledges.toJSON(),
            concepts : this.concepts.toJSON(),
            poches : this.poches.toJSON(),
        }));
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.presentationNum = json.presentationNum;
        this.project = json.project;
        this.presentations = json.presentations;
        this.current_presentation = json.current_presentation;
        // Templates
        this.template = _.template($("#CKPreviewer_action_template").html()); 
    },
    events : {
        "click #add1" : "add",
        "click #presentation" : "changecurrent",
        "click #delete" : "deletecurrent",
    },
    deletecurrent : function(e){
        e.preventDefault();
        this.current_presentation.destroy();
        document.getElementById("drop1").innerHTML ="";
        _.each(this.presentations.toJSON(), function(presentation) {
            document.getElementById("drop1").innerHTML += '<li>' + '<a id="presentation" href="#" presentation_id="' + presentation.id + '">' + presentation.title + '</a>' + '</li>';
        });
        if(this.presentations.first()){
            this.current_presentation = this.presentations.first();
        }else{
            this.current_presentation = null;
        }
        if(this.current_presentation){
            $("#drop0").html(this.current_presentation.get('title'));
            CKPreviewer.views.middle_part_view.render();
            CKEDITOR.replace('ckeditor',{
                height:"100%",
            });

            CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        }else{
            $("#drop0").html("Presentation");
            CKPreviewer.views.middle_part_view.render();
            CKEDITOR.replace('ckeditor',{
                height:"100%",
            });
            CKEDITOR.instances.ckeditor.setData();
        }

    },
    changecurrent : function(e){
        e.preventDefault();
        var sid = e.target.getAttribute("presentation_id");
        this.current_presentation = this.presentations.get(sid);
        $("#drop0").html(this.current_presentation.get('title'));
        CKPreviewer.views.middle_part_view.render();
        CKEDITOR.replace('ckeditor',{
            height:"100%",
        });
        CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
    },
    add : function(){
        if($(".presentation_title").val()){
            var project_id = this.project.get('id');
            if(this.current_presentation){
                new_presentation = new global.Models.Presentation({
                    id : guid(),
                    title : $(".presentation_title").val(),
                    data : "",
                    project_id : project_id,
                });
            }else{
                new_presentation = new global.Models.Presentation({
                    id : guid(),
                    title : $(".presentation_title").val(),
                    data : CKEDITOR.instances.ckeditor.getData(),
                    project_id : project_id,
                });     
            }
            new_presentation.save();
            alert("presentation created");
            document.getElementById("drop1").innerHTML += '<li>' + '<a id="presentation" href="#" presentation_id="' + new_presentation.toJSON().id + '">' + new_presentation.toJSON().title + '</a>' + '</li>';
            $("#drop0").html(new_presentation.toJSON().title);
            this.current_presentation = new_presentation;
            this.presentations.add(this.current_presentation);
            CKPreviewer.views.middle_part_view.render();
            CKEDITOR.replace('ckeditor',{
                height:"100%",
            });
            CKEDITOR.instances.ckeditor.setData(this.current_presentation.get("data"));
        }
     },
    render : function(){
        $(this.el).append(this.template({
        }));

        return this;
    }
});

/////////////////////////////////////////
// SLIDES
/////////////////////////////////////////


/////////////////////////////////////////
// MAIN
/////////////////////////////////////////
CKPreviewer.Views.Main = Backbone.View.extend({
    el:"#CKPreviewer_container",
    initialize : function(json) {
        _.bindAll(this, 'render');
        this.all_notifications  = json.a_notifications;
        this.eventAggregator = json.eventAggregator;
        this.screenshots = json.screenshots;
        this.user = json.user;
        this.concepts = json.concepts;
        this.knowledges = json.knowledges;
        this.poches = json.poches;
        this.project = json.project;
        //this.slides = json.slides;
        this.presentations = json.presentations;
        this.presentationNum = this.presentations.toJSON().length;
        this.current_presentation = null;
        if(this.presentations.first()){
            this.current_presentation = this.presentations.first();
        }
        // Modals
        if(CKPreviewer.views.modal){CKPreviewer.views.modal.remove();}
        CKPreviewer.views.modal = new CKPreviewer.Views.Modal({
            eventAggregator : this.eventAggregator,
            screenshots : this.screenshots,
            project : this.project,
        });
        
    },
    events : {

    },

    render : function(){
        $(this.el).empty();
        // Action
        if(CKPreviewer.views.actions_view){CKPreviewer.views.actions_view.remove();}
        CKPreviewer.views.actions_view = new CKPreviewer.Views.Actions({
            eventAggregator  : this.eventAggregator,
            presentationNum : this.presentationNum,
            project : this.project,
            presentations : this.presentations,
            current_presentation : this.current_presentation
        });
        $(this.el).append(CKPreviewer.views.actions_view.render().el);

        //image
        if(CKPreviewer.views.images_view){CKPreviewer.views.images_view.remove();}
        CKPreviewer.views.images_view = new CKPreviewer.Views.Images({
            className        : "large-4 medium-4 small-4 columns",
            eventAggregator  : this.eventAggregator,
            screenshots : this.screenshots,
            knowledges : this.knowledges,
            concepts : this.concepts,
            poches : this.poches
        });
        $(this.el).append(CKPreviewer.views.images_view.render().el);

        // Middle part
        if(CKPreviewer.views.middle_part_view){CKPreviewer.views.middle_part_view.remove();}
        CKPreviewer.views.middle_part_view = new CKPreviewer.Views.MiddlePart({
            className        : "panel large-8 medium-8 small-8 columns",
            eventAggregator  : this.eventAggregator,
            project : this.project,
            current_presentation : this.current_presentation,
            knowledges : this.knowledges,
        });
        $(this.el).append(CKPreviewer.views.middle_part_view.render().el);
        CKEDITOR.replace('ckeditor',{
            height:"100%",
        });
        if(this.current_presentation){
            CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        }
        
        _.each(this.presentations.toJSON(), function(presentation) {
            document.getElementById("drop1").innerHTML += '<li>' + '<a id="presentation" href="#" presentation_id="' + presentation.id + '">' + presentation.title + '</a>' + '</li>';
        });
        if(this.current_presentation){
            $("#drop0").html(this.current_presentation.get('title'));
        }
        $(document).foundation();
    }
});
/***************************************/









