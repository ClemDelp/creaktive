var notif = {
	init : function(){
		console.log("notification_api available...")
	},
	dict_modelIdToNotifsNumber : function(models_Collection,notifs_Collection){
		dictionary = {};
		models_Collection.each(function(model){
			dictionary[model.get('id')] = 0;
		});
		notifs_Collection.each(function(notif){
            dictionary[notif.get('to').id] = dictionary[notif.get('to').id] + 1;
        });
        return dictionary;
	}
}

notif.init();