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


module.exports = {

 

  removeNews : function(req,res){
    News.destroy({user: req.query.user, project:req.query.project}).exec(function deleteCB(err){
      console.log('News has been deleted');
    });
    
  },

  screenshot : function(req,res){
    console.log("Processing take screenshot");
    ScreenshotService.screenshot(req,res,function(err,filePath){
      if(err) res.send(err);

      var project_id = req.query.currentProject;

      var file = {
        name: filePath.substring(filePath.indexOf("/")+1, filePath.length),
        path: filePath
      };
      S3Service.pushFile(file, function(err, filename){
            if(err) return res.send(err);
            // Ajout de l'image au projet
            Project.update({id : project_id}, {image : filename}, function(err, projects){
              if(err) return  res.send(err);
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
            res.send("Screenshot uploaded")
        });
    });

    
  },

  downloadScreenshot : function(req,res){
    console.log("Processing downloading screenshot")
     ScreenshotService.screenshot(req,res,function(err,file){
      if(err) res.send(err);
      res.download(file);
    });
  },

  //////////////////////////////////////
  // IMPORT DATA SERVICE
  //////////////////////////////////////
  importElementsFromProject : function(req, res){
    Project.findOne(req.query.project_id).done(function(err, project){
      Element.find({project : project.id}).done(function(err, elements){
        return res.send(elements);
      });
    });
  },
  importLinksFromProject : function(req, res){
    Project.findOne(req.query.project_id).done(function(err, project){
      Link.find({project : project.id}).done(function(err, links){
        return res.send(links);
      });
    });
  },
  //////////////////////////////////////
  //////////////////////////////////////

  bbmapview : function(req,res){
    console.log("Loading bbmap view")
    BootstrapService.bootstrapdata(req,res);
  },

  _config: {}  

};
