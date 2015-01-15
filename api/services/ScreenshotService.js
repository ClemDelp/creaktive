var webshot = require('webshot');

module.exports = {



	screenshot : function(req,res, cb){
	    var url = "";
	    var domain =  "";
	    /////////////////////////
	    // var params = "";
	    // var sizeScreen = '3840x2160'; //Déf 4k
	    // var multW = 3840/parseFloat(req.query.window_w);
	    // var multH = 2160/parseFloat(req.query.window_h);
	    // var multiplier = (req.query.window_h*multW > 2160) ? multH : multW;
	    // if(req.query.zoom) params += "#visu/"+(parseFloat(req.query.zoom)*multiplier);
	    // if(req.query.left) params += "/"+(parseFloat(req.query.left)*multiplier);
	    // if(req.query.top) params += "/"+(parseFloat(req.query.top)*multiplier);
	    // if(req.query.top) params += "/1";// invisibility
	    // if(req.query.window_w) sizeScreen = (~~(parseFloat(req.query.window_w)*multiplier))+"x"+(~~(parseFloat(req.query.window_h)*multiplier));

	    var currentProjectId = req.query.currentProject;

	    var params = "";
	    if(req.query.zoom) params += "#visu/"+req.query.zoom;
	    if(req.query.left) params += "/"+req.query.left;
	    if(req.query.top) params += "/"+req.query.top;
	    if(req.query.top) params += "/1";// invisibility


	    /////////////////////////
	    if(req.get('host') == "localhost:1337"){
	      url = req.baseUrl + "/bbmap?projectId="+currentProjectId+params;
	      domain = "localhost"
	    }else{
	       url = "https://"+req.get("host")+ "/bbmap?projectId="+currentProjectId+params;
	       domain = req.get("host")
	    }
	    // var cookie = "sails.sid="+req.signedCookies["sails.sid"]+";domain="+domain+";path=/";

	    var cookie = {
	      name:     'sails.sid',
	      value:    req.signedCookies["sails.sid"],
	      domain:   domain,
	      path:     '/'
	    };

	    var file = ".tmp/"+currentProjectId+".png"

	    console.log('URL :',url)

	    var options = {
	      windowSize : {
	        width: req.query.window_w,
	        height: req.query.window_h
	      },
	      cookies : [cookie],
	      // renderDelay : 10
	      takeShotOnCallback : true
	    };


	    webshot(url,file,options, function(err) {
	      if(err) return cb(err);
	      cb(null, file)
	    });
	},

	




	// uploadScreenshot2 : function(file,project_id,cb){
	// 	S3Service.pushFile(file, function(err, filename){
 //            if(err) return cb(err);
 //            // Ajout de l'image au projet
 //            Project.update({id : project_id}, {image : filename}, function(err, projects){
 //              if(err) return  cb(err);
 //            })
 //            Screenshot.findOrCreate({
 //              src:filename
 //            },{
 //              id : IdService.guid(),
 //              src : filename,
 //              project_id : project_id,
 //              date : IdService.getDate()
 //            }).done(function(err,srcs){
 //              if(err) console.log(err)
 //            })
 //            cb();
 //      	});
	// },

	// /**
	// * req : request
	// * res : response
	// * mode : upload || download
	// * cb : null || function
	// * Si le mode est à upload, les fichiers sont uploadé sur amazon S3
	// * Si le mode est à download, on renvoit le fichier pour qu'il soit envoyé au client
	// */
	// screenshot2 : function(req,res,mode,cb){
	//     var url = "";
	//     var domain =  "";
	//     /////////////////////////
	//     var params = "";
	//     var sizeScreen = '3840x2160'; //Déf 4k
	//     var multW = 3840/parseFloat(req.query.window_w);
	//     var multH = 2160/parseFloat(req.query.window_h);
	//     var multiplier = (req.query.window_h*multW > 2160) ? multH : multW;
	//     if(req.query.zoom) params += "#visu/"+(parseFloat(req.query.zoom)*multiplier);
	//     if(req.query.left) params += "/"+(parseFloat(req.query.left)*multiplier);
	//     if(req.query.top) params += "/"+(parseFloat(req.query.top)*multiplier);
	//     if(req.query.top) params += "/1";// invisibility
	//     if(req.query.window_w) sizeScreen = (~~(parseFloat(req.query.window_w)*multiplier))+"x"+(~~(parseFloat(req.query.window_h)*multiplier));

	//     var currentProjectId = req.query.currentProject;

	//     /////////////////////////
	//     if(req.get('host') == "localhost:1337"){
	//       url = req.baseUrl + "/bbmap?projectId="+currentProjectId+params;
	//       domain = "localhost"
	//     }else{
	//        url = "http://"+req.get("host")+ "/bbmap?projectId="+currentProjectId+params;
	//        domain = req.get("host")
	//     }
	//     var cookie = "sails.sid="+req.signedCookies["sails.sid"]+";domain="+domain+";path=/";
	 

	//     console.log("URL ",url)

	//     var pageres = new Pageres({
	//         delay: 10, 
	//         cookies : [cookie],
	//         filename : currentProjectId
	//       })
	//       .src(url, [sizeScreen])
	//       .dest(".tmp");

	//     pageres.run(function (err, items) {
	//         if (err) return console.log(err);
	//         async.each(items, function(item, callback){
	//           	var file = {};
	//           	file.path = ".tmp/"+item.filename;
	//           	file.name = item.filename;      		
	//       		if(mode === "upload") ScreenshotService.uploadScreenshot(file, currentProjectId, callback);
	//       		if(mode === "download"){ 
 //      				cb(null,file);
 //      				callback();
	//       		}

	//         },function(err){
	//           // if any of the file processing produced an error, err would equal that error
	//         if( err ) console.log('A file failed to process', err);
	//         else console.log('Screenshot process ended successfully');
	//         })   
	//     });
	    
	//     pageres.on('warn', function(err){
	//       console.log(err)
	//     })
	// }


}