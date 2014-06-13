function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}


module.exports.backup = {
    cron : function(req,res){
        if(_.contains(req.session.allowedProjects, req.query.projectId)){
            Project.findOne(req.query.projectId).done(function(err, project){
                req.session.currentProject = project;
                Backup.find({project_id:project.id}).done(function(err,backups){
                    Knowledge.find({project:project.id}).done(function(err,knowledges){
                        Poche.find({project:project.id}).done(function(err,poches){
                            Concept.find({project:project.id}).done(function(err,concepts){
                                Link.find({project:project.id}).done(function(err,links){
                                    Notification.find({project_id : project.id}).done(function(err,notifications){
                                        /////////////////////////////////////
                                        // Get the last backup date ref
                                        if(backups.length != 0){
                                            var last_backup = 0;
                                            backups.forEach(function(b){
                                                if(b.date2 > last_backup) last_backup = b.date2;
                                            });
                                            // Get the last notification date ref
                                            var last_notif = 0;
                                            notifications.forEach(function(notif){
                                                if(notif.comparator > last_notif) last_notif = notif.comparator;
                                            });
                                            // Get the actual timestamp
                                            var actual_timestamp = new Date().getTime();
                                            // recuperer la difference en seconde 
                                            var diff = (actual_timestamp - last_backup)/1000;
                                            // comparrer à une journée en seconde
                                            var compare = diff/86400
                                            // Si la comparaison est > 1 on a plus d'une journée et que la derniere notif est > au dernier backup...
                                            if((compare >= 1)&&(last_notif>last_backup)){
                                                Backup.create({
                                                    id : guid(),
                                                    knowledges_collection : knowledges,
                                                    concepts_collection : concepts,
                                                    categories_collection : poches,
                                                    cklinks_collection : links,
                                                    date: getDate(),
                                                    date2:new Date().getTime(),
                                                    project_id : project.id
                                                }).done(function(err,b){
                                                    if(err) res.send(err);
                                                    console.log("new backup created!");
                                                });
                                            }
                                        }else{
                                            Backup.create({
                                                id : guid(),
                                                knowledges_collection : knowledges,
                                                concepts_collection : concepts,
                                                categories_collection : poches,
                                                cklinks_collection : links,
                                                date: getDate(),
                                                date2:new Date().getTime(),
                                                project_id : project.id
                                            }).done(function(err,b){
                                                if(err) res.send(err);
                                                console.log("first backup created!");
                                            });
                                        }
                                        /////////////////////////////////////
                                    });
                                });
                            });
                        });
                    });
                });
            });
            
        }
    }

}