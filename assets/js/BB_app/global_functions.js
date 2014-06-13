function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

global.Functions.getProjectsUsersDictionary = function(projects,permissions){
	var dictionary = {};
	/////////////////////////////
	// CREATION DES KEYS
	/////////////////////////////
	projects.each(function(project){
		dictionary[project.get('id')] = 0;
	});
	/////////////////////////////
	// CREATION DES VALUES
	/////////////////////////////
	permissions.each(function(permission){
		dictionary[permission.get('project_id')] = dictionary[permission.get('project_id')] + 1;
	});
	return dictionary;
}

global.Functions.getNotificationsDictionary = function(user_model,notifications,projects,knowledges,concepts,categories){
	var dictionary = {"projects":{},"models":{},"allNews":{},"allRead":{}};
	/////////////////////////////
	// CREATION DES KEYS
	/////////////////////////////
	//
	dictionary.allNews = new Backbone.Collection();
	dictionary.allRead = new Backbone.Collection();
	// 
	concepts.each(function(concept){
		dictionary.models[concept.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	categories.each(function(category){
		dictionary.models[category.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	knowledges.each(function(knowledge){
		dictionary.models[knowledge.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	// 
	projects.each(function(project){
		dictionary.projects[project.get('id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	//
	notifications.each(function(notif){
		dictionary.models[notif.get('to').id] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
		dictionary.projects[notif.get('project_id')] = {"news" : new Backbone.Collection(),"read" : new Backbone.Collection()};
	});
	/////////////////////////////
	// CREATION DES VALUES
	/////////////////////////////
	notifications.each(function(notif){
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

global.Functions.whatChangeInModel = function(origin_m,new_m){
	var keys = [];
	for (var k in origin_m.attributes){
		if(origin_m.attributes[k] != new_m.attributes[k]){
			keys.unshift(k);
		}
	}
	return keys;
}

global.Functions.format_ckobject_collection = function(collection){
	collection.each(function(model){
		global.Functions.format_ckobject_model(model);        
    });
    return collection;
}

global.Functions.format_ckobject_model = function(model){
	model.set({comments : new global.Collections.Comments(model.get('comments'))});
    model.set({members : new global.Collections.UsersCollection(model.get('members'))});
    return model;
}

global.Functions.cloneCollection = function(collection){
	var ks_cloned = new Backbone.Collection();
    collection.each(function(model) {
      ks_cloned.add(new Backbone.Model(model.toJSON()));
    });
    return ks_cloned;
}