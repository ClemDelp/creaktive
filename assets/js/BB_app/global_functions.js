function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

global.Functions.dict_modelIdToNotifsNumber = function(models_Collection,notifs_Collection){
	dictionary = {};
	models_Collection.each(function(model){
		dictionary[model.get('id')].recurrence = 0;
		dictionary[model.get('id')].collection = new global.Collections.NotificationsCollection();
	});
	notifs_Collection.each(function(notif){
        dictionary[notif.get('to').id].recurrence = dictionary[notif.get('to').id].recurrence + 1;
        dictionary[notif.get('to').id].collection.add(notif);
    });
    return dictionary;
}

global.Functions.getNotificationsDictionary = function(user_model,notifications_collection){
	var dictionary = {"projects":{},"models":{},"allNews":{},"allRead":{}};
	// Init
	dictionary.allNews = new Backbone.Collection();
	dictionary.allRead = new Backbone.Collection();
	notifications_collection.each(function(notif){
		dictionary.models[notif.get('to').id] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
		dictionary.projects[notif.get('project_id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// Build
	notifications_collection.each(function(notif){
		if((_.indexOf(notif.get('read'), user_model.get('id')) == -1)){
        	dictionary.models[notif.get('to').id].news.add(notif);
        	dictionary.projects[notif.get('project_id')].news.add(notif);
        	dictionary.allNews.add(notif);
      	}else{
      		dictionary.models[notif.get('to').id].read.add(notif);		
      		dictionary.projects[notif.get('project_id')].read.add(notif);		
      		dictionary.allRead.add(notif);
      	}
	});
    return dictionary;
}

global.Functions.getProjectsNotificationsDictionary = function(user_model,notifications_collection){
	var dictionary = {};
	// Init
	notifications_collection.each(function(notif){
		dictionary[notif.get('project_id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// Build
	notifications_collection.each(function(notif){
		if((_.indexOf(notif.get('read'), user_model.get('id')) == -1)){
        	dictionary[notif.get('project_id')].news.add(notif);
      	}else{
      		dictionary[notif.get('project_id')].read.add(notif);		
      	}
	});
    return dictionary;
}

