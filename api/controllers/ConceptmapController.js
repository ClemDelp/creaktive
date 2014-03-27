/**
 * ConceptmapController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  /**
   * /conceptmap/crMate
   */ 
   crMate: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/conceptmap/crMate.ejs
    res.view();

  },


  /**
   * /conceptmap/destroy
   */ 
   destroy: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/conceptmap/destroy.ejs
    res.view();

  },


  /**
   * /conceptmap/update
   */ 
   update: function (req,res) {

    // This will render the view: 
    // /home/clem/creaktive/views/conceptmap/update.ejs
    res.view();

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

      res.send({tree : json});
    });
  },
  
  conceptmapview : function(req,res){
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
  }


};
