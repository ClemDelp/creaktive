/**
 * ConceptController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */


 module.exports = {

 generateTree : function(req,res){
    this.concepts = [];
    this.tree = "";
    this.rank = 0;
    this.compteur = 0;

    this.position = 1;


    generateRank = function(rank){
      if(rank ===0){
        this.rank = 1;
        return this.rank;
      }
      this.rank++;
      this.compteur++;
      if(this.compteur%2 ===1) return -this.rank;
      return this.rank;
    };

    createIdea = function(concept){
      idea = concept;
      idea.attr = {
        style : {
          background : concept.color
        },
      };
      idea.ideas={};
      return idea;
    }

    createChildren = function (father, child){
        var rank = generateRank(this.rank);
        console.log(rank)
        father.ideas[rank] = child;

    };

    populate = function(father, children){
      for (var i = children.length - 1; i >= 0; i--) {
        
        createChildren(father, children[i])
        
        var c = _.where(this.concepts, {id_father : children[i].id})
        
        if(c.length > 0){
            //this.rank=0;
            this.populate(children[i], c)
        }
      };

    };


    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      //transform all concept in map idea
      _.each(concepts, function(concept){
        createIdea(concept);
      })
      c0 = _.findWhere(concepts, {position : 0});
      children = _.where(concepts, {id_father : c0.id});
      
      populate(c0, children)
      


      res.send({tree : c0});
    });
  },


  find : function (req,res){
    
    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });

  },

  create : function (req,res){
    var c = req.body.params;
    c.project = req.session.currentProject.id;

    Concept.create(c).done(function(err, concept){
      if(err) res.send(err);
      Notification.objectCreated(req,res,"Concept", c.id, function(notification){
          res.send(notification);
      });
      res.send(concept);
    });
  },

  update : function(req, res){

    Concept.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        Concept.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          
          

          Notification.objectUpdated(req,res,"Concept", c[0].id, function(notification){
            res.send(notification);
          });

          res.send(c[0]);
      });
      }else{
        var concept = req.body.params;
        concept.project = req.session.currentProject.id;
        Concept.create(concept).done(function(err,c){
          if(err) res.send(err);

          Notification.objectCreated(req,res,"Concept", c.id, function(notification){
            res.send(notification);
          });
          res.send(c);
        });
      }
    })
  },


  destroy : function(req,res){
    Concept.findOne(req.body.params.id).done(function(err,concept){
      if(err) console.log(err);
      concept.destroy(function(err){
        if(err) console.log(err)
          res.send({msg:"destroyed"})
      })
    });
  },

  conceptview : function(req,res){
    req.session.user = req.session.user || {id:"999999999", name : "guest", img:"img/default-user-icon-profile.png"}
    Project.findOne(req.query.projectId).done(function(err, project){
      req.session.currentProject = project;
      res.view({
        currentUser : JSON.stringify(req.session.user),
        projectTitle : req.session.currentProject.title,
        projectId : req.session.currentProject.id,
        currentProject : JSON.stringify(req.session.currentProject)
      });
    })
    
  },


};
