alfred = {
	//////////////////////////////
  	// WIKIPEDIA
  	//////////////////////////////
  	// One query, example code:
	getWikiDef :function(item){
		var lg = "fr";
		var option1 = "extracts&exintro&explaintext&format=json&redirects&callback=?";
		var option2 = "extracts&exintro&format=json&redirects&callback=?";
		url = "https://"+lg+".wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop="+option2;
		$.getJSON(url, function (json) {
		    var item_id = Object.keys(json.query.pages)[0]; // THIS DO THE TRICK !
		    sent = json.query.pages[item_id].extract;
		    console.log(sent);
		});
	},
	getWikiSuggestion : function(item){
		var url = 'https://fr.wikipedia.org/w/api.php?action=opensearch&search='+item.toString()+'&format=json&callback=spellcheck';
		$.getJSON(url, function (json) {
			console.log(json)
		});
	},
	//////////////////////////////
  // API Google search
  //////////////////////////////
  googleSearch : function(term){
  	var settings = {
	    term        : term, // the term what you want to looking for
	    siteURL     : 'http://fr.wikipedia.org/',   // Change this to your site
	    //siteURL     : 'http://fr.wiktionary.org/',   // Change this to your site
	    searchSite  : true,    // filter search on the site or not
	    type        : "web",// images / news / video / web
	    perPage     : 8,    // A maximum of 8 is allowed by Google
	    page        : 0,    // The start page
	    protocol    : 'https', // http or https 
	}
    // el have to be element view container
    // setting have to be like:
    // this.settings = {
    //   term        : 'title', // the term what you want to looking for
    //   siteURL     : 'creaktive.fr',   // Change this to your site
    //   searchSite  : false, // filter search on the site or not
    //   type        : 'images', // images / news / video / web
    //   append      : false, // append new element to el
    //   perPage     : 8,            // A maximum of 8 is allowed by Google
    //   page        : 0             // The start page
    //   protocol    : 'https', // http or https 
    //   more        : true, // display or not the more button
    //   width       : this.width, // display or not the more button
    // }

    if(settings.searchSite){
        // Using the Google site:example.com to limit the search to a
        // specific domain:
        settings.term = 'site:'+settings.siteURL+' '+settings.term;
    }
    // URL of Google's AJAX search API
    var apiURL = settings.protocol+'://ajax.googleapis.com/ajax/services/search/'+settings.type+'?v=1.0&callback=?';
    $.getJSON(apiURL,{q:settings.term,rsz:settings.perPage,start:settings.page*settings.perPage},function(r){
        
        try{
          var results = r.responseData.results;
          console.log(results)
        }catch(err){
          console.log("google search send no result...")
        }
        
    });
  },
}