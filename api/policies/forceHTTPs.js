module.exports = function(req,res,next){
	console.log(req.baseUrl, req.url )
		var u = req.baseUrl.replace("http","https");

	if(req.baseUrl == "http://localhost:1337"){
		next()
	} 
	else{
	    if(req.headers['x-forwarded-proto']!='https'){
	    	var u = req.baseUrl.replace("http","https");
	    	u = u.slice(0, u.lastIndexOf(":"))
			res.redirect(u+req.url)
	    }
	    else{
	      next() /* Continue to other routes if we're not redirecting */
		}
	}

  };