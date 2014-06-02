/**
 * BackupController
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

function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

module.exports = {
  
find : function (req,res){
    if(req.body.params.projectId){
      Backup.find({
       project : req.session.currentProject.id
     }).done(function(err,backups){
      if(err) res.send(err)
        res.send(backups)
    });
   }else{
    Backup.find({}).done(function(err,backups){
      if(err) res.send(err)
        res.send(backups)
    });
  }

},

create : function (req,res){
  var b = req.body.params;
  b.project = req.session.currentProject.id
  Backup.create(b).done(function(err, backup){
    if(err) res.send(err);
    Notification.objectCreated(req,res,"Backup", backup.id, function(notification){
      res.send(notification);
    });
    res.send(backup);

  });
},


update : function(req, res){
 Backup.findOne(req.body.params.id).done(function(err, backup){
    if(err) res.send(err);
    ///////////////////////
    // Udpate
    if(backup){
     Backup.update({id: req.body.params.id}, req.body.params).done(function(err,b){
      if(err) res.send(err);
      Notification.objectUpdated(req,res,"Backup", b[0], function(notification){
        res.send(notification);
      });

      res.send(b[0]);   


    });
    ///////////////////////
    // Create
    }else{
      var backup = req.body.params;
      backup.project = req.session.currentProject.id
      Backup.create(backup).done(function(err,b){
        if(err) res.send(err);
        // ////////////////////////////////////////
        // // get all the data to create the backup
        // var concepts = [];
        // var knowledges = [];
        // var cklinks = [];
        // var categories = [];
        // // Concept
        // Concept.find({
        //   project : req.session.currentProject.id
        // }).done(function(err,cs){
        //   if(err) res.send(err)
        //   concepts = cs;
        //   // Knowledges
        //   Knowledge.find({
        //     project : req.session.currentProject.id
        //   }).done(function(err,ks){
        //     if(err) res.send(err)
        //     knowledges = ks;
        //     // CKLinks
        //     Link.find({
        //       project : req.session.currentProject.id
        //     }).done(function(err,ls){
        //       if(err) res.send(err) 
        //       cklinks = ls;
        //       // Categories
        //       Poche.find({
        //         project : req.session.currentProject.id
        //       }).done(function(err,ps){
        //         if(err) res.send(err) 
        //         categories = ps;
        //         console.log("dataaaaaaa: ",concepts.length,knowledges.length,categories.length,cklinks.length)
        //       });
        //     });
        //   });
        // });
        
        
        
        
        ////////////////////////////////////////
        // Notification
        Notification.objectCreated(req,res,"Backup", b, function(notification){
          res.send(notification);
        });
        res.send(b);

      });
    }
  });
},

destroy : function(req,res){
  Backup.findOne(req.body.params.id).done(function(err,backup){
    if(err) console.log(err);
    backup.destroy(function(err){
      if(err) console.log(err)
        res.send({msg:"destroyed"})
    })
  });
},




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BackupController)
   */
  _config: {}

  
};
