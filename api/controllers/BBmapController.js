/**
 * BBmapController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
    var Pageres = require('pageres');

module.exports = {

  screenshot : function(req,res){
    console.log("Processing take screenshot")
    var url = "";
    var domain =  "";
    if(req.get('host') == "localhost:1337"){
      url = req.baseUrl + "/bbmap?projectId="+req.session.currentProject.id;
      domain = "localhost"
    }else{
       url = "http://"+req.get("host")+ "/bbmap?projectId="+req.session.currentProject.id;
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
          S3Service.pushFile(file, function(err, file){
            if(err) return callback(err);
            // Ajout de l'image au projet
            //res.sendfile(file);
            Project.update({id : req.session.currentProject.id}, {image : file}, function(err, projects){
              if(err) return  callback(err);
            })
            Screenshot.findOrCreate({
              src:item.filename
            },{
              id : IdService.guid(),
              src : item.filename,
              project_id : req.session.currentProject.id,
              date : IdService.getDate()
            }).done(function(err,srcs){
              if(err) console.log(err)
            })
            callback();
          });
        },function(err){
          // if any of the file processing produced an error, err would equal that error
        if( err ) console.log('A file failed to process', err);
        else console.log('All files have been pushed to S3 successfully');
        })   
    });
    
    pageres.on('warn', function(err){
      console.log(err)
    })

    res.send("Screenshot added");
  },
  

  bbmapview : function(req,res){
    console.log("Loading bbmap view")
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
