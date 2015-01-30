/**
 * PlanController
 *
 * @description :: Server-side logic for managing plans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

 find : function (req,res){
    console.log("Fetch plans");
    if(req.body.params.project){
    Element.find({
      project : req.body.params.project
    }).done(function(err,plans){
      if(err) return res.send({err:err});
      this.plans = plans;
      c0 = _.findWhere(plans, {position : 0});
     
        res.send(plans)
    });
  }else{
        Element.find({
    }).done(function(err,plans){
      if(err) return res.send({err:err});
      this.plans = plans;
      c0 = _.findWhere(plans, {position : 0});
     
        res.send(plans)
    });
  }

  },

  update : function(req, res){
    console.log("Updating plan",req.body.notification)
    Element.findOne(req.body.params.id).done(function(err, plan){
      if(err) return res.send({err:err});
      if(plan){
        Element.update({
          id: req.body.params.id
        }, req.body.params).done(function(err,c){
          if(err) res.send(err);
          req.socket.broadcast.to(c.project).emit("plan:update", c[0]);
          if(req.body.notification) Notification.objectUpdated(req,res,"Element", c[0], plan);

          // res.send(c[0]);

      });

      }else{
        var plan = req.body.params;
        ///////////////////////////
        if((plan.top)&&(plan.top == 0))plan.top = 550;
        if((plan.left)&&(plan.left == 0))plan.left = 550;
        ///////////////////////////
        Element.create(plan).done(function(err,c){
          if(err) return res.send({err:err});
          req.socket.broadcast.to(c.project).emit("plan:create", c);
          Notification.objectCreated(req,res,"Element", c);
          // res.send(c);
        });

      }
    })
  },

  destroy : function(req,res){
    console.log('Deleting plan');

      Element.destroy(req.body.params.id).done(function(err, plans){
        if(err) return res.send({err :err});
        req.socket.broadcast.to(plans[0].project).emit("plan:remove2", plans[0]);
        Notification.objectRemoved(req,res,"Element", plans[0]);
      });     
  },
	
};

