/**
 * Project
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */
module.exports = {
autoPK : false,
  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  },

  beforeDestroy : function (values, cb){
    project_id = values.where.id

    Presentation.find({
      project_id : project_id
    }).done(function(err, pres){
      _.each(pres, function(p){
        p.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

    Screenshot.find({
      project_id : project_id
    }).done(function(err, scrs){
      _.each(scrs, function(s){
        s.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })
    
    Permission.find({
      project_id : project_id
    }).done(function(err, perms){
      _.each(perms, function(p){
        p.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

    Notification.find({
      project_id : project_id
    }).done(function(err, notifications){
      _.each(notifications, function(n){
        n.destroy(function(err){
          if(err) console.log(err)
        })
      })
    })

    Concept.find({
      project : project_id
    }).done(function(err, concepts){
      _.each(concepts, function(concept){
        Link.find({concept : concept.id}).done(function(err,links){
          if(err) console.log(err)
            _.each(links, function(l){
              l.destroy(function(err){
                if(err) console.log(err)
              })
            })
        })
        concept.destroy(function(err){
          if(err) console.log(err)
        })
      })

    })

    cb();
  },

  beforeCreate : function (values, cb){

    Concept.create({
  		id : IdService.guid(),
  		title : "c0",
      content :"",
  		date : IdService.getDate(),
  		position : 0,
  		project : values.id,
      comments : [],
      members:[],
      attachment:[],
      type : "concept",
      id_father: "none",
      top : 550,
      left: 550


  	}).done(function(err, c0){
  		if(err) console.log(err);
      console.log(values.id);
      console.log(values.title);
      Presentation.create({
        id : IdService.guid(),
        title : values.title,
        data : "",
        project_id : values.id,
      }).done(function(err){
        if(err) console.log(err);
        cb();
      });
  	});
  }

};
