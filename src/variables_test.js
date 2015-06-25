function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}
//////////////////////////////////////
var element_generator = function(json){
	this.element = [{
		"id": guid(),
		"id_father": json.id_father || "none",
		"project": json.project || "27b6ef44-7224-254b-a7a1-1770e03e5516",
		"title": json.title || "title",
		"type": json.type || "",
		"css_auto": json.css_auto || "",
		"css_manu": json.css_manu || "",
		"content": json.content || "content",
		"inside": json.inside ||  ""
	}];

	return this;
}
//////////////////////////////////////
// EXEMPLE STRUCTURE
//////////////////////////////////////
var basic_structure_to_valeur_test = function(){
	// 6C (3 connu, 1 atteign, 1 vierge, 1 hamecon) & 6K (3 inside validee + 2 outside vierge + 1 outside indesidésidable)
	this.elements = [
		{"id":"aee4b226-2071-0791-ef3b-ef6e37146477","id_father":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"K1","type":"knowledge","css_auto":"k_empty","css_manu":"k_validees","content":"","inside":"inside"},
		{"id":"bb233024-baf4-1a16-6ce3-e2b792963ed3","id_father":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"k0","type":"knowledge","css_auto":"k_empty","css_manu":"k_validees","content":"","inside":"inside"},
		{"id":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","id_father":"2028019f-352b-9aec-2808-8e0f2f75895b","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"C1","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":""},
		{"id":"2028019f-352b-9aec-2808-8e0f2f75895b","id_father":"none","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"C0","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"",},
		{"id":"71406f87-f52a-f2ba-6b5e-192bb004c0a4","id_father":"2028019f-352b-9aec-2808-8e0f2f75895b","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"c2","type":"concept","css_auto":"c_empty","css_manu":"c_atteignable","content":"",},
		{"id":"45593cc2-3a70-ccd7-de75-cca0e9f330b5","id_father":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"C1.1","type":"concept","css_auto":"c_empty","css_manu":"c_connu","content":"",},
		{"id":"36c6b0cf-a203-9fee-f8d6-9bf3b8df94b9","id_father":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"C2.1","type":"concept","css_auto":"c_empty","content":""},
		{"id":"bb641357-4cf0-b472-ca26-71f8002d80b1","id_father":"71406f87-f52a-f2ba-6b5e-192bb004c0a4","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"C3","type":"concept","css_auto":"c_empty","css_manu":"c_hamecon","content":"",},
		{"id":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","id_father":"none","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"K0","type":"poche","css_auto":"p_full","content":""},
		{"id":"056ba124-16f5-079b-aceb-91112ae0d429","id_father":"none","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"new K1","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
		{"id":"0f0ce874-9dfb-c3cd-5b8c-d406d7c3421e","id_father":"056ba124-16f5-079b-aceb-91112ae0d429","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"new K2","type":"knowledge","css_auto":"k_empty","css_manu":"k_indesidable","content":"","inside":"inside"},
		{"id":"e4f15e74-8cd4-9514-ad56-27f7e5d2373a","id_father":"056ba124-16f5-079b-aceb-91112ae0d429","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"k3","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
		{"id":"9f29c86f-a57b-f3fe-78aa-982c8c1a7909","id_father":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","project":"cc69cead-5492-7b98-c294-3598ccd8238e","title":"K2","type":"knowledge","css_auto":"k_empty","css_manu":"k_validees","content":"","inside":"inside"} 
	];
	// k inside connu -> c_connu + 3 new k -> new C
	this.links = [
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:34:5","source":"2028019f-352b-9aec-2808-8e0f2f75895b","target":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:33:44.892Z","updatedAt":"2015-06-22T10:33:44.893Z","id":"a8587cee-f094-f9f6-ede3-8e4ebaf6c0da"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:43:28","source":"2028019f-352b-9aec-2808-8e0f2f75895b","target":"71406f87-f52a-f2ba-6b5e-192bb004c0a4","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:43:08.633Z","updatedAt":"2015-06-22T10:43:08.633Z","id":"eed245eb-8eae-f600-db40-f92d9ba7d04f"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:43:33","source":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","target":"45593cc2-3a70-ccd7-de75-cca0e9f330b5","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:43:13.440Z","updatedAt":"2015-06-22T10:43:13.440Z","id":"31635977-08b8-27ad-5cbc-4bb24bff7665"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:43:46","source":"71406f87-f52a-f2ba-6b5e-192bb004c0a4","target":"bb641357-4cf0-b472-ca26-71f8002d80b1","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:43:26.443Z","updatedAt":"2015-06-22T10:43:26.443Z","id":"d2ef1961-a7b6-db2f-3655-d2d3579c8708"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:44:4","source":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","target":"36c6b0cf-a203-9fee-f8d6-9bf3b8df94b9","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:43:43.994Z","updatedAt":"2015-06-22T10:43:43.994Z","id":"673925c7-c1e8-cc14-5df0-3545db7ed2cb"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:44:37","source":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","target":"bb233024-baf4-1a16-6ce3-e2b792963ed3","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:44:17.552Z","updatedAt":"2015-06-22T10:44:17.552Z","id":"8423910f-92cc-0390-1043-4fc5291f3b44"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:44:39","source":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","target":"aee4b226-2071-0791-ef3b-ef6e37146477","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:44:19.057Z","updatedAt":"2015-06-22T10:44:19.057Z","id":"f7d9066b-482a-7fd0-df3a-ea15906faa18"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:4","source":"056ba124-16f5-079b-aceb-91112ae0d429","target":"71406f87-f52a-f2ba-6b5e-192bb004c0a4","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:45:43.821Z","updatedAt":"2015-06-22T10:45:43.821Z","id":"eda83983-c9ac-bfba-7567-d10134babd6c"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:6","source":"0f0ce874-9dfb-c3cd-5b8c-d406d7c3421e","target":"bb641357-4cf0-b472-ca26-71f8002d80b1","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:45:46.114Z","updatedAt":"2015-06-22T10:45:46.114Z","id":"233769f2-bbac-c90d-2537-3ef242391bcf"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:10","source":"056ba124-16f5-079b-aceb-91112ae0d429","target":"0f0ce874-9dfb-c3cd-5b8c-d406d7c3421e","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:45:50.311Z","updatedAt":"2015-06-22T10:45:50.311Z","id":"103dd766-764b-917c-8bd3-eeb0d617898c"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:15","source":"056ba124-16f5-079b-aceb-91112ae0d429","target":"e4f15e74-8cd4-9514-ad56-27f7e5d2373a","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:45:55.621Z","updatedAt":"2015-06-22T10:45:55.621Z","id":"83682cb5-d7ed-a222-3203-7be5e828d345"},
		{"user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:23","source":"e4f15e74-8cd4-9514-ad56-27f7e5d2373a","target":"36c6b0cf-a203-9fee-f8d6-9bf3b8df94b9","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:46:03.503Z","updatedAt":"2015-06-22T10:46:03.503Z","id":"1d810b62-b83a-080d-3645-31dde9e4e5af"},
		{"id":"18e9a56d-e9b0-b722-3ce6-4136d9f5b736","user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:38","source":"aee4b226-2071-0791-ef3b-ef6e37146477","target":"2028019f-352b-9aec-2808-8e0f2f75895b","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:46:18.663Z","updatedAt":"2015-06-22T10:46:18.663Z"},
		{"id":"130af460-467c-7483-f5ae-44d1fb65b654","user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:41","source":"bb233024-baf4-1a16-6ce3-e2b792963ed3","target":"5a71e9cd-9cf7-3c74-dd07-f3a37ed8d3d7","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:46:21.052Z","updatedAt":"2015-06-22T10:46:21.052Z"},
		{"id":"6ee150c8-8471-e4c7-dbf1-a67e3aa6c522","user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:46:52","source":"9f29c86f-a57b-f3fe-78aa-982c8c1a7909","target":"45593cc2-3a70-ccd7-de75-cca0e9f330b5","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:46:32.656Z","updatedAt":"2015-06-22T10:46:32.656Z"},
		{"id":"74176b78-1d80-ca91-b86b-b7b45a145f22","user":"c48d28e1-affc-2fba-a704-989cddb59377","date":"22/5/2015-12:47:9","source":"8beb8c7a-deea-eb31-b261-6c628f2f7e03","target":"9f29c86f-a57b-f3fe-78aa-982c8c1a7909","project":"cc69cead-5492-7b98-c294-3598ccd8238e","concept":"","knowledge":"","createdAt":"2015-06-22T10:46:49.303Z","updatedAt":"2015-06-22T10:46:49.303Z"}
	];
	return this;
}
//////////////////////////////////////
// VARIABLE ELEMENT
//////////////////////////////////////
var k_1_vierge = function(){
	this.elements = [
		{"id":"3c74bc34-26f9-08c5-ad5f-7b3b450c150f","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"ds","type":"knowledge","css_auto":"k_empty","content":""},
	];
	this.links = [];
	return this;			
}

var k_1_inside_vierge = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"},
	];
	this.links = [];
	return this;			
}

var k_1_outside_vierge = function(){
	this.elements = [
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
	];
	this.links = [];
	return this;			
}

//////////////////////////////////////
var c_1_hamecon = function(){
	this.elements = [{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_hamecon"}];
	this.links = [];
}

var c_1_alternatif = function(){
	this.elements = [{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_alternatif"}];
	this.links = [];
}

var c_1_atteignable = function(){
	this.elements = [{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_atteignable"}];
	this.links = [];
}

var c_1_connu = function(){
	this.elements = [
		{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_connu"}
	];
	this.links = [];
}

var c_1_vierge = function(){
	this.elements = [
		{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"}
	];
	this.links = [];
}

var c_0_color = function(){
	this.elements = [
		{"id":"3838a922-0813-d8b2-cab4-8cf5c70a6913","date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3967.954545454545,"left":50006.73295454545,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"}
	];
	this.links = [];
}
///////////////////////////////
// COMBINAISONS
///////////////////////////////
var k2_vierge = function(){
	this.elements = [
		{"id":"3c74bc34-26f9-08c5-ad5f-7b3b450c150f","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"ds","type":"knowledge","css_auto":"k_empty","content":""},
		{"id":"531e2e70-aafe-f9ea-8d96-1f350dbaca82","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"ze","type":"knowledge","css_auto":"k_empty","content":""}
	];
}

var k1_inside_k1_outside = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"},
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"}
	];
}

var k1_inside_k1_vierge = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"},
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":""}
	];
}

var k1_outside_k1_vierge = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":""}
	];
}

var k2_outside_k1_inside = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"},
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"}
	];
}

var k2_inside_k1_outside = function(){
	this.elements = [
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"},
		{"id":"53ea2755-3b9c-4fda-fc12-51b35243c144","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"qs","type":"knowledge","css_auto":"k_empty","content":"","inside":"inside"},
		{"id":"ead52d95-94a1-efb8-79f3-1a5de3839b8a","id_father":"none","project":"27b6ef44-7224-254b-a7a1-1770e03e5516","status":"private","title":"llll","type":"knowledge","css_auto":"k_empty","content":"","inside":"outside"}
	];
}
// varibale pour suggestion 1
var c2_k3_sur10_non_norme = function(){
	this.elements = [
		{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":3997.3593805486503,"left":50092.812505548645,"createdAt":"2015-06-02T13:08:20.362Z","updatedAt":"2015-06-02T13:08:20.362Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},
		{"date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3879.3593805486503,"left":49863.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-02T13:08:23.290Z","updatedAt":"2015-06-02T13:45:34.021Z","css_auto":"c_empty","css_manu":"c_connu","id":"3838a922-0813-d8b2-cab4-8cf5c70a6913"},
		{"id":"ef50d1a6-bb2a-21b9-46fc-718ff8f9303b","date":"4/5/2015-16:22:9","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49606.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"},
		{"id":"ddea9846-cf21-3012-ccb8-544965b0e8d0","date":"4/5/2015-16:22:12","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49768.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"},
		{"id":"4d5b4c6a-e6d4-3c1d-01f7-72ac4e720088","date":"4/5/2015-16:22:15","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49930.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_atteignable"},
		{"id":"be2cde9f-56a3-0949-0b34-0ae695e9231d","date":"4/5/2015-16:22:22","type":"knowledge","id_father":"none","top":3964.166666666667,"left":50422.21354166667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"},
		{"id":"907ea0a2-795c-79b9-04e1-c02b55d13aac","date":"4/5/2015-16:22:26","type":"knowledge","id_father":"none","top":3882.5,"left":50437.76041666667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"},
		{"id":"6ebd745d-8c6d-44d9-11e0-0131edf95751","date":"4/5/2015-16:22:29","type":"knowledge","id_father":"none","top":3984.166666666667,"left":50704.973958333336,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty","css_manu":"k_manquante"},
		{"id":"deeb410c-787c-bf2d-947b-a3728fd5387d","date":"4/5/2015-16:22:32","type":"knowledge","id_father":"none","top":3925,"left":50723.85416666667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty","css_manu":"k_indesidable"},
		{"id":"7bac5dc8-1df6-3d81-bbac-bcd3084b462d","date":"4/5/2015-16:22:36","type":"knowledge","id_father":"none","top":4035,"left":50504.40104166667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"}
	];
}

// c_4_couleur
var c_4_color = function(){
	this.elements = [
		{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},
		{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"},
		{"date":"1/5/2015-16:54:26","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":50095,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:26.861Z","updatedAt":"2015-06-01T14:54:58.295Z","css_auto":"c_empty","css_manu":"c_alternatif","id":"62f2ce98-7088-c346-2b09-299734b948ef"},
		{"date":"1/5/2015-16:54:30","type":"concept","id_father":"62f2ce98-7088-c346-2b09-299734b948ef","top":4236,"left":50014,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:30.388Z","updatedAt":"2015-06-01T14:55:00.395Z","css_auto":"c_empty","css_manu":"c_hamecon","id":"d7a789bf-a566-1bb9-acff-1732d31430f9"},
		{"date":"1/5/2015-16:54:33","type":"concept","id_father":"62f2ce98-7088-c346-2b09-299734b948ef","top":4236,"left":50176,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:33.879Z","updatedAt":"2015-06-01T14:54:48.910Z","css_auto":"c_empty","id":"f78d00e9-5e39-12be-1b90-3d087105fef0"}
	];
	this.links = [
		{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"},
		{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:27","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"62f2ce98-7088-c346-2b09-299734b948ef","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:27.287Z","updatedAt":"2015-06-01T14:54:27.287Z","id":"38e133dd-c69c-0d4c-b54c-b250b0406c8e"},
		{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:43","source":"62f2ce98-7088-c346-2b09-299734b948ef","target":"d7a789bf-a566-1bb9-acff-1732d31430f9","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:43.799Z","updatedAt":"2015-06-01T14:54:43.799Z","id":"0d22f950-03fc-e2df-76ea-52f60a6bd2cd"},
		{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:45","source":"62f2ce98-7088-c346-2b09-299734b948ef","target":"f78d00e9-5e39-12be-1b90-3d087105fef0","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:45.929Z","updatedAt":"2015-06-01T14:54:45.929Z","id":"bf2eddb2-2314-c796-d01a-be145dd8971b"}
	];
}

var c_2_connu_atteignable = function(){
	this.elements = [
		{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},
		{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"}
	];
	this.links = [{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"}];
}

var c_3_connu_atteignable_alternatif = function(){
	this.elements = [{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},
{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"},
{"id":"7689804a-7c68-07fb-3214-fecac492a8d4","date":"2/5/2015-15:6:32","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4107.71875554865,"left":50031.81249445135,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_alternatif"}];
	this.links = [{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"},
{"id":"2283d9ba-736a-cf72-6ebc-35dade2313da","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"2/5/2015-15:6:33","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"7689804a-7c68-07fb-3214-fecac492a8d4","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-02T13:06:33.397Z","updatedAt":"2015-06-02T13:06:33.397Z"}];
}
