function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}

global.Functions.dict_modelIdToNotifsNumber = function(models_Collection,notifs_Collection){
	dictionary = {};
	models_Collection.each(function(model){
		dictionary[model.get('id')] = 0;
	});
	notifs_Collection.each(function(notif){
        dictionary[notif.get('to').id] = dictionary[notif.get('to').id] + 1;
    });
    return dictionary;
}

