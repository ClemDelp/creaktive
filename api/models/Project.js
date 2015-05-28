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
    //console.log(project_id)
    
    Permission.find({
      project_id : project_id
    }).done(function(err, perms){
      _.each(perms, function(p){
        p.destroy(function(err){
          if(err) cb(err)
        })
      })
    })

    Notification.find({
      project_id : project_id
    }).done(function(err, notifications){
      _.each(notifications, function(n){
        n.destroy(function(err){
          if(err) cb(err)
        })
      })
    });

    Element.find({
      project : project_id,
      type : "concept"
    }).done(function(err, elements){
      _.each(elements, function(element){
        Link.find({element : element.id}).done(function(err,links){
          if(err) //console.log(err)
            _.each(links, function(l){
              l.destroy(function(err){
                if(err) cb(err)
              })
            })
        })
        element.destroy(function(err){
          if(err) cb(err)
        })
      })

    });
    var img = values.where.id + ".png";
    S3Service.deleteFile(img, function(err, data){
      if(err) cb(err)
    })

    cb();
  },


};
