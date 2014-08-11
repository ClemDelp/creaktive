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


module.exports = {
  
find : function (req,res){
    if(req.body.params.projectId){
      Backup.find({
       project_id : req.session.currentProject.id
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
      res.send(b[0]);   


    });
    ///////////////////////
    // Create
    }else{
      var backup = req.body.params;
      backup.project = req.session.currentProject.id
      Backup.create(backup).done(function(err,b){
        if(err) res.send(err);
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

/////////////////////////////////////////
getData : function(req,res){
  backup_id = req.param('backup_id');
  this.concepts = [];
  this.tree = "";
  
  createIdea = function(concept){
    idea = concept;
    idea.text = concept.title
    if (concept.color != "") idea.color = concept.color
      idea.shape = "box";
    idea.children=[];
    return idea;
  }
  
  createChildren = function (father, child){
    father.children.push(child);
  };

  populate = function(father, children){
    children = _.sortBy(children, "siblingNumber").reverse();
    for (var i = children.length - 1; i >= 0; i--) {

      createChildren(father, children[i])
      
      var c = _.where(this.concepts, {id_father : children[i].id})
      if(c.length > 0){
        
        this.populate(children[i], c)
      }
    };

  };
  
  Backup.find({_id: backup_id }).done(function(err, backup){
    //console.log('backuuuuuuuuuuup',backup)
    if(err) res.send(err);
    concepts = backup[0].concepts_collection;
    //console.log("concepts_collectionnnnnn: ",backup[0]['concepts_collection'])
    //transform all concept in map idea
    _.each(concepts, function(concept){
      createIdea(concept);
    })

    var json = {root : {}};

    c0 = _.findWhere(concepts, {position : 0});
    c0.text = c0.title;
    c0.layout = "graph-bottom";
    children = _.where(concepts, {id_father : c0.id});

    populate(c0, children)
    
    json.root = c0
    json.id ="dhflkjhfsdkljhfdslk"


    res.send({
      "conceptsTree" : json, 
      "knowledges" : backup[0].knowledges_collection, 
      "cklinks" : backup[0].cklinks_collection, 
      "categories" : backup[0].categories_collection
    });
  });
},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BackupController)
   */
  _config: {}

  
};
