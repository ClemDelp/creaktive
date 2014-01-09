/**
 * GroupController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

 function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

  /*
  * Retrieve all the groups, populated
  */
  find : function(req,res){
    Group.find().done(function (err,groups){   
      UserGroup.find().done(function (err, usergroups){
        User.find().done(function (err, users){
          _.each(groups, function(group){
              ugs = _.where(usergroups, {group_id : group.id});
              us = []
              _.each(ugs, function (ug){
                us.push(_.findWhere(users, {id:ug.user_id}))
              })
              group.users = us
          })
          res.send(groups);
        })
      })
    })

      


  },
  
  update : function(req,res){
  	Group.findOne(req.body.id).done(function(err, group){
  		if(err) res.send(err);
  		if(group){
  			Group.update({id: req.body.id}, req.body).done(function(err,c){
  				if(err) res.send(err)
  				res.send(c);
  			});
  		}else{
  			Group.create(req.body).done(function(err,g){
  				if(err) res.send(err)
  				res.send(g);
  			})
  		}
  	})
  },

  /*
  * Add a User to a group
  * @param user_id
  * @param group_id
  */
  addUserToGroup : function(req,res){
    UserGroup.create({
      id : guid(),
      user_id : req.body.user_id,
      group_id : req.body.group_id
    }).done(function (err, ug){
      if(err) res.send(err);
      res.send({msg : "User added to group"})
    })
  },


  /*
  * Remove a User from a group
  * @param user_id
  * @param group_id
  */
  removeUserFromGroup : function(req,res){
    UserGroup.find({
      user_id : req.body.user_id,
      group_id : req.body.group_id
    }).done(function (err, usergroups){
      _.each(usergroups, function(ug){
        ug.destroy(function (err){
          if(err) console.log(err);
        });
        res.send({msg:"User removed from group"});
      })
    })
  }



};
