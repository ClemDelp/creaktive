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
    uploadFile : function(file){
        _this = this;
        var s3upload = new S3Upload({
            file : file,
            s3_sign_put_url: '/S3/upload_sign',
            onProgress: function(percent, message) {
                console.log(percent, " ***** ", message);
            },
            onFinishS3Put: function(amz_id, file) {
                console.log("File uploaded ", amz_id);
                
                new_image = new global.Models.Screenshot({
                    id : guid(),
                    src : amz_id,
                    project_id : _this.project.get('id')
                });
                new_image.save();

            },
            onError: function(status) {
                console.log(status)
            }
        });

    },
    cutImage : function(){
        if (this.x2==this.x1){
            alert("Please choose an area");
        }else{
            var image0 = new Image();
            //image0.crossOrigin = "";
            image0.onload=function(){
                //alert(image0.width +" "+image0.height);
                //document.body.appendChild(image0);
                //console.log(image0);console.log(image0.natrualWidth);console.log(image0.height);
                var canvas = document.createElement("canvas");
                canvas.width = image0.width;
                canvas.height = image0.height;
                var context = canvas.getContext("2d");
                context.drawImage(image0,0,0);
                var imgData=context.getImageData(this.x1*image0.width,this.y1*image0.height,(this.x2-this.x1)*image0.width,(this.y2-this.y1)*image0.height);
    
                var canvas1 = document.createElement("canvas");
                canvas1.width = (this.x2-this.x1)*image0.width;
                canvas1.height = (this.y2-this.y1)*image0.height;
                var context1 = canvas1.getContext("2d");
                context1.putImageData(imgData,0,0);
                console.log(canvas1.toDataURL("image/png"));
                var imgdata = canvas1.toDataURL("image/png").replace(/data:image\/png;base64,/,'');
                var uintArray = Base64Binary.decode(screenshot);;
                return uintArray;
            };
            image0.src = "/S3/getPrivateUrl?amz_id="+this.src;

        }
    },
    resize : function(e){
        e.preventDefault();

    },
    new : function(e){
        e.preventDefault();
        var uintArray = this.cutImage();
        //this.uploadFile(uintArray);
        $('#CKPreviewerModal').foundation('reveal', 'close');
    },    
    select : function(e){
        e.preventDefault();
        _this=this;
        function showCoords(c)
        {
            _this.x1 = c.x/$(".jcrop-holder").width();
            _this.x2 = c.x2/$(".jcrop-holder").width();
            _this.y1 = c.y/$(".jcrop-holder").height();
            _this.y2 = c.y2/$(".jcrop-holder").height();
        };

        $(function(){
            $('#cropbox').Jcrop({
                trackDocument: true,
                onChange : showCoords,
                onSelect : showCoords
            });
        });
        console.log($(".jcrop-holder").width());
    },
    add : function(e){
        e.preventDefault();
        this.eventAggregator.trigger("renderImg",this.src);
        $('#CKPreviewerModal').foundation('reveal', 'close');
    },
    openModal : function(src){
        this.src = src;
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
// CKPreviewer.Views.CKModal = Backbone.View.extend({
//     el:"#ckpreviewerCKModal",
//     initialize:function(json){
//         _.bindAll(this, 'render', 'openCKModal');
//         // Variables
//         this.model = new Backbone.Model();
//         this.eventAggregator = json.eventAggregator;
//         // Templates
//         this.template_content = _.template($('#CKPreviewer_ckmodalContent_templates').html());
//         // Events
//         this.eventAggregator.on("openCKModal", this.openCKModal, this);
//     },
//     events : {
//         "click #addCK" : "addCK",
//     },
//     addCK : function(e){
//         e.preventDefault();
//         var Title = this.model.get("title");
//         var Content = this.model.get("content");
//         this.eventAggregator.trigger("addCK",Title,Content);        
//         $('#ckpreviewerCKModal').foundation('reveal', 'close');
//     },
//     openCKModal : function(model){
//         this.model = model;
//         this.render(function(){
//             $('#ckpreviewerCKModal').foundation('reveal', 'open'); 
//             $(document).foundation();
//         }); 
//     },
//     render:function(callback){
//         $(this.el).html(''); 
//         $(this.el).append(this.template_content({
//             knowledge : this.model.toJSON()
//         }));
//         // Render it in our div
//         if(callback) callback();
//     }
// });
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
            console.log(data);
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
                    //list_of_knowledges.add(knowledge);
                    CKEDITOR.instances.ckeditor.insertHtml('<br><h2><strong>'+knowledge.get('title')+':'+'</strong></h2>'+knowledge.get('content'));
                }
            });
        });
    },
    renderImg : function(src){
        CKEDITOR.instances.ckeditor.insertHtml('<br><img src="/S3/getPrivateUrl?amz_id='+src+'">');  
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
        "click .concept" : "addConcept",
        "click .knowledge" : "addKnowledge",
        "click .poche" : "addPoche",
        // "dblclick .concept" : "openConcept",
        // "dblclick .knowledge" : "openKnowledge",
        // "dblclick .poche" : "openPoche",
    },
    // openConcept : function(e){
    //     e.preventDefault();
    //     concept = this.concepts.get(e.target.getAttribute("data-concepte-id"));
    //     this.eventAggregator.trigger("openCKModal",concept);
    // },
    // openKnowledge : function(e){
    //     e.preventDefault();
    //     knowledge = this.knowledges.get(e.target.getAttribute("data-knowledge-id"));
    //     this.eventAggregator.trigger("openCKModal",knowledge);
    // },
    // openPoche : function(e){
    //     e.preventDefault();
    //     poche = this.poches.get(e.target.getAttribute("data-poche-id"));
    //     this.eventAggregator.trigger("openCKModal",poche);
    // },
    addImg : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        this.eventAggregator.trigger("openModal",imagesrc);
    },
    addConcept : function(e){
        e.preventDefault();
        // concept = this.concepts.get(e.target.getAttribute("data-concepte-id"));
        // this.eventAggregator.trigger("openCKModal",concept);
        title = e.target.getAttribute("data-concepte-title");
        content = e.target.getAttribute("data-concepte-content");
        this.eventAggregator.trigger("addCK",title,content);
    },
    addKnowledge : function(e){
        e.preventDefault();
        // knowledge = this.knowledges.get(e.target.getAttribute("data-knowledge-id"));
        // this.eventAggregator.trigger("openCKModal",knowledge);
        title = e.target.getAttribute("data-knowledge-title");console.log(title);
        content = e.target.getAttribute("data-knowledge-content");console.log(content);
        this.eventAggregator.trigger("addCK",title,content);
    },
    addPoche : function(e){
        e.preventDefault();
        poche = this.poches.get(e.target.getAttribute("data-poche-id"));console.log(poche);
        //this.eventAggregator.trigger("openCKModal",poche);
        this.eventAggregator.trigger("addP",poche);
    },
    render : function(){
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
        e.preventDefault();console.log(this.presentations);
        this.current_presentation.destroy();console.log(this.presentations);
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
                height:500,
            });
            console.log(this.current_presentation.get('data'));
            CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        }else{
            $("#drop0").html("Presentation");
            CKPreviewer.views.middle_part_view.render();
            CKEDITOR.replace('ckeditor',{
                height:500,
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
            height:500,
        });
        console.log(this.current_presentation.get('data'));
        CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
    },
    add : function(){
        if($(".presentation_title").val()){
            var project_id = this.project.get('id');console.log($(".presentation_title").val());
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
                height:500,
            });
            console.log(this.current_presentation.get("data"));
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
// CKPreviewer.Views.Slides = Backbone.View.extend({
//     initialize : function(json){
//         _.bindAll(this, 'render');
//         this.eventAggregator = json.eventAggregator;
//         this.slides = json.slides;
//         this.eventAggregator.on("addslide", this.addslide, this);
//         // Templates
//         this.template = _.template($('#CKPreviewer_slides_template').html());
//     },
//     events : {      
//         //"click #slide" : "checkslide", 
//     },
//     render : function(){
//         $(this.el).html('');
//         _this=this;
//         if(current_presentation){
//             var data = current_presentation.get('data');
//             var pages = data.toString().split('<div style="page-break-after: always;"><span style="display:none">&nbsp;</span></div>');
//             //var thumbnails = new Backbone.Collection;
//             console.log(pages);
//             var thumbnails = new Array();
//             var div_content = new Array();
//             var div_box = document.createElement("DIV");
//             div_box.id = "box";
//             div_box.style.position="absolute";
//             div_box.style.opacity= "0.0";
//             document.body.appendChild(div_box);
//             for(j=0;j<pages.length;j++){
//                 console.log(pages[j]);
//                 console.log("good");
//                     div_content[j] = document.createElement("DIV");
//                     div_content[j].id = "box"+j;
//                     div_content[j].style.position="absolute";
//                     div_content[j].innerHTML=pages[j];
//                     $("#box").append(div_content[j]);
//                     html2canvas(div_content[j], {
//                         onrendered: function(canvas) {
//                             tempImage = canvas.toDataURL( "image/png" );
//                             var canvas0 = document.createElement("canvas");
//                             var context = canvas0.getContext("2d");
//                             var img0 = document.createElement("img");
//                             img0.src = tempImage;

//                             s1 = img0.width/400;
//                             s2 = img0.height/400;
//                             if(s1>s2){
//                                 canvas0.width = img0.width;                  
//                                 canvas0.height = canvas0.width;
//                                 try{
//                                     context.drawImage(img0,0,(canvas0.height-img0.height)/2);
//                                     tempImage = canvas0.toDataURL( "image/png" );
//                                     thumbnails.push(tempImage);
//                                 }
//                                 catch(err){
//                                     thumbnails.push("");
//                                 }                                    
//                             }else{
//                                 canvas0.height = img0.height;
//                                 canvas0.width = canvas0.height;
//                                 try{
//                                     context.drawImage(img0,(canvas0.width-img0.width)/2,0);
//                                     tempImage = canvas0.toDataURL( "image/png" );
//                                     thumbnails.push(tempImage);
//                                 }
//                                 catch(err){
//                                     thumbnails.push("");
//                                 }
//                             }

//                             if((thumbnails.length)==(pages.length)){
//                                 $(_this.el).append(_this.template({
//                                     thumbnails : thumbnails,
//                                 }));     
//                             }                  
//                         }
//                     });

//             }
//         }
//         return this;
//     }
// });

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
            eventAggregator : this.eventAggregator
        });
        
        // if(CKPreviewer.views.ckmodal){CKPreviewer.views.ckmodal.remove();}
        // CKPreviewer.views.ckmodal = new CKPreviewer.Views.CKModal({
        //     eventAggregator : this.eventAggregator
        // });
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
            height:500,
        });
        if(this.current_presentation){
            CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        }

        // Slides
        // if(CKPreviewer.views.slides_view){CKPreviewer.views.slides_view.remove();}
        // CKPreviewer.views.slides_view = new CKPreviewer.Views.Slides({
        //     className        : "large-2 medium-2 small-2 columns",
        //     eventAggregator  : this.eventAggregator,
        //     slides : this.slides
        // });
        // $(this.el).append(CKPreviewer.views.slides_view.render().el);
        
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









