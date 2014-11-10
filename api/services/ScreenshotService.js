    var Pageres = require('pageres');
module.exports = {

	uploadScreenshot : function(file,project_id,cb){
		S3Service.pushFile(file, function(err, filename){
            if(err) return cb(err);
            // Ajout de l'image au projet
            Project.update({id : project_id}, {image : filename}, function(err, projects){
              if(err) return  cb(err);
            })
            Screenshot.findOrCreate({
              src:filename
            },{
              id : IdService.guid(),
              src : filename,
              project_id : project_id,
              date : IdService.getDate()
            }).done(function(err,srcs){
              if(err) console.log(err)
            })
            cb();
      	});
	},

	/**
	* req : request
	* res : response
	* mode : upload || download
	* cb : null || function
	* Si le mode est à upload, les fichiers sont uploadé sur amazon S3
	* Si le mode est à download, on renvoit le fichier pour qu'il soit envoyé au client
	*/
	screenshot : function(req,res,mode,cb){
	    var url = "";
	    var domain =  "";
	    /////////////////////////
	    var params = "";
	    if(req.query.zoom) params += "#visu/"+req.query.zoom;
	    if(req.query.left) params += "/"+req.query.left;
	    if(req.query.top) params += "/"+req.query.top;
	    /////////////////////////
	    if(req.get('host') == "localhost:1337"){
	      url = req.baseUrl + "/bbmap?projectId="+req.session.currentProject.id+params;
	      domain = "localhost"
	    }else{
	       url = "http://"+req.get("host")+ "/bbmap?projectId="+req.session.currentProject.id+params;
	       domain = req.get("host")
	    }
	    var cookie = "sails.sid="+req.signedCookies["sails.sid"]+";domain="+domain+";path=/";
	 
	    var pageres = new Pageres({
	        delay: 10, 
	        cookies : [cookie],
	        filename : req.session.currentProject.id
	      })
	      .src(url, ['2560x1440'])
	      .dest(".tmp");

	    pageres.run(function (err, items) {
	        if (err) return console.log(err);
	        async.each(items, function(item, callback){
	          	var file = {};
	          	file.path = ".tmp/"+item.filename;
	          	file.name = item.filename;      		
	      		if(mode === "upload") ScreenshotService.uploadScreenshot(file, req.session.currentProject.id, callback);
	      		if(mode === "download"){ 
      				cb(null,file);
      				callback();
	      		}

	        },function(err){
	          // if any of the file processing produced an error, err would equal that error
	        if( err ) console.log('A file failed to process', err);
	        else console.log('Screenshot process ended successfully');
	        })   
	    });
	    
	    pageres.on('warn', function(err){
	      console.log(err)
	    })
	}


}