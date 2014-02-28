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
