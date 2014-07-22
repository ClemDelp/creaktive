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
CKPreviewer.Views.Modal = Backbone.View.extend({            //model to render the image
    el:"#CKPreviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.actionflag = 0;
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
        "click #confirm" : "confirm",
        "click #resizeimage" : "resize",
        "click #newimage" : "new",
    },
    confirm : function(e){
        e.preventDefault();
        if(this.actionflag==0){
            $('#CKPreviewerModal').foundation('reveal', 'close');
        }else{
            this.cutImage(this.actionflag);
            $('#CKPreviewerModal').foundation('reveal', 'close');
        }

    },
    //upload new image
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
                    if(mode==2){
                        _this.screenshots.remove(_this.current_screenshot);
                        _this.current_screenshot.set({'src':amz_id,'date':getDate()}).save();
                        _this.screenshots.add(_this.current_screenshot);
                    }
                }
                CKPreviewer.views.images_view.render();
            },
            onError: function(status) {
                console.log(status)
            }
        });
    },
    //modify image
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
        this.actionflag = 2;
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
    new : function(e){
        e.preventDefault();
        this.actionflag = 1;
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
    openModal : function(src,screenshot_id){
        _this = this;
        this.src = src;
        this.actionflag = 0;
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
CKPreviewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.project = json.project;
        this.presentations = json.presentations;
        this.current_presentation = json.current_presentation;
        // Templates
        this.template = _.template($("#CKPreviewer_action_template").html()); 
    },
    events : {
        "click #add1" : "add",
        "click #presentation" : "changecurrent",
    },
    //change current presentation
    changecurrent : function(e){
        e.preventDefault();
        var sid = e.target.getAttribute("presentation_id");
        this.current_presentation = this.presentations.get(sid);
        //console.log(this.current_presentation);
        CKPreviewer.views.middle_part_view.current_presentation=this.current_presentation;
        CKPreviewer.views.middle_part_view.mode=1;
        CKPreviewer.views.middle_part_view.render();
        CKEDITOR.replace('ckeditor',{
            height:700,
        });
        CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        var cp = this.current_presentation;
        CKEDITOR.instances.ckeditor.on( 'change', function(e) {
            var data = CKEDITOR.instances.ckeditor.getData();
            //console.log(this.current_presentation);
            cp.set({'data':CKEDITOR.instances.ckeditor.getData()}).save();    
        });
    },
    //create a new presentation
    add : function(){
        if($(".presentation_title").val()){
            var project_id = this.project.get('id');
            new_presentation = new global.Models.Presentation({
                id : guid(),
                title : $(".presentation_title").val(),
                data : "",
                project_id : project_id,
            });
            new_presentation.save();
            alert("Presentation created");
            this.current_presentation = new_presentation;
            this.presentations.add(this.current_presentation);
            this.render();
        }
     },
    render : function(){
        $(this.el).empty();
        $(this.el).append(this.template({
            presentations : this.presentations.toJSON(),
        }));

        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.MiddlePart = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.template = _.template($("#CKPreviewer_editer_template").html());
        this.project = json.project;
        this.presentations = json.presentations;
        this.knowledges = json.knowledges;
        this.eventAggregator  = json.eventAggregator;
        this.current_presentation = json.current_presentation;
        this.eventAggregator.on("renderImg", this.renderImg, this);
        this.eventAggregator.on("addCK", this.addCK, this);
        this.eventAggregator.on("addP", this.addP, this);
        this.mode = 0;
    },
    events : {
        "click .delete" : "deletepresentation",
        "click .clearpresentation" : "clearpresentation",
        "click .export" : "export",
        "click .return" : "returnAction"
    },
    returnAction : function(e){
        this.mode = 0;
        this.render();
    },
    export : function(e){
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
            loop();
        }
        //have more than 1 image
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
        }else{ //have no image
            $.post(
                '/file/export2pdf',
                {data : data}, 
                function (url) {
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
    clearpresentation : function(e){
        e.preventDefault();
        if(confirm("Do you want to clear the board?")){
            CKEDITOR.instances.ckeditor.setData();
        }
    },
    //delete current presentation
    deletepresentation : function(e){
        if(confirm("The current presentation will be removed, would you continue?")){
            this.deletecurrent();
        }
    },
    deletecurrent : function(){
        this.current_presentation.destroy();
        if(this.presentations.first()){
            this.current_presentation = this.presentations.first();
        }else{
            this.current_presentation = null;
        }
        CKPreviewer.views.middle_part_view.current_presentation=this.current_presentation;
        this.returnAction();
    },

    addCK : function(conceptTitle,conceptContent){
        var title = conceptTitle;
        var content = conceptContent;
        //console.log(content.replace(/<p>/g,'<p style="text-indent: 2em">'));
        CKEDITOR.instances.ckeditor.insertHtml('<br><h2 style="color:red"><strong><span class="marker">'+title+':'+'</span></strong></h2>'+content.replace(/<p>/g,'<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'));
    },
    addP : function(poche){
        CKEDITOR.instances.ckeditor.insertHtml('<br><h2><strong>'+poche.get('title')+':'+'</strong></h2>'+poche.get('content'));
        var i=1;
        this.knowledges.each(function(knowledge){
            knowledge.get('tags').forEach(function(tag){
                if(poche.get('title') == tag){
                    CKEDITOR.instances.ckeditor.insertHtml('<br><h3><strong>&nbsp&nbsp&nbsp&nbsp'+i+'.'+knowledge.get('title')+':'+'</strong></h3>'+knowledge.get('content').replace(/<p>/g,'<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'));
                    i+=1;
                }
            });
        });
    },
    renderImg : function(src,size){
        var wid=$("#textzoon")[0].offsetWidth;
        switch(size){
            case 0:
                CKEDITOR.instances.ckeditor.insertHtml('<br><img src="/S3/getPrivateUrl?amz_id='+src+'" style="width:'+wid*0.4+'px" >');
                break;
            case 1:
                CKEDITOR.instances.ckeditor.insertHtml('<br><img src="/S3/getPrivateUrl?amz_id='+src+'" style="width:'+wid*0.7+'px" >');
                break;
            case 2:
                CKEDITOR.instances.ckeditor.insertHtml('<br><img src="/S3/getPrivateUrl?amz_id='+src+'" style="width:'+wid*0.95+'px" >');
                break;
        }
    },
    render : function(){
        $(this.el).empty();    
        if(this.mode==0){
            if(CKPreviewer.views.actions_view){CKPreviewer.views.actions_view.remove();}
            CKPreviewer.views.actions_view = new CKPreviewer.Views.Actions({
                eventAggregator  : this.eventAggregator,
                project : this.project,
                presentations : this.presentations,
                current_presentation : this.current_presentation
            });
        $(this.el).append(CKPreviewer.views.actions_view.render().el);

        }else{   
            $(this.el).append(this.template({
                cp : this.current_presentation.toJSON(),
            }));
        }
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
        this.ks_to_render = this.knowledges;
        this.cs_to_render = this.concepts;
        this.ps_to_render = this.poches;
        // Templates
        this.template = _.template($("#CKPreviewer_images_template").html()); 
    },
    events : {
        "click #deleteimage" : "delImg",
        "click .concept" : "addConcept",
        "click .knowledge" : "addKnowledge",
        "click .poche" : "addPoche",
        "click #ImportAllknowledges" : "addAllknowledges",
        "click #ImportAllconcepts" : "addAllconcepts",
        "click #ImportAllpoches" : "addAllpoches",
        "keyup .searchK" : "searchK",
        "keyup .searchC" : "searchC",
        "keyup .searchP" : "searchP",
        "click .smallimage" : "smallimage",
        "click .mediumimage" : "mediumimage",
        "click .largeimage" : "largeimage",
        "click .downloadimage" : "downloadimage",
        "click .editimage" : "editImg"
    },
    downloadimage : function(e){
        e.preventDefault();
        imagesrc = e.target.getAttribute("data-image-id");
        imagedate = e.target.getAttribute("data-image-date");

        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL("image/png");
            canvas = null; 

            // var evt = document.createEvent("HTMLEvents");
            // evt.initEvent("click", false, false);
            var aLink = document.createElement('a');
            aLink.href = dataURL;
            aLink.setAttribute('download', imagedate);
            //aLink.dispatchEvent(evt);
            document.body.appendChild(aLink);
            //console.log(aLink.download);
            aLink.click();
            document.body.removeChild(aLink);
            };
            img.src = "/S3/getPrivateUrl?amz_id="+imagesrc;
    },
    smallimage : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            src = e.target.getAttribute("data-image-id");
            this.eventAggregator.trigger("renderImg",src,0);
        }
    },
    mediumimage : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            src = e.target.getAttribute("data-image-id");
            this.eventAggregator.trigger("renderImg",src,1);
        }
    },
    largeimage : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            src = e.target.getAttribute("data-image-id");
            this.eventAggregator.trigger("renderImg",src,2);
        }
    },
    searchK: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.knowledges.each(function(k){
            if(research.toLowerCase() == k.get('title').substr(0,research_size).toLowerCase()){
                matched.add(k);
            }
        });
        this.ks_to_render = matched;
        this.render_ks();
    },
    searchC: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.concepts.each(function(k){
            if(research.toLowerCase() == k.get('title').substr(0,research_size).toLowerCase()){
                matched.add(k);
            }
        });
        this.cs_to_render = matched;
        this.render_cs();
    },
    searchP: function(e){
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.poches.each(function(k){
            if(research.toLowerCase() == k.get('title').substr(0,research_size).toLowerCase()){
                matched.add(k);
            }
        });
        this.ps_to_render = matched;
        this.render_ps();
    },
    //add content
    addAllknowledges : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            _this = this;
            _.each(this.knowledges.toJSON(), function(knowledge) {
                title = knowledge.title;
                content = knowledge.content;
                _this.eventAggregator.trigger("addCK",title,content);
            });
        }
    },
    addAllconcepts : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            _this = this;
            _.each(this.concepts.toJSON(), function(concept) {
                title = concept.title;
                content = concept.content;
                _this.eventAggregator.trigger("addCK",title,content);
            });
        }
    },
    addAllpoches : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            _this = this;
            this.poches.each(function(poche) {
             _this.eventAggregator.trigger("addP",poche);
            });
        }
    },
    delImg : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.screenshots.get(screenshot_id).destroy();
        CKPreviewer.views.images_view.render();
    },
    editImg : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.eventAggregator.trigger("openModal",imagesrc,screenshot_id);
    },
    addConcept : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            title = e.target.getAttribute("data-concepte-title");
            content = e.target.getAttribute("data-concepte-content");
            this.eventAggregator.trigger("addCK",title,content);
        }
    },
    addKnowledge : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            title = e.target.getAttribute("data-knowledge-title");
            content = e.target.getAttribute("data-knowledge-content");
            this.eventAggregator.trigger("addCK",title,content);
        }
    },
    addPoche : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            poche = this.poches.get(e.target.getAttribute("data-poche-id"));
            this.eventAggregator.trigger("addP",poche);
        }
    },
    render_ks : function(){
        this.ks_el = $(this.el).find('#ks');
        this.ks_el.empty();
        if(CKPreviewer.views.ks_view){CKPreviewer.views.ks_view.remove();}
        CKPreviewer.views.ks_view = new CKPreviewer.Views.Ks({
            id                  : "ks_view",
            knowledges          : this.ks_to_render,
        });
        $(this.ks_el).append(CKPreviewer.views.ks_view.render().el);
    },
    render_cs : function(){
        this.cs_el = $(this.el).find('#cs');
        this.cs_el.empty();
        if(CKPreviewer.views.cs_view){CKPreviewer.views.cs_view.remove();}
        CKPreviewer.views.cs_view = new CKPreviewer.Views.Cs({
            id                  : "ks_view",
            concepts          : this.cs_to_render,
        });
        $(this.cs_el).append(CKPreviewer.views.cs_view.render().el);
    },
    render_ps : function(){
        this.ps_el = $(this.el).find('#ps');
        this.ps_el.empty();
        if(CKPreviewer.views.ps_view){CKPreviewer.views.ps_view.remove();}
        CKPreviewer.views.ps_view = new CKPreviewer.Views.Ps({
            id                  : "ks_view",
            poches          : this.ps_to_render,
        });
        $(this.ps_el).append(CKPreviewer.views.ps_view.render().el);
    },
    render : function(){
        $(this.el).html('');
        $(this.el).append(this.template({
            images : this.screenshots.toJSON().reverse(),
        }));

        this.ks_el = $(this.el).find('#ks');
        this.ks_el.empty();
        CKPreviewer.views.ks_view = new CKPreviewer.Views.Ks({
            id                  : "ks_view",
            knowledges          : this.ks_to_render,
        });
        $(this.ks_el).append(CKPreviewer.views.ks_view.render().el);

        this.cs_el = $(this.el).find('#cs');
        this.cs_el.empty();
        CKPreviewer.views.cs_view = new CKPreviewer.Views.Cs({
            id                  : "cs_view",
            concepts          : this.cs_to_render,
        });
        $(this.cs_el).append(CKPreviewer.views.cs_view.render().el);

        this.ps_el = $(this.el).find('#ps');
        this.ps_el.empty();
        CKPreviewer.views.ps_view = new CKPreviewer.Views.Ps({
            id                  : "ps_view",
            poches          : this.ps_to_render,
        });
        $(this.ps_el).append(CKPreviewer.views.ps_view.render().el);

        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Ks = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.knowledges = json.knowledges;
        // Templates
        this.template = _.template($("#CKPreviewer_ks_template").html()); 
    },
    events : {
    },
    render : function(){
        $(this.el).html(this.template({
            knowledges : this.knowledges.toJSON(),
        }));
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Cs = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.concepts = json.concepts;
        // Templates
        this.template = _.template($("#CKPreviewer_cs_template").html()); 
    },
    events : {
    },
    render : function(){
        $(this.el).html(this.template({
            concepts : this.concepts.toJSON(),
        }));
        return this;
    }
});
/////////////////////////////////////////
CKPreviewer.Views.Ps = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.poches = json.poches;
        // Templates
        this.template = _.template($("#CKPreviewer_ps_template").html()); 
    },
    events : {
    },
    render : function(){
        $(this.el).html(this.template({
            poches : this.poches.toJSON(),
        }));
        return this;
    }
});




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

        //Left part
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

        // Right part
        if(CKPreviewer.views.middle_part_view){CKPreviewer.views.middle_part_view.remove();}
        CKPreviewer.views.middle_part_view = new CKPreviewer.Views.MiddlePart({
            className        : "panel large-8 medium-8 small-8 columns",
            eventAggregator  : this.eventAggregator,
            project : this.project,
            current_presentation : this.current_presentation,
            knowledges : this.knowledges,
            presentations : this.presentations,
        });
        $(this.el).append(CKPreviewer.views.middle_part_view.render().el);


        $(document).foundation();

        
    }
});
/***************************************/









