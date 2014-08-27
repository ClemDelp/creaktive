/**
 * ConceptmapController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 module.exports = {


  find : function (req,res){
    
    if(req.session.currentProject){
    Concept.find({
      project : req.session.currentProject.id
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }else{
        Concept.find({
    }).done(function(err,concepts){
      if(err) res.send(err);
      this.concepts = concepts;
      c0 = _.findWhere(concepts, {position : 0});
     
        res.send(concepts)
    });
  }

  },

  update : function(req, res){

    Concept.findOne(req.body.params.id).done(function(err, concept){
      if(err) res.send(err);
      if(concept){
        Concept.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(req.session.currentProject.id).emit("concept:update", c[0]);
          Notification.objectUpdated(req,res,"Concept", c[0], concept, function(notification){
            res.send(notification);
          });

          res.send(c[0]);

      });

      }else{
        var concept = req.body.params;
        ///////////////////////////
        concept.type = "concept";
        if((concept.top)&&(concept.top == 0))concept.top = 550;
        if((concept.left)&&(concept.left == 0))concept.left = 550;
        ///////////////////////////
        concept.project = req.session.currentProject.id;
        Concept.create(concept).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(req.session.currentProject.id).emit("concept:create", c);
          Notification.objectCreated(req,res,"Concept", c, function(notification){
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
      if(concept.position == 0) res.send({err : "You can't remove c0"})
      else{
        req.socket.broadcast.to(req.session.currentProject.id).emit("concept:remove2", concept);
        Notification.objectRemoved(req,res,"Concept", concept, function(notification){
          res.send(notification);
        });
        concept.destroy(function(err){
          if(err) res.send(err)
            res.send({msg:"destroyed"})
        });
      };
    });
  },

  /*
* Generates the json file for the concepts map
*/
generateTree : function(req,res){
  this.concepts = [];
  this.tree = "";



    /*
    * Format the idea json to mapjs format
    */
    createIdea = function(concept){
      idea = concept;
      idea.text = concept.title
      if (concept.color != "") idea.color = concept.color
        idea.shape = "box";
      idea.children=[];
      return idea;
    }

    /*
    * Add a child to a node
    */
    createChildren = function (father, child){

      father.children.push(child);
    };

    /*
    * Look into concepts and build the json
    * @father : a node
    * @children : all children nodes
    */ 
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


    Concept.find({
        project : req.session.currentProject.id
      }).done(function(err,concepts){
        if(err) res.send(err);
        this.concepts = concepts;
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

        res.send({tree : json});
      });
  },


  
  
  conceptview : function(req,res){
    BootstrapService.bootstrapdata(req,res);
  }


};
