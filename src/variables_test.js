function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);};
function guid() {return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();}
function getDate(){now=new Date();return now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear()+'-'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();}
//////////////////////////////////////
var element_generator = function(json){
	var model = {
		"id": guid(),
		"id_father": json.id_father || "none",
		"project": json.project || "27b6ef44-7224-254b-a7a1-1770e03e5516",
		"title": json.title || "title",
		"type": json.type || "",
		"css_auto": json.css_auto || "",
		"css_manu": json.css_manu || "",
		"content": json.content || "content",
		"inside": json.inside ||  ""
	}

	return model;
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
	this.elements = [{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":3997.3593805486503,"left":50092.812505548645,"createdAt":"2015-06-02T13:08:20.362Z","updatedAt":"2015-06-02T13:08:20.362Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},{"date":"2/5/2015-15:8:23","type":"concept","id_father":"none","top":3879.3593805486503,"left":49863.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-02T13:08:23.290Z","updatedAt":"2015-06-02T13:45:34.021Z","css_auto":"c_empty","css_manu":"c_connu","id":"3838a922-0813-d8b2-cab4-8cf5c70a6913"},{"id":"ef50d1a6-bb2a-21b9-46fc-718ff8f9303b","date":"4/5/2015-16:22:9","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49606.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"},{"id":"ddea9846-cf21-3012-ccb8-544965b0e8d0","date":"4/5/2015-16:22:12","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49768.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty"},{"id":"4d5b4c6a-e6d4-3c1d-01f7-72ac4e720088","date":"4/5/2015-16:22:15","type":"concept","id_father":"3838a922-0813-d8b2-cab4-8cf5c70a6913","top":3997.3593805486503,"left":49930.812505548645,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_atteignable"},{"id":"be2cde9f-56a3-0949-0b34-0ae695e9231d","date":"4/5/2015-16:22:22","type":"knowledge","id_father":"none","top":3964.166666666667,"left":50422.21354166667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"},{"id":"907ea0a2-795c-79b9-04e1-c02b55d13aac","date":"4/5/2015-16:22:26","type":"knowledge","id_father":"none","top":3882.5,"left":50437.76041666667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"},{"id":"6ebd745d-8c6d-44d9-11e0-0131edf95751","date":"4/5/2015-16:22:29","type":"knowledge","id_father":"none","top":3984.166666666667,"left":50704.973958333336,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty","css_manu":"k_manquante"},{"id":"deeb410c-787c-bf2d-947b-a3728fd5387d","date":"4/5/2015-16:22:32","type":"knowledge","id_father":"none","top":3925,"left":50723.85416666667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty","css_manu":"k_indesidable"},{"id":"7bac5dc8-1df6-3d81-bbac-bcd3084b462d","date":"4/5/2015-16:22:36","type":"knowledge","id_father":"none","top":4035,"left":50504.40104166667,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new knowledge","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #2980B9;background: #ffffff;border: solid #2980B9 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"k_empty"}];
}

// c_4_couleur
var c_4_color = function(){
	this.elements = [{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"},{"date":"1/5/2015-16:54:26","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":50095,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:26.861Z","updatedAt":"2015-06-01T14:54:58.295Z","css_auto":"c_empty","css_manu":"c_alternatif","id":"62f2ce98-7088-c346-2b09-299734b948ef"},{"date":"1/5/2015-16:54:30","type":"concept","id_father":"62f2ce98-7088-c346-2b09-299734b948ef","top":4236,"left":50014,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:30.388Z","updatedAt":"2015-06-01T14:55:00.395Z","css_auto":"c_empty","css_manu":"c_hamecon","id":"d7a789bf-a566-1bb9-acff-1732d31430f9"},{"date":"1/5/2015-16:54:33","type":"concept","id_father":"62f2ce98-7088-c346-2b09-299734b948ef","top":4236,"left":50176,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:33.879Z","updatedAt":"2015-06-01T14:54:48.910Z","css_auto":"c_empty","id":"f78d00e9-5e39-12be-1b90-3d087105fef0"}];
	this.links = [{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"},{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:27","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"62f2ce98-7088-c346-2b09-299734b948ef","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:27.287Z","updatedAt":"2015-06-01T14:54:27.287Z","id":"38e133dd-c69c-0d4c-b54c-b250b0406c8e"},{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:43","source":"62f2ce98-7088-c346-2b09-299734b948ef","target":"d7a789bf-a566-1bb9-acff-1732d31430f9","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:43.799Z","updatedAt":"2015-06-01T14:54:43.799Z","id":"0d22f950-03fc-e2df-76ea-52f60a6bd2cd"},{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:45","source":"62f2ce98-7088-c346-2b09-299734b948ef","target":"f78d00e9-5e39-12be-1b90-3d087105fef0","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:45.929Z","updatedAt":"2015-06-01T14:54:45.929Z","id":"bf2eddb2-2314-c796-d01a-be145dd8971b"}];
}

var c_2_connu_atteignable = function(){
	this.elements = [
		{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},
		{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"}
	];
	this.links = [{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"}];
}

var c_3_connu_atteignable_alternatif = function(){
	this.elements = [{"title":"c0 : c_4_couleur","content":"","date":"1/5/2015-16:54:16","position":0,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","attachment":[],"type":"concept","id_father":"none","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;padding: 10px 20px 10px 20px;border: solid #27AE60 2px;text-decoration: none;","top":4000,"left":50000,"createdAt":"2015-06-01T14:54:16.556Z","updatedAt":"2015-06-01T14:54:53.494Z","visibility":true,"css_auto":"c_empty","comments":[],"date2":"","color":"#C0392B","status":"private","displayChildrens":true,"css_manu":"c_connu","id":"7ad8e8bd-14e4-9126-b602-453e73152f6d"},{"date":"1/5/2015-16:54:23","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4118,"left":49852,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"createdAt":"2015-06-01T14:54:23.207Z","updatedAt":"2015-06-01T14:54:55.804Z","css_auto":"c_empty","css_manu":"c_atteignable","id":"9cf4546a-6cba-ab25-c5cf-c807136d5dde"},{"id":"7689804a-7c68-07fb-3214-fecac492a8d4","date":"2/5/2015-15:6:32","type":"concept","id_father":"7ad8e8bd-14e4-9126-b602-453e73152f6d","top":4107.71875554865,"left":50031.81249445135,"project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","title":"new concept","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","css":"-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #27AE60;background: #ffffff;border: solid #27AE60 2px;text-decoration: none;","visibility":true,"content":"","comments":[],"date2":"","attachment":[],"color":"#C0392B","status":"private","displayChildrens":true,"css_auto":"c_empty","css_manu":"c_alternatif"}];
	this.links = [{"user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"1/5/2015-16:54:23","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"9cf4546a-6cba-ab25-c5cf-c807136d5dde","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-01T14:54:23.685Z","updatedAt":"2015-06-01T14:54:23.685Z","id":"82e35de4-d3fa-8b40-8fd1-181d7207efa4"},{"id":"2283d9ba-736a-cf72-6ebc-35dade2313da","user":"7bda5ad7-18db-5328-f604-ce661b44ff42","date":"2/5/2015-15:6:33","source":"7ad8e8bd-14e4-9126-b602-453e73152f6d","target":"7689804a-7c68-07fb-3214-fecac492a8d4","project":"6f71d386-a63c-0ff9-20ba-f05171ce7ca1","concept":"","knowledge":"","createdAt":"2015-06-02T13:06:33.397Z","updatedAt":"2015-06-02T13:06:33.397Z"}];
}
