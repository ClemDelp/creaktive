
module.exports = {
  // Creation du Backup
  createNode : function(id_father,currentProject,author,node_name, node_description,cb){
    console.log("BackupService.createNode")
    //On créé un nouveau projet avec comme father_id le projet initial
    var new_Project = currentProject;
    new_Project.id = IdService.guid();
    new_Project.author = author;
    new_Project.date =  IdService.getDate();
    new_Project.date2 = new Date().getTime();
    new_Project.id_father =  id_father;
    new_Project.backup =  true;
    new_Project.title =  new_Project.title +" - "+node_name;
    new_Project.node_name =  new_Project.title;
    new_Project.node_description = node_description;
    new_Project.content = node_description;

    BackupService.copyData(new_Project, id_father, function(err, project){
      if(err) return cb(err);
        cb(null, project);
    });
  },
  // Creer un backup en projet normal
  createProjectFromNode : function(id_father, title, content, cb){
    console.log("BackupService.createProjectFromNode")
    Project.findOne(id_father).done(function(err, father){
      if(err) return cb(err);
      new_project = _.clone(father);
      new_project.id = IdService.guid();
      new_project.project = new_project.id;
      new_project.backup = false;
      new_project.node_title = "";
      new_project.node_description = "";
      new_project.title = title;
      new_project.content = content;

      BackupService.copyData(new_project, id_father, function(err, project){
          if(err) return cb(err);
          cb(null, project);
      });
    });
  },
  /*copie tous les concepts, connaissances, catégories, liens, permissions et présentations
  * @new_project : nouveau projet à créer
  * @id_father : id du projet source 
  * cb(err,project) : renvoi le nouveau projet créé ou une erreur
  */
  copyData : function(new_Project,id_father, cb){
    console.log("BackupService.copyData")
    Project.create(new_Project).done(function(err,project){
      if(err) return cb(err);
      var all_links = [];
      var all_elements = [];
      // On créé en parallèle tous les nouveaux objets
      async.parallel([
        ////////////////////////////
        // CLONE LINKS
        ////////////////////////////  
        function(callback){ 
          Link.find({
            project : id_father
          }).done(function(err, links){
            if(err) return cb(err);       
            _.each(links, function(link){
              var new_link = _.clone(link);
              new_link.id = IdService.guid();
              new_link.project = project.id;
              all_links.push(new_link);
            });
            callback();
          });
        },
        ////////////////////////////
        // CLONE ELEMENTS
        ////////////////////////////
        function(callback){
          // Créé tous les concepts dans un tableau [{newc_oncept,old_concept}]
          // les id_father seront traités plus bas
          Element.find({project:id_father}).done(function(err, elements){
            if(err) return cb(err);
            _.each(elements, function(element){
              var new_element = _.clone(element);
              new_element.id = IdService.guid();
              new_element.project = project.id;
              all_elements.push({new : new_element, old : element});
            });
            callback();
          }); 
        },  
      ],
      function(err){
        try{  
          ////////////////////////////
          // UPDATE CLONED ELEMENTS
          ////////////////////////////
          _.each(all_elements, function(element){
            if(element.old.id_father == "none") element.new.id_father = "none";
            else {
              var data = _.find(all_elements, function(c){
                if(c.old.id == element.old.id_father) return c;
              });
              element.new.id_father = data.new.id;
            }
          });
          ////////////////////////////
          // UPDATE CLONED LINKS
          ////////////////////////////
          _.each(all_links, function(link){
            // On remplace toutes les sources
            var new_object_source = _.find(all_elements, function(obj){
              if(obj.old.id == link.source) return obj;
            });
            link.source = new_object_source.new.id;
            // On remplace toutes les target
            var new_object_target = _.find(all_elements, function(obj){
              if(obj.old.id == link.target) return obj;
            });
            link.target = new_object_target.new.id;
          });
        }catch(e){
          console.log("error in update cloned link or elements: ",e)
          return cb(e);
        }
        ////////////////////////////
        // SAVE ELEMENTS
        ////////////////////////////
        Element.create(_.pluck(all_elements, "new")).done(function(err,c){
            if(err) return cb(err);
        }); 
        ////////////////////////////
        // SAVE LINKS
        ////////////////////////////
        console.log("links: ",all_links.length)
        console.log("elements: ",all_elements.length)
        Link.create(all_links).done(function(err, links){
          if(err) return cb(err);
        });
      });
      ////////////////////////////
      // GENERATE PERMISSIONS
      ////////////////////////////
      Permission.find({
        project_id : id_father
      }).done(function(err, permissions){
        _.each(permissions, function(permission){
          Permission.create({
            id : IdService.guid(),
            user_id : permission.user_id,
            project_id : project.id,
            right : permission.right
          }).done(function(err, p){
            if(err) return cb(err);
            cb(null,project)
          });
        });
      });
      ////////////////////////////
    }); 
  }
}