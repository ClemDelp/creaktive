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
        presentationId : global.presentationId,
    });   
    this.views.Main.render();
  }
};

////////////////////////////////////////////////////////////
// VIEWS 
// Image Edit Panel
CKPreviewer.Views.Modal = Backbone.View.extend({            
    el:"#CKPreviewerModal",
    initialize:function(json){
        _.bindAll(this, 'render', 'openModal');
        // Variables
        this.x1 = 0;                         // Parametres de Jcrop
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.actionflag = 0;                 // Resize or create new one
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

    //Button of OK
    confirm : function(e){
        e.preventDefault();
        if(this.actionflag==0){
            $('#CKPreviewerModal').foundation('reveal', 'close');
        }else{
            this.cutImage(this.actionflag);
            $('#CKPreviewerModal').foundation('reveal', 'close');
        }

    },

    //modify image
    cutImage : function(mode){
        _this0 = this;

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
                var imgData=context.getImageData(_this0.x1*image0.width,_this0.y1*image0.height,(_this0.x2-_this0.x1)*image0.width,(_this0.y2-_this0.y1)*image0.height);   
                var canvas1 = document.createElement("canvas");
                canvas1.width = (_this0.x2-_this0.x1)*image0.width;
                canvas1.height = (_this0.y2-_this0.y1)*image0.height;
                var context1 = canvas1.getContext("2d");
                context1.putImageData(imgData,0,0);
                var imgdata = canvas1.toDataURL("image/png");

                // Create new image
                if(mode==1){
                    global.Functions.uploadScreenshot(imgdata, function(data){
                        var s = new global.Models.Screenshot({
                            id : guid(),
                            src : data,
                            date : getDate(),
                            project_id : _this0.project.get('id')
                        });
                        s.save();
                        CKPreviewer.views.images_view.screenshots.add(s);
                        CKPreviewer.views.images_view.render();
                        $(document).foundation();
                        alert("New image created");
                    });
                }else{

                //Resize image
                    if(mode==2){
                        $.post(
                            's3/deleteFile',
                            {fileName : _this0.amz_id}, 
                            function (data) {
                                //console.log(data);
                            }
                        );
                        global.Functions.uploadScreenshot(imgdata, function(data){
                            _this0.screenshots.remove(_this0.current_screenshot);
                            _this0.current_screenshot.set({'src':data,'date':getDate()}).save();
                            _this0.screenshots.add(_this0.current_screenshot).save();
                            CKPreviewer.views.images_view.render();
                            $(document).foundation();
                            alert("This image is resized");
                        });
                    }
                }
            };
            image0.src = this.src;
        }
    },
    // Save parameters for resize
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
    // Save parameters for new image
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
        this.src = '/s3/getUrl?amz_id='+src;
        this.actionflag = 0;
        this.current_screenshot = this.screenshots.get(screenshot_id);
        this.amz_id = this.current_screenshot.get("src");
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
//Page initial, list of all reports
//////////////////////////////////////////
CKPreviewer.Views.Actions = Backbone.View.extend({
    initialize : function(json){
        _.bindAll(this, 'render');
        this.eventAggregator = json.eventAggregator;
        this.project = json.project;
        this.presentations = json.presentations;
        this.current_presentation = json.current_presentation;
        this.user = json.user;
        this.eventAggregator.on("rendercurrent", this.rendercurrent,this);
        // Templates
        this.template = _.template($("#CKPreviewer_action_template").html()); 
    },
    events : {
        "click #add1" : "add",
        "click .presentation" : "select_presentation",
    },

    select_presentation : function(e){
        e.preventDefault();
        var p_id = e.target.getAttribute("presentation_id");
        this.rendercurrent(p_id);
    },

    // Change current presentation
    // Enter page of text editor
    rendercurrent : function(p_id){
        this.current_presentation = this.presentations.get(p_id);
        //console.log(this.current_presentation);
        CKPreviewer.views.middle_part_view.current_presentation=this.current_presentation;
        CKPreviewer.views.middle_part_view.mode=1;
        CKPreviewer.views.middle_part_view.render();
        $(document).foundation();
        CKEDITOR.replace('ckeditor',{
            height:500,
        });
        CKEDITOR.instances.ckeditor.setData(this.current_presentation.get('data'));
        var cp = this.current_presentation;
        CKEDITOR.instances.ckeditor.on( 'change', function(e) {
            var data = CKEDITOR.instances.ckeditor.getData();
            cp.set({'data':CKEDITOR.instances.ckeditor.getData()}).save();    
        });
        $('#showMenu').show('slow');
    },

    //Create a new presentation
    add : function(){
        if($(".presentation_title").val()){
            var project_id = this.project.get('id');
            var new_presentation = new global.Models.Presentation({
                id : guid(),
                title : $(".presentation_title").val(),
                data : "",
                project_id : project_id,
                user_name : this.user.get("name")
            });
            new_presentation.save();
            this.current_presentation = new_presentation;
            this.presentations.add(this.current_presentation);
            this.render();
            $(document).foundation();
            $("#categories_grid").gridalicious({
                gutter: 20,
                width: 260,
            });
            this.presentations.each(function(presentation){
            var contents = $.parseHTML(presentation.get("data"));
            if(contents){
                for (var i = 0; i < 10; i++) {
                    $("#content"+presentation.get("id")).append(contents[i]);
                };
                $("#content"+presentation.get("id")).css({"text-align":"left","overflow":"hidden"});
            }
        });
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
// Main view
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
        this.user = json.user;
        this.presentationId = json.presentationId;
        this.eventAggregator.on("renderImg", this.addImg, this);
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

    //Return to list of reports
    returnAction : function(e){
        this.mode = 0;
        CKEDITOR.remove(CKEDITOR.instances.ckeditor);
        this.render();
        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260
        });
        this.presentations.each(function(presentation){
            var contents = $.parseHTML(presentation.get("data"));
            if(contents){
                for (var i = 0; i < 10; i++) {
                    $("#content"+presentation.get("id")).append(contents[i]);
                };
                $("#content"+presentation.get("id")).css({"text-align":"left","overflow":"hidden"});
            }
        });
        //console.log(isopen);
        if(isopen==true){
            var menu = document.getElementById('cbp-spmenu-s1');
            var button = document.getElementById('showMenu');
            classie.toggle( button, 'active' );
            classie.toggle( menu, 'cbp-spmenu-open' );
            $("#showMenu").animate({right:"0px"});
            $("#cbp-openimage")[0].src="/img/icones/Arrow-Left.png";
            isopen=false;
        }
        $('#showMenu').hide('slow');
    },

    // Export a Pdf
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
        //Have more than 1 image
        if(arr.length > 1 ){
            asyncLoop({
                length : arr.length,
                functionToLoop : function(loop, i){
                    var ind = arr[i].indexOf('" ');
                    var src = arr[i].substring(0,ind);
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
        //Have no image
            $.post(
                '/file/export2pdf',
                {data : data}, 
                function (url) {
                    $.download("/file/get", {path : url});    
                }
            );
        }
    },

    //Convert to Base64 
    convertImgToBase64 : function(url, callback, outputFormat){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image;
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
        //console.log(url.replace(/&amp;/g,'&'));
        img.src = url.replace(/&amp;/g,'&');
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
        //CKPreviewer.views.middle_part_view.current_presentation=this.current_presentation;
        this.returnAction();
    },

    // Add concepts or knowledges
    addCK : function(conceptTitle,conceptContent){
        var title = conceptTitle;
        var content = conceptContent;
        //console.log(content.replace(/<p>/g,'<p style="text-indent: 2em">'));
        CKEDITOR.instances.ckeditor.insertHtml('<br><h2 style="color:red"><strong>'+title+':'+'</strong></h2>'+content.replace(/<p>/g,'<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'));
    },
    // Add categories
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
    // Add image
    addImg : function(src,size){
        var wid=$("#textzoon")[0].offsetWidth;
        CKEDITOR.instances.ckeditor.insertHtml('<br><img origin="*" src="/s3/getUrl?amz_id='+src+'" style="width:'+wid*0.7+'px" >');
        //console.log('/s3/getUrl?amz_id='+src);
        // switch(size){
        //     case 0:
        //         CKEDITOR.instances.ckeditor.insertHtml('<br><img origin="*" src="/s3/getUrl?amz_id='+src+'" style="width:'+wid*0.4+'px" >');
        //         break;
        //     case 1:
        //         CKEDITOR.instances.ckeditor.insertHtml('<br><img origin="*" src="/s3/getUrl?amz_id='+src+'" style="width:'+wid*0.7+'px" >');
        //         break;
        //     case 2:
        //         CKEDITOR.instances.ckeditor.insertHtml('<br><img origin="*" src="/s3/getUrl?amz_id='+src+'" style="width:'+wid*0.95+'px" >');
        //         break;
        // }
    },

    render : function(){
        $(this.el).empty();    

        // mode=0 Render the list of reports
        if(this.mode==0){
            if(CKPreviewer.views.actions_view){CKPreviewer.views.actions_view.remove();}
            CKPreviewer.views.actions_view = new CKPreviewer.Views.Actions({
                tagName : "div",
                className : "row panel",
                eventAggregator  : this.eventAggregator,
                project : this.project,
                presentations : this.presentations,
                current_presentation : this.current_presentation,
                user : this.user,
            });
        $(this.el).append(CKPreviewer.views.actions_view.render().el);
        }else {   
        // mode=1 Render text editor
            $(this.el).append(this.template({
                cp : this.current_presentation.toJSON(),
            }));
        }
        return this;
    }
});
/////////////////////////////////////////
// Panel of C,K,P,I
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
        //this.template_image = _.template($("#CKPreviewer_image_template").html()); 
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
        // "click .smallimage" : "smallimage",
        // "click .mediumimage" : "mediumimage",
        // "click .largeimage" : "largeimage",
        "click #image" : "sendImage",
        "click .downloadimage" : "downloadimage",
        "click .editimage" : "editImg"
    },

    downloadimage : function(e){
        e.preventDefault();
        var imagesrc = e.target.getAttribute("data-image-id");
        var imagedate = e.target.getAttribute("data-image-date");

        var aLink = document.createElement('a');
        aLink.href = '/s3/getUrl?amz_id='+imagesrc;
        aLink.setAttribute('download', imagedate);
        //aLink.dispatchEvent(evt);
        document.body.appendChild(aLink);
        //console.log(aLink.download);
        aLink.click();
        document.body.removeChild(aLink);
    },
    // Add image to text editor
    sendImage : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            var src = e.target.getAttribute("data-image-id");
            this.eventAggregator.trigger("renderImg",src);
        }
    },
    delImg : function(e){
        e.preventDefault();
        var image_id = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.screenshots.get(screenshot_id).destroy();
        $.post(
            's3/deleteFile',
            {fileName : image_id}, 
            function (data) {
                //console.log(data);
            }
        );
        CKPreviewer.views.images_view.render();
        $(document).foundation();
    },
    // Open image editor
    editImg : function(e){
        e.preventDefault();
        var image_id = e.target.getAttribute("data-image-id");
        var screenshot_id = e.target.getAttribute("data-screenshot-id");
        this.eventAggregator.trigger("openModal",image_id,screenshot_id);
    },
    // smallimage : function(e){
    //     e.preventDefault();
    //     if(CKEDITOR.instances.ckeditor){
    //         src = e.target.getAttribute("data-image-id");
    //         //console.log(src);
    //         this.eventAggregator.trigger("renderImg",src,0);
    //     }
    // },
    // mediumimage : function(e){
    //     e.preventDefault();
    //     if(CKEDITOR.instances.ckeditor){
    //         src = e.target.getAttribute("data-image-id");
    //         this.eventAggregator.trigger("renderImg",src,1);
    //     }
    // },
    // largeimage : function(e){
    //     e.preventDefault();
    //     if(CKEDITOR.instances.ckeditor){
    //         src = e.target.getAttribute("data-image-id");
    //         this.eventAggregator.trigger("renderImg",src,2);
    //     }
    // },

    // Filter bar
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

    //Add content
    addAllknowledges : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            _this = this;
            _.each(this.knowledges.toJSON(), function(knowledge) {
                var title = knowledge.title;
                var content = knowledge.content;
                _this.eventAggregator.trigger("addCK",title,content);
            });
        }
    },
    addAllconcepts : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            _this = this;
            _.each(this.concepts.toJSON(), function(concept) {
                var title = concept.title;
                var content = concept.content;
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
    addConcept : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            var title = e.target.getAttribute("data-concepte-title");
            var content = e.target.getAttribute("data-concepte-content");
            this.eventAggregator.trigger("addCK",title,content);
        }
    },
    addKnowledge : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            var title = e.target.getAttribute("data-knowledge-title");
            var content = e.target.getAttribute("data-knowledge-content");
            this.eventAggregator.trigger("addCK",title,content);
        }
    },
    addPoche : function(e){
        e.preventDefault();
        if(CKEDITOR.instances.ckeditor){
            var poche = this.poches.get(e.target.getAttribute("data-poche-id"));
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
        _this = this;
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
        

        // var screenshots_reverse = new global.Collections.Screenshots();
        // for (var i = this.screenshots.length - 1; i >= 0; i--) {
        //     screenshots_reverse.add(this.screenshots.at(i));
        // };
        // screenshots_reverse.each(function(image,n){
        //     //console.log(image)
        //     $.get('/s3/getUrl?amz_id='+image.get("src"), function(url){
        //         image.url = url;
        //         //console.log(url)
        //         $("#imageList").append(_this.template_image({
        //             image : image,
        //             n : n
        //         }));
        //         //console.log(image.url);
        //         delete image.url;
        //     })
        // })
        return this;
    }
});
/////////////////////////////////////////
// Views of templates of C,K,P
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
        this.presentationId = json.presentationId;
        this.current_presentation = null;
        // Flag to see whether PushMenu is open
        isopen = false;

        this.push_el = $(this.el).find('#pushpart');
        this.main_el = $(this.el).find('#mainpart');

        //console.log(this.user.get("name"));
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
        "click #showMenu" : "showMenu"
    },

    //Push menu
    showMenu : function(e){
        e.preventDefault();
        var menu = document.getElementById( 'cbp-spmenu-s1' );
        var button = document.getElementById( 'showMenu' );
        classie.toggle( button, 'active' );
        classie.toggle( menu, 'cbp-spmenu-open' );
        if(isopen==false){
            $("#showMenu").animate({right:"20%"});
            $("#cbp-openimage")[0].src="/img/icones/Arrow-Right.png";
            isopen=true;
        }else{
            $("#showMenu").animate({right:"0px"});
            $("#cbp-openimage")[0].src="/img/icones/Arrow-Left.png";
            isopen=false;
        }
    },
    render : function(){
        //$(this.el).empty();

        //Push part
        if(CKPreviewer.views.images_view){CKPreviewer.views.images_view.close();}
        CKPreviewer.views.images_view = new CKPreviewer.Views.Images({
            //className        : "large-4 medium-4 small-4 columns",
            eventAggregator  : this.eventAggregator,
            screenshots : this.screenshots,
            knowledges : this.knowledges,
            concepts : this.concepts,
            poches : this.poches
        });
        $(this.push_el).append(CKPreviewer.views.images_view.render().el);

        // Right part
        if(CKPreviewer.views.middle_part_view){CKPreviewer.views.middle_part_view.close();}
        CKPreviewer.views.middle_part_view = new CKPreviewer.Views.MiddlePart({
            //className        : "large-8 medium-8 small-8 columns",
            eventAggregator  : this.eventAggregator,
            project : this.project,
            current_presentation : this.current_presentation,
            knowledges : this.knowledges,
            presentations : this.presentations,
            user : this.user,
            presentationId : this.presentationId,
        });
        $(this.main_el).append(CKPreviewer.views.middle_part_view.render().el);

        $("#categories_grid").gridalicious({
            gutter: 20,
            width: 260,
            //height: 300
        });
        // Add some content to the element in the list
        this.presentations.each(function(presentation){
            var contents = $.parseHTML(presentation.get("data"));
            if(contents){
                for (var i = 0; i < 10; i++) {
                    $("#content"+presentation.get("id")).append(contents[i]);
                };
            }
            $("#content"+presentation.get("id")).css({"text-align":"left","overflow":"hidden"});
        });
        
        $(document).foundation();

        $('#CKPreviewer_container').height($(window).height()-50);

        //Enter the text editor
        if(this.presentationId != "none")
        this.eventAggregator.trigger("rendercurrent",this.presentationId);
    }
});
/***************************************/









