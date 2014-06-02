/////////////////////////////////////////
// Main
/////////////////////////////////////////
cron.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        // Variables
        this.backups            = json.backups;
        this.project            = json.project;
        this.notifications      = json.notifications;
        this.eventAggregator    = json.eventAggregator;
    },
    events : {},
    ///////////////////////////////////////////////////////
    render : function(){
        $(this.el).empty();
        // Get the last backup date ref
        var last_backup = 0;
        this.backups.each(function(b){
            if(b.get('date2') > last_backup) last_backup = b.get('date2');
        });
        // Get the last notification date ref
        var last_notif = 0;
        this.notifications.each(function(notif){
            if(notif.get('comparator') > last_notif) last_notif = notif.get('comparator');
        });
        // Get the actual timestamp
        var actual_timestamp = new Date().getTime();
        // recuperer la difference en seconde 
        var diff = (actual_timestamp - last_backup)/1000;
        // comparrer à une journée en seconde
        var compare = diff/86400
        // Si la comparaison est > 1 on a plus d'une journée et que la derniere notif est > au dernier backup...
        if((compare >= 1)&&(last_notif>last_backup)){
            alert("backup created!")
            new_backup = new global.Models.Backup({
                id : guid(),
                date: getDate(),
                date2:new Date().getTime(),
                project_id : this.project.get('id')
            });
            new_backup.save();
        }
        return this;
    }
});
/***************************************/
