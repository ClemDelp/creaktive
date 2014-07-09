/**
 * SlideController
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
      Slide.find({
       project : req.session.currentProject.id
     }).done(function(err,slides){
      if(err) res.send(err)
        res.send(slides)
    });
   }else{
    Slide.find({}).done(function(err,slides){
      if(err) res.send(err)
        res.send(slides)
    });
  }

},
  
  /**
   * Action blueprints:
   *    `/slide/create`
   */
  create : function (req,res){
  var s = req.body.params;
  s.project = req.session.currentProject.id
  Slide.create(s).done(function(err, slide){
    if(err) res.send(err);
    Notification.objectCreated(req,res,"Slide", slide.id, function(notification){
      res.send(notification);
    });
    res.send(slide);

  });
},


update : function(req, res){
 Slide.findOne(req.body.params.id).done(function(err, slide){
    if(err) res.send(err);
    ///////////////////////
    // Udpate
    if(slide){
     Slide.update({id: req.body.params.id}, req.body.params).done(function(err,s){
      if(err) res.send(err);
      Notification.objectUpdated(req,res,"Slide", s[0], function(notification){
        res.send(notification);
      });

      res.send(s[0]);   


    });
    ///////////////////////
    // Create
    }else{
      var slide = req.body.params;
      slide.project = req.session.currentProject.id
      Slide.create(slide).done(function(err,s){
        if(err) res.send(err);       
        ////////////////////////////////////////
        // Notification
        Notification.objectCreated(req,res,"Slide", s, function(notification){
          res.send(notification);
        });
        res.send(s);

      });
    }
  });
},

destroy : function(req,res){
  Slide.findOne(req.body.params.id).done(function(err,slide){
    if(err) console.log(err);
    slide.destroy(function(err){
      if(err) console.log(err)
        res.send({msg:"destroyed"})
    })
  });
},



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SlideController)
   */
  _config: {}

  
};
